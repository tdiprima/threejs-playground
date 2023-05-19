let halfFloatTextures = false;
let floatTextures = false;

function checkFloatTextures() {
  let ctx = document.createElement("canvas").getContext("experimental-webgl");
  floatTextures = ctx.getExtension("OES_texture_float");
  halfFloatTextures = ctx.getExtension("OES_texture_half_float");

  return floatTextures || halfFloatTextures;
}

function check() {
  if (checkFloatTextures()) init();
}

let size;
let inFrame = false;

let presetsDesktop = [
  { name: "almost none", q: 32 },
  { name: "a few", q: 64 },
  { name: "some", q: 128 },
  { name: "regular", q: 256 },
  { name: "quite a few", q: 512 },
  { name: "a lot", q: 1024 },
  { name: "INSANE", q: 2048 }
];

let presetMobile = [
  { name: "64", q: 8 },
  { name: "256", q: 16 },
  { name: "1024", q: 32 },
  { name: "4096", q: 64 },
  { name: "16384", q: 128 },
  { name: "65536", q: 256 }
];

if (Detector.webgl) {
  if (window.location.hash.indexOf("frame") !== -1) {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("minIntro").classList.add("hidden");

    let re = /#frame.([\d]+)/;
    let str = window.location.hash;
    var m;

    if ((m = re.exec(str)) !== null) {
      if (m.index === re.lastIndex) {
        re.lastIndex++;
      }

      size = m[1];
    }
    inFrame = true;
  } else {
    size = parseInt(window.location.hash.substr(1)) || (isMobile.any ? 32 : 256);
  }
  console.log("%csize", "color: #F99157;", size);

  window.addEventListener("load", init, false);
} else {
  document.getElementById("error").classList.remove("hidden");
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("minIntro").classList.remove("hidden");
}

let container;

let scene, camera, light, renderer, controls;
let geometry, cube, mesh, material, shadowMaterial, plane;
let timer, start, prevTime;

let data, texture, points;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let sim;
let nOffset = new THREE.Vector3(0, 0, 0);
var tmpVector = new THREE.Vector3(0, 0, 0);

let proxy;

var shadowBuffer, shadowBufferSize, shadowCamera, shadowDebug;

let colors = [
  0xed6a5a,
  0xf4f1bb,
  0x9bc1bc,
  0x5ca4a9,
  0xe6ebe0,
  0xf0b67f,
  0xfe5f55,
  0xd6d1b1,
  0xc7efcf,
  0xeef5db,
  0x50514f,
  0xf25f5c,
  0xffe066,
  0x247ba0,
  0x70c1b3
];

let scale = 0, nScale = 1;

let params = {
  type: 2,
  spread: 4,
  factor: 0.5,
  evolution: 0.5,
  rotation: 0.5,
  radius: 2,
  pulsate: false,
  scaleX: 0.1,
  scaleY: 1,
  scaleZ: 5,
  scale: 1
};

let gui;

function init() {
  if (!inFrame) {
    gui = new dat.GUI();

    gui.add(params, "factor", 0.1, 1);
    gui.add(params, "evolution", 0, 1);
    gui.add(params, "rotation", 0, 1);
    gui.add(params, "radius", 0, 4);
    gui.add(params, "pulsate");
    gui.add(params, "scaleX", 0.1, 10);
    gui.add(params, "scaleY", 0.1, 10);
    gui.add(params, "scaleZ", 0.1, 10);
    gui.add(params, "scale", 0.1, 2);

    if (isMobile.any) {
      console.log("%cisMobile", "color: #F99157;", isMobile.any);
      gui.close();
    }

    let sizeOptions = document.getElementById("size-options");
    let presets = isMobile.any ? presetMobile : presetsDesktop;
    presets.forEach(function(p) {
      let span = document.createElement("span");
      let a = document.createElement("a");
      a.textContent = p.name;
      a.setAttribute("href", `#${p.q}`);
      span.appendChild(a);
      sizeOptions.appendChild(span);
    });
  }

  container = document.getElementById("container");

  renderer = new THREE.WebGLRenderer({ antialias: true });
  // renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xff00ff);
  container.appendChild(renderer.domElement);

  plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10000, 10000),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, visible: true })
  );

  scene = new THREE.Scene();
  plane.material.visible = false;

  scene.add(plane);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
  scene.add(camera);
  camera.position.z = 8;

  let s = 15;
  shadowCamera = new THREE.OrthographicCamera(-s, s, s, -s, 0.1, 20);
  shadowCamera.position.set(10, 4, 10);
  shadowCamera.lookAt(scene.position);

  let light = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 6, 1, 36),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );

  light.position.copy(shadowCamera.position);
  scene.add(light);
  light.lookAt(scene.position);
  light.rotation.y += Math.PI / 2;
  light.rotation.z += Math.PI / 2;

  let encasing = new THREE.Mesh(
    new THREE.CylinderGeometry(5.1, 6.1, 0.9, 36),
    new THREE.MeshBasicMaterial({ color: 0x101010 })
  );

  encasing.position.copy(shadowCamera.position);
  scene.add(encasing);
  encasing.lookAt(scene.position);
  encasing.rotation.y += Math.PI / 2;
  encasing.rotation.z += Math.PI / 2;

  let b = new THREE.CameraHelper(shadowCamera);
  // scene.add( b );

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  sim = new Simulation(renderer, size, size);

  shadowBufferSize = Math.min(
    isMobile.any ? 1024 : 2048,
    renderer.context.getParameter(renderer.context.MAX_TEXTURE_SIZE)
  );

  console.log("%cshadowBufferSize", "color: #ff00cc;", shadowBufferSize); // 2048

  shadowBuffer = new THREE.WebGLRenderTarget(shadowBufferSize, shadowBufferSize, {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: isMobile.any ? THREE.NearestFilter : THREE.LinearMipMapLinear,
    magFilter: isMobile.any ? THREE.NearestFilter : THREE.LinearFilter,
    format: THREE.RGBAFormat
  });

  let geometry = new THREE.BufferGeometry();

  let positionsLength = sim.width * sim.height * 3 * 18;
  let positions = new Float32Array(positionsLength);

  let p = 0;
  for (var j = 0; j < positionsLength; j += 3) {
    positions[j] = p;
    positions[j + 1] = Math.floor(p / 18);
    positions[j + 2] = p % 18;
    p++;
  }

  geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));

  let diffuseData = new Uint8Array(sim.width * sim.height * 4);
  for (var j = 0; j < sim.width * sim.height * 4; j += 4) {
    let c = new THREE.Color(colors[~~(Math.random() * colors.length)]);
    diffuseData[j + 0] = c.r * 255;
    diffuseData[j + 1] = c.g * 255;
    diffuseData[j + 2] = c.b * 255;
  }

  let diffuseTexture = new THREE.DataTexture(diffuseData, sim.width, sim.height, THREE.RGBAFormat);
  diffuseTexture.minFilter = THREE.NearestFilter;
  diffuseTexture.magFilter = THREE.NearestFilter;
  diffuseTexture.needsUpdate = true;

  material = new THREE.RawShaderMaterial({
    uniforms: {
      map: { type: "t", value: sim.rtTexturePos },
      prevMap: { type: "t", value: sim.rtTexturePos },
      diffuse: { type: "t", value: diffuseTexture },
      width: { type: "f", value: sim.width },
      height: { type: "f", value: sim.height },
      dimensions: { type: "v2", value: new THREE.Vector2(shadowBufferSize, shadowBufferSize) },

      timer: { type: "f", value: 0 },
      spread: { type: "f", value: 4 },
      boxScale: { type: "v3", value: new THREE.Vector3() },
      meshScale: { type: "f", value: 1 },

      depthTexture: { type: "t", value: shadowBuffer },
      shadowV: { type: "m4", value: new THREE.Matrix4() },
      shadowP: { type: "m4", value: new THREE.Matrix4() },
      resolution: { type: "v2", value: new THREE.Vector2(shadowBufferSize, shadowBufferSize) },
      lightPosition: { type: "v3", value: new THREE.Vector3() },
      projector: { type: "t", value: THREE.ImageUtils.loadTexture("spotlight.jpg") },

      boxVertices: {
        type: "3fv",
        value: [
          -1, -1, -1,
          -1, -1, 1,
          -1, 1, 1,

          -1, -1, -1,
          -1, 1, 1,
          -1, 1, -1,

          1, 1, -1,
          1, -1, -1,
          -1, -1, -1,

          1, 1, -1,
          -1, -1, -1,
          -1, 1, -1,

          1, -1, 1,
          -1, -1, 1,
          -1, -1, -1,

          1, -1, 1,
          -1, -1, -1,
          1, -1, -1,

          1, 1, 1,
          1, -1, 1,
          1, -1, -1,

          1, 1, -1,
          1, 1, 1,
          1, -1, -1,

          -1, -1, 1,
          1, -1, 1,
          1, 1, 1,

          -1, 1, 1,
          -1, -1, 1,
          1, 1, 1,

          -1, 1, -1,
          -1, 1, 1,
          1, 1, 1,

          1, 1, -1,
          -1, 1, -1,
          1, 1, 1
        ]
      },
      boxNormals: {
        type: "3fv",
        value: [
          1, 0, 0,
          0, 0, 1,
          0, 1, 0
        ]
      }
    },
    vertexShader: document.getElementById("vs-particles").textContent,
    fragmentShader: document.getElementById("fs-particles").textContent,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

  mesh = new THREE.Mesh(geometry, material);

  shadowMaterial = new THREE.RawShaderMaterial({
    uniforms: {
      map: { type: "t", value: sim.rtTexturePos },
      prevMap: { type: "t", value: sim.rtTexturePos },
      width: { type: "f", value: sim.width },
      height: { type: "f", value: sim.height },

      timer: { type: "f", value: 0 },
      boxScale: { type: "v3", value: new THREE.Vector3() },
      meshScale: { type: "f", value: 1 },

      shadowV: { type: "m4", value: new THREE.Matrix4() },
      shadowP: { type: "m4", value: new THREE.Matrix4() },
      resolution: { type: "v2", value: new THREE.Vector2(shadowBufferSize, shadowBufferSize) },
      lightPosition: { type: "v3", value: new THREE.Vector3() },

      boxVertices: {
        type: "3fv",
        value: [
          -1, -1, -1,
          -1, -1, 1,
          -1, 1, 1,

          -1, -1, -1,
          -1, 1, 1,
          -1, 1, -1,

          1, 1, -1,
          1, -1, -1,
          -1, -1, -1,

          1, 1, -1,
          -1, -1, -1,
          -1, 1, -1,

          1, -1, 1,
          -1, -1, 1,
          -1, -1, -1,

          1, -1, 1,
          -1, -1, -1,
          1, -1, -1,

          1, 1, 1,
          1, -1, 1,
          1, -1, -1,

          1, 1, -1,
          1, 1, 1,
          1, -1, -1,

          -1, -1, 1,
          1, -1, 1,
          1, 1, 1,

          -1, 1, 1,
          -1, -1, 1,
          1, 1, 1,

          -1, 1, -1,
          -1, 1, 1,
          1, 1, 1,

          1, 1, -1,
          -1, 1, -1,
          1, 1, 1
        ]
      },
      boxNormals: {
        type: "3fv",
        value: [
          1, 0, 0,
          0, 0, 1,
          0, 1, 0,

          -1, 0, 0,
          0, 0, -1,
          0, -1, 0
        ]
      }
    },
    vertexShader: document.getElementById("vs-particles").textContent,
    fragmentShader: document.getElementById("fs-particles-shadow").textContent,
    side: THREE.DoubleSide
  });

  scene.add(mesh);

  proxy = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 2), new THREE.MeshNormalMaterial());
  // scene.add( proxy );
  proxy.material.visible = false;

  let center = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
  // scene.add( center );

  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onWindowResize();

  let isIntersect = false;

  window.addEventListener("mousemove", function(e) {
    mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
  });

  renderer.domElement.addEventListener("touchmove", function(e) {
    mouse.x = (e.touches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.touches[0].clientY / renderer.domElement.clientHeight) * 2 + 1;
  });

  window.addEventListener("mousedown", function(e) {
    nScale = 2;
  });

  window.addEventListener("mouseup", function(e) {
    nScale = 0.5;
  });

  window.addEventListener("keydown", function(e) {
    if (e.keyCode === 32) {
      sim.simulationShader.uniforms.active.value = 1 - sim.simulationShader.uniforms.active.value;
    }
  });

  window.addEventListener("touchmove", function(e) {
    mouse.x = (e.touches[0].clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(e.touches[0].clientY / renderer.domElement.clientHeight) * 2 + 1;
  });

  shadowDebug = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ map: shadowBuffer, side: THREE.DoubleSide })
  );
  // scene.add( shadowDebug );

  document.getElementById("loading").style.display = "none";
  document.getElementById("loaded").style.display = "block";

  animate();
}

function animate() {
  render();
  requestAnimationFrame(animate);
}

let t = new THREE.Clock();
var m = new THREE.Matrix4();
let v = new THREE.Vector3();

var tmpVector = new THREE.Vector3();

function render() {
  controls.update();

  scale += (nScale - scale) * 0.01;

  plane.lookAt(camera.position);

  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObject(plane);

  if (intersects.length) {
    nOffset.copy(intersects[0].point);
    proxy.position.copy(nOffset);
  }

  let delta = t.getDelta() * 10;
  let time = t.elapsedTime;

  if (inFrame) {
    let r = 3;
    nOffset.set(r * Math.sin(time), r * Math.cos(0.9 * time), 0);
  }

  tmpVector.copy(nOffset);
  tmpVector.sub(sim.simulationShader.uniforms.offset.value);
  tmpVector.multiplyScalar(0.1);

  sim.simulationShader.uniforms.offset.value.add(tmpVector);
  sim.simulationShader.uniforms.factor.value = params.factor;
  sim.simulationShader.uniforms.evolution.value = params.evolution;

  sim.simulationShader.uniforms.radius.value = params.pulsate
    ? (0.5 + 0.5 * Math.cos(time)) * params.radius
    : params.radius;

  if (sim.simulationShader.uniforms.active.value) {
    mesh.rotation.y = params.rotation * time;
  }

  m.copy(mesh.matrixWorld);
  sim.simulationShader.uniforms.inverseModelViewMatrix.value.getInverse(m);
  sim.simulationShader.uniforms.genScale.value = scale;

  if (sim.simulationShader.uniforms.active.value === 1) {
    sim.render(time, delta);
  }

  material.uniforms.map.value = shadowMaterial.uniforms.map.value = sim.targets[sim.targetPos];
  material.uniforms.prevMap.value = shadowMaterial.uniforms.prevMap.value = sim.targets[1 - sim.targetPos];

  material.uniforms.spread.value = params.spread;
  material.uniforms.timer.value = shadowMaterial.uniforms.timer.value = time;
  material.uniforms.boxScale.value.set(params.scaleX, params.scaleY, params.scaleZ);
  shadowMaterial.uniforms.boxScale.value.set(params.scaleX, params.scaleY, params.scaleZ);
  material.uniforms.meshScale.value = params.scale;
  shadowMaterial.uniforms.meshScale.value = params.scale;

  renderer.setClearColor(0);
  mesh.material = shadowMaterial;
  renderer.render(scene, shadowCamera, shadowBuffer);

  tmpVector.copy(scene.position);
  tmpVector.sub(shadowCamera.position);
  tmpVector.normalize();

  m.makeRotationY(-mesh.rotation.y);
  v.copy(shadowCamera.position);
  v.applyMatrix4(m);

  material.uniforms.shadowP.value.copy(shadowCamera.projectionMatrix);
  material.uniforms.shadowV.value.copy(shadowCamera.matrixWorldInverse);
  material.uniforms.lightPosition.value.copy(v);

  renderer.setClearColor(0x202020);
  mesh.material = material;
  renderer.render(scene, camera);
}

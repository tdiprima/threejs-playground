// curl noise
// https://petewerner.blogspot.jp/2015/02/intro-to-curl-noise.html

// inspired by
// https://www.clicktorelease.com/code/polygon-shredder/

window.onload = () => {
  let webgl = new Webgl();
  window.onresize = () => {
    webgl.resize();
  };
};

class Webgl {
  constructor() {
    // this.size = 128; // TODO: CHANGE SIZE
    this.size = 16;
    this.widthW = document.body.clientWidth;
    this.heightW = window.innerHeight;
    this.init();
  }

  init() {
    this.container = document.getElementById("wrapper");
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize(this.widthW, this.heightW);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.colorPallete = [
      new THREE.Color(0x000000),
      new THREE.Color(0xc900ff),
      new THREE.Color(0x09ff00),
      new THREE.Color(0xff9a00)
    ];

    this.camera = new THREE.PerspectiveCamera(45, this.widthW / this.heightW, 0.01, 10000);
    this.scene.add(this.camera);
    this.camera.position.set(-0.1, 4.0, 0.1);

    new THREE.OrbitControls(this.camera, this.renderer.domElement);

    this.sim = new Simulation(this.renderer, this.size);

    this.setLight();
    this.createObj();

    this.time = new THREE.Clock();
    this.render();
  }

  setLight() {
    this.light = new THREE.DirectionalLight(0xffaa55);
    this.light.position.set(-4, -6, 10);
    this.light.castShadow = true;
    this.shadowCamera = this.light.shadow.camera;
    // this.shadowCamera.position.set(-4, -6, 10);
    this.shadowCamera.lookAt(this.scene.position);

    this.light.shadow.matrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );

    this.light.shadow.matrix.multiply(this.shadowCamera.projectionMatrix);
    this.light.shadow.matrix.multiply(this.shadowCamera.matrixWorldInverse);

    if (this.light.shadow.map === null) {
      this.light.shadow.mapSize.x = 2048;
      this.light.shadow.mapSize.y = 2048;

      let pars = {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat
      };

      this.light.shadow.map = new THREE.WebGLRenderTarget(
        this.light.shadow.mapSize.x,
        this.light.shadow.mapSize.y,
        pars
      );
      // light.shadow.map.texture.name = light.name + ".shadowMap";
    }

  }

  createObj() {
    // var originalG = new THREE.BoxBufferGeometry(1, 1, 1);
    let originalG = new THREE.OctahedronBufferGeometry(1, 0);

    let geometry = new THREE.InstancedBufferGeometry();

    // vertex
    let vertices = originalG.attributes.position.clone();

    geometry.addAttribute("position", vertices);

    let normals = originalG.attributes.normal.clone();
    geometry.addAttribute("normal", normals);

    // uv
    let uvs = originalG.attributes.uv.clone();
    geometry.addAttribute("uv", uvs);

    // index
    // var indices = originalG.index.clone();
    // geometry.setIndex(indices);

    geometry.maxInstancedCount = this.sim.size * this.sim.size;

    let nums = new THREE.InstancedBufferAttribute(new Float32Array(this.sim.size * this.sim.size * 1), 1, 1);
    let randoms = new THREE.InstancedBufferAttribute(new Float32Array(this.sim.size * this.sim.size * 1), 1, 1);
    let colors = new THREE.InstancedBufferAttribute(new Float32Array(this.sim.size * this.sim.size * 3), 3, 1);

    for (let i = 0; i < nums.count; i++) {
      let _color = this.colorPallete[Math.floor(Math.random() * this.colorPallete.length)];

      nums.setX(i, i);
      randoms.setX(i, Math.random() * 0.5 + 1);
      colors.setXYZ(i, _color.r, _color.g, _color.b);
    }

    geometry.addAttribute("aNum", nums);
    geometry.addAttribute("aRandom", randoms);
    geometry.addAttribute("aColor", colors);

    let scale = {
      x: 2,
      y: 8,
      z: 2
    };

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        posMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture
        },
        velMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture
        },
        size: {
          type: "f",
          value: this.sim.size
        },

        timer: {
          type: "f",
          value: 0
        },
        boxScale: {
          type: "v3",
          value: new THREE.Vector3(scale.x, scale.y, scale.z)
        },
        meshScale: {
          type: "f",
          value: 0.7
        },

        shadowMap: {
          type: "t",
          value: this.light.shadow.map
        },
        shadowMapSize: {
          type: "v2",
          value: this.light.shadow.mapSize
        },
        shadowBias: {
          type: "f",
          value: this.light.shadow.bias
        },
        shadowRadius: {
          type: "f",
          value: this.light.shadow.radius
        },

        // Line 217 in https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLShadowMap.js
        shadowMatrix: {
          type: "m4",
          value: this.light.shadow.matrix
        },
        lightPosition: {
          type: "v3",
          value: this.light.position
        }
      },

      vertexShader: document.getElementById("vs-particles").textContent,
      fragmentShader: document.getElementById("fs-particles").textContent,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.mesh);

    this.shadowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        posMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture
        },
        velMap: {
          type: "t",
          value: this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture
        },
        size: {
          type: "f",
          value: this.sim.size
        },

        timer: {
          type: "f",
          value: 0
        },
        boxScale: {
          type: "v3",
          value: new THREE.Vector3(scale.x, scale.y, scale.z)
        },
        meshScale: {
          type: "f",
          value: 0.7
        },

        shadowMatrix: {
          type: "m4",
          value: this.light.shadow.matrix
        },
        lightPosition: {
          type: "v3",
          value: this.light.position
        }
      },
      vertexShader: document.getElementById("vs-particles").textContent,
      fragmentShader: document.getElementById("fs-particles-shadow").textContent,
      side: THREE.DoubleSide
    });
  }

  render() {
    let delta = this.time.getDelta() * 4;
    let time = this.time.elapsedTime;

    this.sim.velUniforms.timer.value = time;
    this.sim.velUniforms.delta.value = delta;

    this.sim.gpuCompute.compute();

    this.material.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
    this.material.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

    this.shadowMaterial.uniforms.posMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.pos).texture;
    this.shadowMaterial.uniforms.velMap.value = this.sim.gpuCompute.getCurrentRenderTarget(this.sim.vel).texture;

    this.material.uniforms.timer.value = this.shadowMaterial.uniforms.timer.value = time;

    this.mesh.material = this.shadowMaterial;
    this.renderer.render(this.scene, this.shadowCamera, this.light.shadow.map);

    this.renderer.setClearColor(0x00000070);
    this.mesh.material = this.material;
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  resize() {
    this.widthW = document.body.clientWidth;
    this.heightW = window.innerHeight;

    this.camera.aspect = this.widthW / this.heightW;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.widthW, this.heightW);
  }
}

class Simulation {
  constructor(renderer, size) {
    this.renderer = renderer;
    this.size = size;
    this.init();
  }

  init() {
    this.gpuCompute = new GPUComputationRenderer(this.size, this.size, this.renderer);

    this.dataPos = this.gpuCompute.createTexture();
    this.dataVel = this.gpuCompute.createTexture();
    this.dataDef = this.gpuCompute.createTexture();

    let posArray = this.dataPos.image.data;
    let velArray = this.dataVel.image.data;
    let defArray = this.dataDef.image.data;

    for (let i = 0, il = posArray.length; i < il; i += 4) {
      let phi = Math.random() * 2 * Math.PI;
      let theta = Math.random() * Math.PI;
      let r = 0.8 + Math.random() * 2;

      defArray[i] = posArray[i] = r * Math.sin(theta) * Math.cos(phi);
      defArray[i + 1] = posArray[i + 1] = r * Math.sin(theta) * Math.sin(phi);
      defArray[i + 2] = posArray[i + 2] = r * Math.cos(theta);

      velArray[i + 3] = Math.random() * 100; // frames life
      // if(i < 50) console.log(velArray[ i + 3 ])
    }

    this.def = this.gpuCompute.addVariable(
      "defTex",
      document.getElementById("simulation_def").textContent,
      this.dataDef
    );

    this.vel = this.gpuCompute.addVariable(
      "velTex",
      document.getElementById("simulation_vel").textContent,
      this.dataVel
    );

    this.pos = this.gpuCompute.addVariable(
      "posTex",
      document.getElementById("simulation_pos").textContent,
      this.dataPos
    );

    this.gpuCompute.setVariableDependencies(this.def, [this.pos, this.vel, this.def]);
    this.gpuCompute.setVariableDependencies(this.vel, [this.pos, this.vel, this.def]);
    this.gpuCompute.setVariableDependencies(this.pos, [this.pos, this.vel, this.def]);

    // var posUniforms = this.pos.material.uniforms;
    this.velUniforms = this.vel.material.uniforms;

    this.velUniforms.timer = { value: 0.0 };
    this.velUniforms.delta = { value: 0.0 };
    this.velUniforms.speed = { value: 0.5 };
    this.velUniforms.factor = { value: 0.5 };
    this.velUniforms.evolution = { value: 0.5 };
    this.velUniforms.radius = { value: 2.0 };

    let error = this.gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }
  }
}

// Setup WebGL.
let c = document.querySelector("#c");
let renderer = new THREE.WebGLRenderer({ canvas: c });
// renderer.setSize(c.clientWidth, c.clientHeight);
// c.appendChild(renderer.domElement);

// Make and set up a camera.
camera = new THREE.PerspectiveCamera(70, c.clientWidth / c.clientHeight, 1, 1000);
// camera = new THREE.PerspectiveCamera(70, 1, 1, 1000);
camera.position.z = 400;
camera.updateProjectionMatrix();

// Make a scene
let scene = new THREE.Scene();

// Make a cube.
let geometry = new THREE.BoxGeometry(200, 200, 200);

// Make a material
let material = new THREE.MeshPhongMaterial({
  ambient: 0x555555,
  color: 0x555555,
  specular: 0xffffff,
  shininess: 50,
  shading: THREE.SmoothShading
});

// Create a mesh based on the geometry and material
mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Add 2 lights.
let light1 = new THREE.PointLight(0xff0040, 2, 0);
light1.position.set(200, 100, 300);
scene.add(light1);

let light2 = new THREE.PointLight(0x0040ff, 2, 0);
light2.position.set(-200, 100, 300);
scene.add(light2);

function resize() {
  let width = renderer.domElement.clientWidth;
  let height = renderer.domElement.clientHeight;
  if (renderer.domElement.width !== width || renderer.domElement.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

function animate() {
  resize();
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

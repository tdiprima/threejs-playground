// Wasn't this just working a few minutes ago?
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const loader = new THREE.TextureLoader();
const geometry = new THREE.PlaneGeometry(1, 1);
let selectedCamera = null;

// Set up the parent scene and camera. ¿Por qué?
const parentScene = new THREE.Scene();
const parentCamera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
parentCamera.position.set(0, 0, 10);

// Set up the renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scenes = [];
let cameras = [];
let controls = [];
let meshes = [];

for (let i = 0; i < numScenes; i++) {
  // Create a separate scene for each image
  const scene = new THREE.Scene();
  scenes.push(scene);

  // Create a separate camera for each image
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.name = `camera${i + 1}`;
  // Set position of camera
  camera.position.set(0, 0, 5);
  cameras.push(camera);

  // Create controls for each camera
  const control = new OrbitControls(camera, renderer.domElement);
  controls.push(control);

  // Load each image and add it to its corresponding scene
  const image = loader.load(`image${i}.jpg`);
  const material = new THREE.MeshBasicMaterial({ map: image, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  meshes.push(mesh);

  // Add each scene to the parent scene
  parentScene.add(scene);

  // Set up event listeners to control the cameras
  control.addEventListener('start', () => {
    selectedCamera = camera;
  });
}

// Position the images
meshes[0].position.set(-1, 1, 0);
meshes[1].position.set(1, 1, 0);
meshes[2].position.set(-1, -1, 0);
meshes[3].position.set(1, -1, 0);

// Set up a function to handle window resizing
function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// todo: ¿Esto te parece familiar? Make this less clunky.
controls[0].addEventListener('change', () => {
  cameras[1].position.copy(cameras[0].position);
  cameras[1].rotation.copy(cameras[0].rotation);
  cameras[2].position.copy(cameras[0].position);
  cameras[2].rotation.copy(cameras[0].rotation);
  cameras[3].position.copy(cameras[0].position);
  cameras[3].rotation.copy(cameras[0].rotation);
});

controls[1].addEventListener('change', () => {
  cameras[0].position.copy(cameras[1].position);
  cameras[0].rotation.copy(cameras[1].rotation);
  cameras[2].position.copy(cameras[1].position);
  cameras[2].rotation.copy(cameras[1].rotation);
  cameras[3].position.copy(cameras[1].position);
  cameras[3].rotation.copy(cameras[1].rotation);
});

controls[2].addEventListener('change', () => {
  cameras[0].position.copy(cameras[2].position);
  cameras[0].rotation.copy(cameras[2].rotation);
  cameras[1].position.copy(cameras[2].position);
  cameras[1].rotation.copy(cameras[2].rotation);
  cameras[3].position.copy(cameras[2].position);
  cameras[3].rotation.copy(cameras[2].rotation);
});

controls[3].addEventListener('change', () => {
  cameras[0].position.copy(cameras[3].position);
  cameras[0].rotation.copy(cameras[3].rotation);
  cameras[1].position.copy(cameras[3].position);
  cameras[1].rotation.copy(cameras[3].rotation);
  cameras[2].position.copy(cameras[3].position);
  cameras[2].rotation.copy(cameras[3].rotation);
});

// Render the scene
function render() {
  requestAnimationFrame(render);

  // Update the selected camera's controls
  if (selectedCamera) {
    console.log(selectedCamera.name);
    selectedCamera.updateProjectionMatrix();
    selectedCamera.updateMatrixWorld();
    selectedCamera.updateWorldMatrix(true, true);
    selectedCamera.updateMatrix();
    selectedCamera.updateMatrixWorld(true);
    selectedCamera.lookAt(0, 0, 0);
    selectedCamera.updateProjectionMatrix();
    selectedCamera.updateMatrixWorld(true);
    selectedCamera.updateMatrix();
    selectedCamera.updateWorldMatrix(true, true);
  }
  selectedCamera = null;

  // Render the parent scene
  renderer.render(parentScene, parentCamera);
}

render();

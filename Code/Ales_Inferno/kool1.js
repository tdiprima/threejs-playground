import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

// Set up the parent scene and camera. ¿Por qué?
const parentScene = new THREE.Scene();
const parentCamera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
parentCamera.position.set(0, 0, 10);

// Create a separate scene for each image
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
const scene4 = new THREE.Scene();

// Create a separate camera for each image
const camera1 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera1.name = "camera1";

const camera2 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera2.name = "camera2";

const camera3 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera3.name = "camera3";

const camera4 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera4.name = "camera4";

// Set the position of each camera
camera1.position.set(0, 0, 5);
camera2.position.set(0, 0, 5);
camera3.position.set(0, 0, 5);
camera4.position.set(0, 0, 5);

// Set up the renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create controls for each camera
// TODO: 2nd argument renderer.domElement
const controls1 = new OrbitControls(camera1, renderer.domElement);
const controls2 = new OrbitControls(camera2, renderer.domElement);
const controls3 = new OrbitControls(camera3, renderer.domElement);
const controls4 = new OrbitControls(camera4, renderer.domElement);

// Load each image and add it to its corresponding scene
const loader = new THREE.TextureLoader();
const image1 = loader.load('image1.jpg');
const image2 = loader.load('image2.jpg');
const image3 = loader.load('image3.jpg');
const image4 = loader.load('image4.jpg');

const geometry = new THREE.PlaneGeometry(1, 1);
const material1 = new THREE.MeshBasicMaterial({ map: image1, side: THREE.DoubleSide });
const material2 = new THREE.MeshBasicMaterial({ map: image2, side: THREE.DoubleSide });
const material3 = new THREE.MeshBasicMaterial({ map: image3, side: THREE.DoubleSide });
const material4 = new THREE.MeshBasicMaterial({ map: image4, side: THREE.DoubleSide });

const mesh1 = new THREE.Mesh(geometry, material1);
const mesh2 = new THREE.Mesh(geometry, material2);
const mesh3 = new THREE.Mesh(geometry, material3);
const mesh4 = new THREE.Mesh(geometry, material4);

// Position the image
mesh1.position.set(-1, 1, 0);
mesh2.position.set(1, 1, 0);
mesh3.position.set(-1, -1, 0);
mesh4.position.set(1, -1, 0);

scene1.add(mesh1);
scene2.add(mesh2);
scene3.add(mesh3);
scene4.add(mesh4);

// Add each scene to the parent scene
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// Set up a function to handle window resizing
function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Set up event listeners to control the cameras
let selectedCamera = null;

controls1.addEventListener('start', () => {
  selectedCamera = camera1;
});
controls2.addEventListener('start', () => {
  selectedCamera = camera2;
});
controls3.addEventListener('start', () => {
  selectedCamera = camera3;
});
controls4.addEventListener('start', () => {
  selectedCamera = camera4;
});

// ¿Esto te parece familiar?
controls1.addEventListener('change', () => {
  camera2.position.copy(camera1.position);
  camera2.rotation.copy(camera1.rotation);
  camera3.position.copy(camera1.position);
  camera3.rotation.copy(camera1.rotation);
  camera4.position.copy(camera1.position);
  camera4.rotation.copy(camera1.rotation);
});

controls2.addEventListener('change', () => {
  camera1.position.copy(camera2.position);
  camera1.rotation.copy(camera2.rotation);
  camera3.position.copy(camera2.position);
  camera3.rotation.copy(camera2.rotation);
  camera4.position.copy(camera2.position);
  camera4.rotation.copy(camera2.rotation);
});

controls3.addEventListener('change', () => {
  camera1.position.copy(camera3.position);
  camera1.rotation.copy(camera3.rotation);
  camera2.position.copy(camera3.position);
  camera2.rotation.copy(camera3.rotation);
  camera4.position.copy(camera3.position);
  camera4.rotation.copy(camera3.rotation);
});

controls4.addEventListener('change', () => {
  camera1.position.copy(camera4.position);
  camera1.rotation.copy(camera4.rotation);
  camera2.position.copy(camera4.position);
  camera2.rotation.copy(camera4.rotation);
  camera3.position.copy(camera4.position);
  camera3.rotation.copy(camera4.rotation);
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

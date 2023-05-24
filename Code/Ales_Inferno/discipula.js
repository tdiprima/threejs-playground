// "Parent scene and cameras.md"
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Create a parent scene
const parentScene = new THREE.Scene();

const fov = 45; // Camera frustum vertical field of view.
const aspect = window.innerWidth / window.innerHeight; // Camera frustum aspect ratio.
const near = 1; // Camera frustum near plane.
const far = 1000; // Camera frustum far plane.

// Create individual scenes and cameras
const scene1 = new THREE.Scene();
scene1.background = new THREE.Color("#ff0000");
const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera1.position.z = 5;

const scene2 = new THREE.Scene();
scene2.background = new THREE.Color("#ffff00");
const camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera2.position.z = 5;

const scene3 = new THREE.Scene();
scene3.background = new THREE.Color("#00ff00");
const camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera3.position.z = 5;

const scene4 = new THREE.Scene();
scene4.background = new THREE.Color("#0000ff");
const camera4 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera4.position.z = 5;

// Add scenes to the parent scene
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

let geometry1 = new THREE.BoxGeometry(1, 1, 1);
// let cube1 = new THREE.Mesh(geometry1, material);
let cube1 = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
scene1.add(cube1);

let geometry2 = new THREE.BoxGeometry(1, 1, 1);
// let cube2 = new THREE.Mesh(geometry2, material);
let cube2 = new THREE.Mesh(geometry2, new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
scene2.add(cube2);

let geometry3 = new THREE.BoxGeometry(1, 1, 1);
// let cube3 = new THREE.Mesh(geometry3, material);
let cube3 = new THREE.Mesh(geometry3, new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
scene3.add(cube3);

let geometry4 = new THREE.BoxGeometry(1, 1, 1);
// let cube4 = new THREE.Mesh(geometry4, material);
let cube4 = new THREE.Mesh(geometry4, new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }));
scene4.add(cube4);

// let spotLight = new THREE.SpotLight(0xffffff);
// spotLight.position.set(10, 10, 10);
// parentScene.add(spotLight);
// let spotLightHelper = new THREE.SpotLightHelper(spotLight);
// parentScene.add(spotLightHelper);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create OrbitControls for each camera
const controls1 = new OrbitControls(camera1, renderer.domElement);
const controls2 = new OrbitControls(camera2, renderer.domElement);
const controls3 = new OrbitControls(camera3, renderer.domElement);
const controls4 = new OrbitControls(camera4, renderer.domElement);

// Toggle variable to switch between collective and individual zooming
let collectiveZoom = true;

// Function to handle zooming behavior
function handleZoom(event) {
  if (collectiveZoom) {
    // Zoom all cameras collectively
    camera1.zoom += event.deltaY * 0.001;
    camera2.zoom += event.deltaY * 0.001;
    camera3.zoom += event.deltaY * 0.001;
    camera4.zoom += event.deltaY * 0.001;
  } else {
    // Zoom each camera separately
    controls1.dollyOut(event.deltaY);
    controls2.dollyOut(event.deltaY);
    controls3.dollyOut(event.deltaY);
    controls4.dollyOut(event.deltaY);
  }
}

// Event listener for mouse wheel zooming
// document.addEventListener("wheel", handleZoom);

// Function to toggle collective and individual zooming
function toggleZoomMode() {
  collectiveZoom = !collectiveZoom;
}

// Example usage: Press a button to toggle zooming mode
const zoomToggleButton = document.getElementById("zoom-toggle");
zoomToggleButton.addEventListener("click", toggleZoomMode);

function render() {
  // Render scene1 with camera1
  renderer.render(scene1, camera1);

  // Render scene2 with camera2
  renderer.render(scene2, camera2);

  // Render scene3 with camera3
  renderer.render(scene3, camera3);

  // Render scene4 with camera4
  renderer.render(scene4, camera4);
}

(function animLoop() {
  requestAnimationFrame(animLoop);
  controls1.update();
  controls2.update();
  controls3.update();
  controls4.update();
  render();
})();

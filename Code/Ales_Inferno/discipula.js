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

const scene2 = new THREE.Scene();
scene2.background = new THREE.Color("#ffff00");
const camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
scene3.background = new THREE.Color("#00ff00");

const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(fov, aspect, near, far);
scene4.background = new THREE.Color("#0000ff");

// Add scenes to the parent scene
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
let geometry = new THREE.BoxGeometry( 1, 1, 1 );
let cube = new THREE.Mesh(geometry, material);
scene1.add(cube);
scene2.add(cube);
scene3.add(cube);
scene4.add(cube);

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
    controls1.zoom(event);
    controls2.zoom(event);
    controls3.zoom(event);
    controls4.zoom(event);
  }
}

// Event listener for mouse wheel zooming
document.addEventListener("wheel", handleZoom);

// Function to toggle collective and individual zooming
function toggleZoomMode() {
  collectiveZoom = !collectiveZoom;
}

// Example usage: Press a button to toggle zooming mode
const zoomToggleButton = document.getElementById("zoom-toggle");
zoomToggleButton.addEventListener("click", toggleZoomMode);

function render() {
  // TODO: for now.
  renderer.render(parentScene, camera1);
}

(function animLoop() {
  requestAnimationFrame(animLoop);
  controls1.update();
  controls2.update();
  controls3.update();
  controls4.update();
  render();
})();

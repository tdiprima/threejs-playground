// "Parent scene and cameras.md"
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const parentScene = new THREE.Scene();

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
// If you do this, it makes the box flatter: aspect / 2.
const near = 1;
const far = 1000;

// Create individual scenes and cameras
const scene1 = new THREE.Scene();
scene1.background = new THREE.Color("#2b2b2b");
const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera1.position.set(0, 0, 10);

const scene2 = new THREE.Scene();
scene2.background = new THREE.Color("#818181");
const camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera2.position.set(0, 0, -10);

const scene3 = new THREE.Scene();
scene3.background = new THREE.Color("#171717");
const camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera3.position.set(10, 0, 0);

const scene4 = new THREE.Scene();
scene4.background = new THREE.Color("#484848");
const camera4 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera4.position.set(-10, 0, 0);

// Add scenes to the parent scene
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

let geometry1 = new THREE.BoxGeometry(1, 1, 1);
let material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
let cube1 = new THREE.Mesh(geometry1, material1);
scene1.add(cube1);

let geometry2 = new THREE.BoxGeometry(1, 1, 1);
let material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
let cube2 = new THREE.Mesh(geometry2, material2);
scene2.add(cube2);

let geometry3 = new THREE.BoxGeometry(1, 1, 1);
let material3 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
let cube3 = new THREE.Mesh(geometry3, material3);
scene3.add(cube3);

let geometry4 = new THREE.BoxGeometry(1, 1, 1);
let material4 = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
let cube4 = new THREE.Mesh(geometry4, material4);
scene4.add(cube4);

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

// function z(controls, event) {
//   const movementX = event.movementX || event.touches[0].clientX - event.touches[1].clientX;
//   const movementY = event.movementY || event.touches[0].clientY - event.touches[1].clientY;
//   const distance = Math.sqrt(movementX * movementX + movementY * movementY);
//   // Move the camera closer or farther away from its target
//   controls.dolly(Math.exp(distance * -0.01));
//   controls.pan(new THREE.Vector3(-movementX, movementY, 0));
// }

// Function to handle zooming behavior
/*
function handleZoom(event) {
  if (collectiveZoom) {
    console.log("collective");
    // Zoom all cameras collectively
    camera1.zoom += event.deltaY * 0.001;
    camera2.zoom += event.deltaY * 0.001;
    camera3.zoom += event.deltaY * 0.001;
    camera4.zoom += event.deltaY * 0.001;
  } else {
    console.log("individual");
    // TODO: IDK.
    // Even if I comment out the other controls, it still moves all of them.
    // And this is just (allegedly) affecting the zoom!  What about rotate; need to handle.

    // Zoom each camera separately
    controls1.dollyOut(event.deltaY);
    controls2.dollyOut(event.deltaY);
    controls3.dollyOut(event.deltaY);
    controls4.dollyOut(event.deltaY);

    controls1.dollyIn(event.deltaX);
    controls2.dollyIn(event.deltaX);
    controls3.dollyIn(event.deltaX);
    controls4.dollyIn(event.deltaX);

    // I did delta like before...
    // z(controls1, event)
    // z(controls2, event)
    // z(controls3, event)
    // z(controls4, event)
  }
}
*/

let camera1Active = true;
let camera2Active = false;
let camera3Active = false;
let camera4Active = false;

function handleZoom(event) {
  if (collectiveZoom) {
    console.log("collective");
    // Zoom all cameras collectively
    camera1.zoom += event.deltaY * 0.001;
    camera2.zoom += event.deltaY * 0.001;
    camera3.zoom += event.deltaY * 0.001;
    camera4.zoom += event.deltaY * 0.001;
  } else {
    console.log("individual");
    if (camera1Active) {
      controls1.dollyOut(event.deltaY);
      controls1.dollyIn(event.deltaX);
    } else if (camera2Active) {
      controls2.dollyOut(event.deltaY);
      controls2.dollyIn(event.deltaX);
    } else if (camera3Active) {
      controls3.dollyOut(event.deltaY);
      controls3.dollyIn(event.deltaX);
    } else if (camera4Active) {
      controls4.dollyOut(event.deltaY);
      controls4.dollyIn(event.deltaX);
    }
  }
}

// Event listener for mouse wheel zooming
document.addEventListener("wheel", handleZoom);

// Function to toggle collective and individual zooming
function toggleZoomMode() {
  collectiveZoom = !collectiveZoom;
  console.log("collectiveZoom:", collectiveZoom);
}

// Example usage: Press a button to toggle zooming mode
const zoomToggleButton = document.getElementById("zoom-toggle");
zoomToggleButton.addEventListener("click", toggleZoomMode);

function render() {
  // Note: positioning is "flipped". Ce n'est pas ma faut. They did that. I saw it.
  const width = window.innerWidth / 2;
  const height = window.innerHeight / 2;

  renderer.setScissorTest(true);

  // Top left
  renderer.setViewport(0, 0, width, height);
  renderer.setScissor(0, 0, width, height);
  renderer.render(scene1, camera1);

  // Top right
  renderer.setViewport(width, 0, width, height);
  renderer.setScissor(width, 0, width, height);
  renderer.render(scene2, camera2);

  // Bottom left
  renderer.setViewport(0, height, width, height);
  renderer.setScissor(0, height, width, height);
  renderer.render(scene3, camera3);

  // Bottom right
  renderer.setViewport(width, height, width, height);
  renderer.setScissor(width, height, width, height);
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
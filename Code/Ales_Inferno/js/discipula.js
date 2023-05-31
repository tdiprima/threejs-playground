// "Parent scene and cameras.md"
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const parentScene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Toggle variable to switch between collective and individual zooming
let collectiveZoom = true;

let scenes = [];
let cameras = [];
let controls = [];
let meshes = [];

let colors = [new THREE.Color("#2b2b2b"), new THREE.Color("#818181"), new THREE.Color("#171717"), new THREE.Color("#484848")]

for (let i = 0; i < numScenes; i++) {
  // Create individual scenes and cameras
  const scene = new THREE.Scene();
  scene.background = colors[i];
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 0, 10);

  // Add scenes to the parent scene
  parentScene.add(scene);

  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  let cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Create OrbitControls for each camera
  const control = new OrbitControls(camera, renderer.domElement);

  scenes.push(scene);
  cameras.push(camera);
  controls.push(control);
  meshes.push(cube);
}

// camera1.position.set(0, 0, 10);
// camera2.position.set(0, 0, -10);
// camera3.position.set(10, 0, 0);
// camera4.position.set(-10, 0, 0);

function z(control, event) {
  const movementX = event.movementX || event.touches[0].clientX - event.touches[1].clientX;
  const movementY = event.movementY || event.touches[0].clientY - event.touches[1].clientY;
  const distance = Math.sqrt(movementX * movementX + movementY * movementY);

  // Move the camera closer or farther away from its target
  control.dolly(Math.exp(distance * -0.01));
  control.pan(new THREE.Vector3(-movementX, movementY, 0));
}

// Function to handle zooming behavior
function handleZoom1(event) {
  if (collectiveZoom) {
    // Zoom all cameras collectively
    for (let i = 0; i < numScenes; i++) {
      cameras[i].zoom += event.deltaY * 0.001;
    }

  } else {
    // Zoom each camera separately
    for (let i = 0; i < numScenes; i++) {
      // Yeah, this won't work...
      controls[i].dollyOut(event.deltaY);
      controls[i].dollyIn(event.deltaX);
      // I did delta like before
      // z(controls[i], event)
    }
  }
}

/*
let camera1Active = true;
let camera2Active = false;
let camera3Active = false;
let camera4Active = false;

function handleZoom(event) {
  if (collectiveZoom) {
    console.log("collective");
    // Zoom all cameras collectively
    for (let i = 0; i < numScenes; i++) {
      cameras[i].zoom += event.deltaY * 0.001;
    }
  } else {
    console.log("individual");
    // cameras[i].dollyOut is not a function (cuz it's controls)
    if (camera1Active) {
      cameras[0].dollyOut(event.deltaY);
      cameras[0].dollyIn(event.deltaX);
    } else if (camera2Active) {
      cameras[1].dollyOut(event.deltaY);
      cameras[1].dollyIn(event.deltaX);
    } else if (camera3Active) {
      cameras[2].dollyOut(event.deltaY);
      cameras[2].dollyIn(event.deltaX);
    } else if (camera4Active) {
      cameras[3].dollyOut(event.deltaY);
      cameras[3].dollyIn(event.deltaX);
    }
  }
}

// Event listener for mouse wheel zooming
document.addEventListener("wheel", handleZoom);
*/

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
  renderer.render(scenes[0], cameras[0]);

  // Top right
  renderer.setViewport(width, 0, width, height);
  renderer.setScissor(width, 0, width, height);
  renderer.render(scenes[1], cameras[1]);

  // Bottom left
  renderer.setViewport(0, height, width, height);
  renderer.setScissor(0, height, width, height);
  renderer.render(scenes[2], cameras[2]);

  // Bottom right
  renderer.setViewport(width, height, width, height);
  renderer.setScissor(width, height, width, height);
  renderer.render(scenes[3], cameras[3]);
}

(function animLoop() {
  requestAnimationFrame(animLoop);
  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
  }
  render();
})();

function onWindowResize() {
  cameras.forEach(camera => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

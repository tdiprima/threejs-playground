import * as THREE from "three";
import { OrbitControls } from "three/examples/controls/OrbitControls.js";

let RENDER_WIDTH = window.innerWidth / 2;
let RENDER_HEIGHT = window.innerHeight / 2;
let ASPECT = RENDER_WIDTH / RENDER_HEIGHT;

const numScenes = 2;

let scenes = [];
let cameras = [];
let renderers = [];
let controls = [];
let colors = ["#2b2b2b", "#484848"]; // mineShaft, outerSpace

let activeControlIndex = 0; // Index of the currently active control
let detachControls = false; // Flag to toggle controls detachment

for (let i = 0; i < numScenes; i++) {
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[i]);
  scenes.push(scene);

  let camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  camera.position.z = 2;
  cameras.push(camera);

  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT);
  document.getElementById(`image${i + 1}`).appendChild(renderer.domElement);
  renderers.push(renderer);

  let texture = new THREE.TextureLoader().load(`image${i + 1}.jpg`);
  let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  let geometry = new THREE.PlaneGeometry(3, 2);
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let control = new OrbitControls(camera, renderer.domElement);
  control.addEventListener("change", onControlsChange);
  controls.push(control);
}

function onControlsChange() {
  if (detachControls) {
    cameras[1 - activeControlIndex].copy(cameras[activeControlIndex]);
    cameras[1 - activeControlIndex].updateProjectionMatrix();
  }
}

function update() {
  controls.forEach((control, index) => {
    if (index !== activeControlIndex || !detachControls) {
      control.update();
    }
    renderers[index].render(scenes[index], cameras[index]);
  });
  requestAnimationFrame(update);
}

// Function to detach or reattach controls based on the 'detachControls' flag
function toggleControlsDetachment() {
  detachControls = !detachControls;
  if (detachControls) {
    controls.forEach((control, index) => {
      control.enabled = (index === activeControlIndex);
    });
  } else {
    controls.forEach((control) => {
      control.enabled = true;
    });
  }
}

// Function to switch the active control
function switchActiveControl(index) {
  activeControlIndex = index;
  controls.forEach((control, i) => {
    control.enabled = (i === activeControlIndex) || !detachControls;
  });
}

// Toggle button click event listener
document.getElementById("toggleButton").addEventListener("click", toggleControlsDetachment);

// Control switch button click event listeners
document.getElementById("control1Button").addEventListener("click", () => {
  switchActiveControl(0);
});
document.getElementById("control2Button").addEventListener("click", () => {
  switchActiveControl(1);
});

update();

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let RENDER_WIDTH = window.innerWidth / 2;
let RENDER_HEIGHT = window.innerHeight / 2;
let ASPECT = RENDER_WIDTH / RENDER_HEIGHT;

const numScenes = 2;

let scenes = [];
let cameras = [];
let renderers = [];
let controls = [];
let colors = ["#2b2b2b", "#484848"]; // mineShaft, outerSpace

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

  let texture = new THREE.TextureLoader().load(`/images/image${i + 1}.jpg`);
  let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  let geometry = new THREE.PlaneGeometry(3, 2);
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let control = new OrbitControls(camera, renderer.domElement);
  if (i === 0) {
    control.addEventListener("change", onControlsChange1);
  } else {
    control.addEventListener("change", onControlsChange2);
  }
  controls.push(control);
}

function onControlsChange1() {
  if (detachControls) return;

  cameras[1].copy(cameras[0]);
  cameras[1].updateProjectionMatrix();
}

function onControlsChange2() {
  if (detachControls) return;

  cameras[0].copy(cameras[1]);
  cameras[0].updateProjectionMatrix();
}

function update() {
  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
    renderers[i].render(scenes[i], cameras[i]);
  }
  requestAnimationFrame(update);
}

// Function to detach or reattach controls based on the 'detachControls' flag
function toggleControlsDetachment() {
  detachControls = !detachControls;
  if (detachControls) {
    controls[0].enabled = false;
    controls[1].enabled = false;
  } else {
    controls[0].enabled = true;
    controls[1].enabled = true;
  }
}

// Toggle button click event listener
document.getElementById("toggleButton").addEventListener("click", toggleControlsDetachment);

update();


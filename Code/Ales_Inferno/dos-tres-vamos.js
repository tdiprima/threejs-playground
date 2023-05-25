// "Parent scene and cameras.md"
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;

// RENDERER
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CAMERAS
let cameras = [];
for (let i = 0; i < numScenes; i++) {
  cameras.push(new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000))
}

// CAMERA POSITIONS
cameras[0].position.set(0, 0, 10);
cameras[1].position.set(0, 0, -10);
cameras[2].position.set(10, 0, 0);
cameras[3].position.set(-10, 0, 0);

// CONTROLS
let controls = []; // Array of controls
for (let i = 0; i < numScenes; i++) {
  let control = new OrbitControls(cameras[i], renderer.domElement);
  control.name = `control${i + 1}`;
  controls.push(control);
}

// SCENES
const parentScene = new THREE.Scene();
let scenes = [];
for (let i = 0; i < numScenes; i++) {
  let scene = new THREE.Scene();
  parentScene.add(scene);
  scenes.push(scene);
}

// CUBES
for (let i = 0; i < numScenes; i++) {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
  let cube = new THREE.Mesh(geometry, material);
  scenes[i].add(cube);
}

// Initial active camera index
let activeCameraIndex = 0;

// Single instance of OrbitControls assigned to the active camera
// let orbitControls = new OrbitControls(cameras[activeCameraIndex], renderer.domElement);

let collectiveZoom = false;

function handleZoom(event) {
  if (collectiveZoom) {
    console.log("collective");
    // Zoom all cameras collectively
    cameras.forEach(function (camera) {
      camera.zoom += event.deltaY * 0.001;
    });
  } else {
    console.log("individual");
    // let activeCamera = cameras[activeCameraIndex];
    let activeControls = controls[activeCameraIndex];
    console.log(activeControls.name)

    activeControls.dollyOut(event.deltaY);
    activeControls.dollyIn(event.deltaX);
  }
}

function render() {
  for (let i = 0; i < numScenes; i++) {
    renderer.render(scenes[i], cameras[i]);
  }
}

(function animLoop() {
  requestAnimationFrame(animLoop);
  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
  }
  render();
})();

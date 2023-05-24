// "Parent scene and cameras.md"
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const fov = 45;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 1000;

// CAMERAS
const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera1.position.set(0, 0, 10);

const camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera2.position.set(0, 0, -10);

const camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera3.position.set(10, 0, 0);

const camera4 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera4.position.set(-10, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CONTROLS
const controls1 = new OrbitControls(camera1, renderer.domElement);
const controls2 = new OrbitControls(camera2, renderer.domElement);
const controls3 = new OrbitControls(camera3, renderer.domElement);
const controls4 = new OrbitControls(camera4, renderer.domElement);

// ARRAYS
let cameras = [camera1, camera2, camera3, camera4]; // Array of cameras
let controls = [controls1, controls2, controls3, controls4]; // Array of controls

// Initial active camera index
let activeCameraIndex = 0;

// Single instance of OrbitControls assigned to the active camera
// let orbitControls = new OrbitControls(cameras[activeCameraIndex], renderer.domElement);

let collectiveZoom = true;

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

    activeControls.dollyOut(event.deltaY);
    activeControls.dollyIn(event.deltaX);
  }
}

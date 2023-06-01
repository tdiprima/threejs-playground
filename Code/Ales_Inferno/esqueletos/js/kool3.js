import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const width = window.innerWidth / 2;
const height = window.innerHeight / 2;

const loader = new THREE.TextureLoader();
const geometry = new THREE.PlaneGeometry(1, 1);

const parentScene = new THREE.Scene();

const parentCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
parentCamera.position.set(0, 0, 10);
// parentCamera.position.set(0, 0, 0);
parentCamera.rotation.set(0, 0, 0);

let selectedCamera = null;

// todo: Create a target object to control the camera
// const target = new THREE.Object3D();
// console.log("\nTarget:");
// f(target);
// parentScene.add(target);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scenes = [];
let cameras = [];
let controls = [];
let meshes = [];

for (let i = 0; i < numScenes; i++) {
  // Create the four scenes and cameras
  const scene = new THREE.Scene();
  scenes.push(scene);

  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  camera.name = `camera${i + 1}`;
  scene.add(camera);
  cameras.push(camera);

  // Add the scenes to a parent scene
  parentScene.add(scene);

  // I suppose we need to add all the cameras to this too, huh?
  // parentCamera.add(camera);

  // Create the four controls
  const control = new OrbitControls(camera, renderer.domElement);
  // control.target = target;
  control.addEventListener('start', () => {
    selectedCamera = camera;
  });
  controls.push(control);

  // Add the four images to the scenes
  const image = loader.load(`/images/image${i + 1}.jpg`);
  const material = new THREE.MeshBasicMaterial({ map: image });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  meshes.push(mesh);
}

// Position the images
meshes[0].position.set(-2, 2, 0);
meshes[1].position.set(2, 2, 0);
meshes[2].position.set(-2, -2, 0);
meshes[3].position.set(2, -2, 0);

// camera2.position.x = Z; // TODO: Wait, what? Why?
// camera3.position.y = Z; // DITTO
// camera4.position.set(-Z, 0, Z); // DITTO

// Set up event listeners to control the cameras
function onDocumentMouseDown(event) {
  // console.log("onDocumentMouseDown"); // Sí.
  if (event.button === 0) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseX < width && mouseY < height) {
      selectedCamera = cameras[0];
    } else if (mouseX >= width && mouseY < height) {
      selectedCamera = cameras[1];
    } else if (mouseX < width && mouseY >= height) {
      selectedCamera = cameras[2];
    } else {
      selectedCamera = cameras[3];
    }
  }
}

document.addEventListener('mousedown', onDocumentMouseDown);

function onDocumentMouseUp(event) {
  // console.log("onDocumentMouseUp"); // Excelente.
  selectedCamera = null;
}

document.addEventListener('mouseup', onDocumentMouseUp);

function onDocumentMouseMove(event) {
  // console.log("onDocumentMouseMove"); // Impresionante.

  if (selectedCamera) {
    console.log(selectedCamera.name);

    const deltaX = event.movementX;
    const deltaY = event.movementY;

    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta);
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi);
  }
  // selectedCamera = null;
}

document.addEventListener('mousemove', onDocumentMouseMove);

function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
  }

  renderer.render(parentScene, parentCamera);
}

animate();

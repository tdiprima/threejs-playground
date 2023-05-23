import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const Z = 5;
const FOV = 50;

// Create the four scenes and cameras
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.z = Z;
camera1.name = "camera1";

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.x = Z;
camera2.name = "camera2";

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3.position.y = Z;
camera3.name = "camera3";

const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera4.position.set(-Z, 0, Z);
camera4.position.set(-5, 0, 5);
camera4.name = "camera4";

// Add the scenes to a parent scene
const parentScene = new THREE.Scene();
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// Create a target object to control the camera
const target = new THREE.Object3D();
parentScene.add(target);

// TODO: HE FORGOT TO ADD THE RENDERER
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the four controls
const controls1 = new OrbitControls(camera1, renderer.domElement);
controls1.target = target;

const controls2 = new OrbitControls(camera2, renderer.domElement);
controls2.target = target;

const controls3 = new OrbitControls(camera3, renderer.domElement);
controls3.target = target;

const controls4 = new OrbitControls(camera4, renderer.domElement);
controls4.target = target;

// Set up event listeners to control the cameras
let selectedCamera = null;

function onDocumentMouseDown(event) {
  event.preventDefault();
  if (event.button === 0) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseX < window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = camera1;
    } else if (mouseX >= window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = camera2;
    } else if (mouseX < window.innerWidth / 2 && mouseY >= window.innerHeight / 2) {
      selectedCamera = camera3;
    } else {
      selectedCamera = camera4;
    }
  }
}

controls4.addEventListener('start', () => {
  selectedCamera = camera4;
});

function onDocumentMouseUp(event) {
  selectedCamera = null;
}

function onDocumentMouseMove(event) {
  event.preventDefault();

  if (selectedCamera) {
    console.log(selectedCamera.name);

    const deltaX = event.movementX;
    const deltaY = event.movementY;

    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta);
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi);
  }
  selectedCamera = null;
}

// TODO: DEFINE PARENT CAMERA
const parentCamera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
parentCamera.position.set(0, 0, 10);
// I suppose we need to add all the cameras to this too, huh?

function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add the four images to the scenes
const loader = new THREE.TextureLoader();

// TODO: DEFINE GEOMETRY IN HERE
const geometry = new THREE.PlaneGeometry(1, 1);

const image1 = loader.load('image1.jpg');
const material1 = new THREE.MeshBasicMaterial({ map: image1 })
const mesh1 = new THREE.Mesh(geometry, material1);
mesh1.position.set(-2, 2, 0);
// TODO: He left a lot out, and then he crapped out.
scene1.add(mesh1);

const image2 = loader.load('image2.jpg');
const material2 = new THREE.MeshBasicMaterial({ map: image2 })
const mesh2 = new THREE.Mesh(geometry, material2);
mesh2.position.set(-2, 2, 0);
scene2.add(mesh2);

const image3 = loader.load('image3.jpg');
const material3 = new THREE.MeshBasicMaterial({ map: image3 })
const mesh3 = new THREE.Mesh(geometry, material3);
mesh3.position.set(-2, 2, 0);
scene3.add(mesh3);

const image4 = loader.load('image4.jpg');
const material4 = new THREE.MeshBasicMaterial({ map: image4 })
const mesh4 = new THREE.Mesh(geometry, material4);
mesh4.position.set(-2, 2, 0);
scene4.add(mesh4);

function animate() {
  requestAnimationFrame(animate);

  controls1.update();
  controls2.update();
  controls3.update();
  controls4.update();

  renderer.render(parentScene, parentCamera);
}

document.addEventListener('mousedown', onDocumentMouseDown);
document.addEventListener('mouseup', onDocumentMouseUp);
document.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('resize', onWindowResize);

// animate();
renderer.render(parentScene, parentCamera);

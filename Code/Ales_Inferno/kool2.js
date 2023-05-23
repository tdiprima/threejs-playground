import * as THREE from 'three';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const Z = 2;
const FOV = 45;

const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.set(0, 0, Z);
camera1.name = "camera1";
scene1.add(camera1);

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.name = "camera2";
camera2.position.set(0, 0, Z);
scene2.add(camera2);

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3.name = "camera3";
camera3.position.set(0, 0, Z);
scene3.add(camera3);

const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
camera4.name = "camera4";
camera4.position.set(0, 0, Z);
scene4.add(camera4);

const parentScene = new THREE.Scene();
const parentCamera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
parentCamera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0xffffff});

// todo: HE FORGOT TO LOAD THE TEXTURES
// const image1 = new THREE.Mesh(geometry, material);
// image1.position.set(-2, 2, 0);
// scene1.add(image1);
//
// const image2 = new THREE.Mesh(geometry, material);
// image2.position.set(2, 2, 0);
// scene2.add(image2);
//
// const image3 = new THREE.Mesh(geometry, material);
// image3.position.set(-2, -2, 0);
// scene3.add(image3);
//
// const image4 = new THREE.Mesh(geometry, material);
// image4.position.set(2, -2, 0);
// scene4.add(image4);

const loader = new THREE.TextureLoader();

let mesh1, mesh2, mesh3, mesh4;

const image1 = loader.load('image1.jpg', texture1 => {
  let material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
  // Set the position and scale of the mesh so that it fits within the canvas for that image.
  mesh1 = new THREE.Mesh(geometry, material1);
  mesh1.position.set(-2, 2, 0);
  mesh1.scale.set(1.0, texture1.image.height / texture1.image.width, 1.0);
  scene1.add(mesh1);
});

const image2 = loader.load('image2.jpg', texture2 => {
  let material2 = new THREE.MeshBasicMaterial({map: texture2, side: THREE.DoubleSide});
  mesh2 = new THREE.Mesh(geometry, material2);
  mesh2.scale.set(1.0, texture2.image.height / texture2.image.width, 1.0);
  mesh2.position.set(2, 2, 0);
  scene2.add(mesh2);
});

const image3 = loader.load('image3.jpg', texture3 => {
  let material3 = new THREE.MeshBasicMaterial({map: texture3, side: THREE.DoubleSide});
  mesh3 = new THREE.Mesh(geometry, material3);
  mesh3.scale.set(1.0, texture3.image.height / texture3.image.width, 1.0);
  mesh3.position.set(-2, -2, 0);
  scene3.add(mesh3);
});

const image4 = loader.load('image4.jpg', texture4 => {
  let material4 = new THREE.MeshBasicMaterial({map: texture4, side: THREE.DoubleSide});
  mesh4 = new THREE.Mesh(geometry, material4);
  mesh4.scale.set(1.0, texture4.image.height / texture4.image.width, 1.0);
  mesh4.position.set(2, -2, 0);
  scene4.add(mesh4);
});

parentScene.add(scene1, scene2, scene3, scene4);

const controls1 = new OrbitControls(camera1, renderer.domElement);
const controls2 = new OrbitControls(camera2, renderer.domElement);
const controls3 = new OrbitControls(camera3, renderer.domElement);
const controls4 = new OrbitControls(camera4, renderer.domElement);
// todo: target; see esqueletos/uno.js

function onDocumentMouseDown(event) {
  event.preventDefault();

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, parentCamera);

  // const intersects = raycaster.intersectObjects([image1, image2, image3, image4]);
  const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3, mesh4]);

  if (intersects.length > 0) {
    // selectedCamera = intersects[0].object.parent.getObjectByName('camera');
    selectedCamera = intersects[0].object.parent.children[0];
  }
}

let selectedCamera = null;

controls1.addEventListener('start', () => {
  selectedCamera = camera1;
});
controls2.addEventListener('start', () => {
  selectedCamera = camera2;
});
controls3.addEventListener('start', () => {
  selectedCamera = camera3;
});
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
    // Retrieve the movement distance of the mouse in the horizontal (X) and vertical (Y) directions
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    // Calculate the rotation angles based on the mouse movement and the window size
    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    // Rotate the selected camera around the world Y-axis (0, 1, 0) by the horizontal angle (theta)
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta);

    // Rotate the selected camera around the world X-axis (1, 0, 0) by the vertical angle (phi)
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi);
  }
  selectedCamera = null;
}

function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

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

animate();

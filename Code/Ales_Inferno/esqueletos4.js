import * as THREE from "three";

const width = window.innerWidth;
const height = window.innerHeight;
const windowHalfX = width / 2;
const windowHalfY = height / 2;

// SCENES AND CAMERAS
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.z = 5;

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.x = 5;

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3.position.y = 5;

const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera4.position.set(-5, 0, 5);

// CUBES
let cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
  })
);
cube1.position.set(0, 0, 0);
scene1.add(cube1);

let cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
  })
);
cube2.position.set(0, 0, 0);
scene2.add(cube2);

let cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
  })
);
cube3.position.set(0, 0, 0);
scene3.add(cube3);

let cube4 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
  })
);
cube4.position.set(0, 0, 0);
scene4.add(cube4);

// RENDERERS
const renderer1 = new THREE.WebGLRenderer();
renderer1.setSize(windowHalfX, windowHalfY);
renderer1.domElement.style.position = 'absolute';
renderer1.domElement.style.top = '0';
renderer1.domElement.style.left = '0';
document.body.appendChild(renderer1.domElement);

const renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(windowHalfX, windowHalfY);
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = '0';
renderer2.domElement.style.left = `${windowHalfX}px`;
document.body.appendChild(renderer2.domElement);

const renderer3 = new THREE.WebGLRenderer();
renderer3.setSize(windowHalfX, windowHalfY);
renderer3.domElement.style.position = 'absolute';
renderer3.domElement.style.top = `${windowHalfY}px`;
renderer3.domElement.style.left = '0';
document.body.appendChild(renderer3.domElement);

const renderer4 = new THREE.WebGLRenderer();
renderer4.setSize(windowHalfX, windowHalfY);
renderer4.domElement.style.position = 'absolute';
renderer4.domElement.style.top = `${windowHalfY}px`;
renderer4.domElement.style.left = `${windowHalfX}px`;
document.body.appendChild(renderer4.domElement);

// EVENT LISTENERS TO CONTROL THE CAMERAS

function onDocumentMouseDown(event) {
  event.preventDefault();

  // IDK why we're adding and removing and adding...
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
}

function onDocumentMouseMove(event) {
  const mouseX = event.clientX - windowHalfX;
  const mouseY = event.clientY - windowHalfY;

  const camera1X = (mouseX / width) * 2 - 1;
  const camera1Y = -(mouseY / height) * 2 + 1;
  camera1.position.x = camera1X * 10;
  camera1.position.y = camera1Y * 10;
  camera1.lookAt(scene1.position);

  const camera2X = ((mouseX - windowHalfX) / width) * 2 - 1;
  const camera2Y = -(mouseY / height) * 2 + 1;
  camera2.position.x = camera2X * 10;
  camera2.position.y = camera2Y * 10;
  camera2.lookAt(scene2.position);

  const camera3X = (mouseX / width) * 2 - 1;
  const camera3Y = -((mouseY - windowHalfY) / height) * 2 + 1;
  camera3.position.x = camera3X * 10;
  camera3.position.y = camera3Y * 10;
  camera3.lookAt(scene3.position);

  const camera4X = ((mouseX - windowHalfX) / width) * 2 - 1;
  const camera4Y = -((mouseY - windowHalfY) / height) * 2 + 1;
  camera4.position.x = camera4X * 10;
  camera4.position.y = camera4Y * 10;
  camera4.lookAt(scene4.position);

  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  renderer3.render(scene3, camera3);
  renderer4.render(scene4, camera4);
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('mouseup', onDocumentMouseUp);
}

document.addEventListener('mousedown', onDocumentMouseDown);

function animate() {
  requestAnimationFrame(animate);
  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  renderer3.render(scene3, camera3);
  renderer4.render(scene4, camera4);
}

animate();

import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

// Create the scenes
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
const scene4 = new THREE.Scene();

// Create the cameras
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.set(0, 0, 5);
const camera2 = camera1.clone();
const camera3 = camera1.clone();
const camera4 = camera1.clone();

// Create the geometries
const geometry = new THREE.PlaneGeometry(1, 1);

// Create the materials and meshes
const loader = new THREE.TextureLoader();
const image1 = loader.load('image1.jpg');
const material1 = new THREE.MeshBasicMaterial({ map: image1 });
const mesh1 = new THREE.Mesh(geometry, material1);
mesh1.position.set(-2, 2, 0);
scene1.add(mesh1);

const image2 = loader.load('image2.jpg');
const material2 = new THREE.MeshBasicMaterial({ map: image2 });
const mesh2 = new THREE.Mesh(geometry, material2);
mesh2.position.set(2, 2, 0);
scene2.add(mesh2);

const image3 = loader.load('image3.jpg');
const material3 = new THREE.MeshBasicMaterial({ map: image3 });
const mesh3 = new THREE.Mesh(geometry, material3);
mesh3.position.set(-2, -2, 0);
scene3.add(mesh3);

const image4 = loader.load('image4.jpg');
const material4 = new THREE.MeshBasicMaterial({ map: image4 });
const mesh4 = new THREE.Mesh(geometry, material4);
mesh4.position.set(2, -2, 0);
scene4.add(mesh4);

// Create the renderers
const renderer1 = new THREE.WebGLRenderer();
renderer1.setSize(window.innerWidth / 2, window.innerHeight / 2);
document.body.appendChild(renderer1.domElement);

const renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(window.innerWidth / 2, window.innerHeight / 2);
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.left = `${window.innerWidth / 2}px`;

document.body.appendChild(renderer2.domElement);
const renderer3 = new THREE.WebGLRenderer();
renderer3.setSize(window.innerWidth / 2, window.innerHeight / 2);
renderer3.domElement.style.position = 'absolute';
renderer3.domElement.style.top = `${window.innerHeight / 2}px`;
document.body.appendChild(renderer3.domElement);

const renderer4 = new THREE.WebGLRenderer();
renderer4.setSize(window.innerWidth / 2, window.innerHeight / 2);
renderer4.domElement.style.position = 'absolute';
renderer4.domElement.style.left = `${window.innerWidth / 2}px`;
renderer4.domElement.style.top = `${window.innerHeight / 2}px`;
document.body.appendChild(renderer4.domElement);

// Set up event listeners to control the cameras
const controls1 = new OrbitControls(camera1, renderer1.domElement);
const controls2 = new OrbitControls(camera2, renderer2.domElement);
const controls3 = new OrbitControls(camera3, renderer3.domElement);
const controls4 = new OrbitControls(camera4, renderer4.domElement);

controls1.addEventListener('change', render);
controls2.addEventListener('change', render);
controls3.addEventListener('change', render);
controls4.addEventListener('change', render);

// Render loop
function render() {
  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  renderer3.render(scene3, camera3);
  renderer4.render(scene4, camera4); // cut off here again
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

animate();

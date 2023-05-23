// 4 images with orbit control
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

// Create a scene; todo: note, we probably want 4 scenes, etc.
let scene = new THREE.Scene();

// Create a renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

// Load the images
const image1Texture = textureLoader.load('image1.jpg');
const image2Texture = textureLoader.load('image2.jpg');
const image3Texture = textureLoader.load('image3.jpg');
const image4Texture = textureLoader.load('image4.jpg');

// Create a plane geometry with the same aspect ratio as the images
const planeGeometry = new THREE.PlaneGeometry(1, 1);

// Create the mesh objects for the images
const image1 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image1Texture, side: THREE.DoubleSide }));
const image2 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image2Texture, side: THREE.DoubleSide }));
const image3 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image3Texture, side: THREE.DoubleSide }));
const image4 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image4Texture, side: THREE.DoubleSide }));

// Set the positions of the images
image1.position.set(-1, 1, 0);
image2.position.set(1, 1, 0);
image3.position.set(-1, -1, 0);
image4.position.set(1, -1, 0);

// Add the images to the scene
scene.add(image1, image2, image3, image4);

// Create a camera and position it so that all the images are visible
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 5;

// Create the orbit controls and set them to control the camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add event listeners to the images to pan and zoom together
image1.addEventListener('mousedown', onImageMouseDown);
image2.addEventListener('mousedown', onImageMouseDown);
image3.addEventListener('mousedown', onImageMouseDown);
image4.addEventListener('mousedown', onImageMouseDown);

image1.addEventListener('touchstart', onImageMouseDown);
image2.addEventListener('touchstart', onImageMouseDown);
image3.addEventListener('touchstart', onImageMouseDown);
image4.addEventListener('touchstart', onImageMouseDown);

function onImageMouseDown(event) {
  // Set the camera target to the position of the clicked image
  controls.target.copy(event.target.position);
  console.log("target:", event.target); // todo: not firing. why?

  // Add event listeners to the document to pan and zoom the images together
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('touchmove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
  document.addEventListener('touchend', onDocumentMouseUp);
}

function onDocumentMouseMove(event) {
  console.log("Hello?");
  // Calculate the mouse/touch movement and update the camera position
  const movementX = event.movementX || event.touches[0].clientX - event.touches[1].clientX;
  const movementY = event.movementY || event.touches[0].clientY - event.touches[1].clientY;
  const distance = Math.sqrt(movementX * movementX + movementY * movementY);
  // move the camera closer or farther away from its target
  controls.dolly(Math.exp(distance * -0.01));
  controls.pan(new THREE.Vector3(-movementX, movementY, 0));
}

function onDocumentMouseUp(event) {
  // Remove the event listeners from the document
  // document.removeEventListener('mousemove', onDocumentMouseMove);
  // document.removeEventListener('touchmove', onDocumentMouseMove);
  // document.removeEventListener('mouseup', onDocumentMouseUp);
  // document.removeEventListener('touchend', onDocumentMouseUp);
}

// Render the scene
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}
render();


import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const geometry = new THREE.PlaneGeometry(1, 1);
const loader = new THREE.TextureLoader();

// const width = window.innerWidth / 2;
// const height = window.innerHeight / 2;
// const aspect = width / height;
const aspect = 400 / 300;
// const aspect = 1;

// Create the first scene
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera1.position.z = 1;
const renderer1 = new THREE.WebGLRenderer({antialias: true});

// ... Set up renderer, controls, and other necessary configurations for scene1
const canvas1 = document.getElementById('image1');
canvas1.appendChild(renderer1.domElement);

const controls1 = new OrbitControls(camera1, renderer1.domElement);

const texture1 = loader.load('image1.jpg');
const material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
const mesh1 = new THREE.Mesh(geometry, material1);
// mesh1.position.set(-1, 1, 0)
scene1.add(mesh1);

// Create the second scene
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
camera2.position.z = 1;
const renderer2 = new THREE.WebGLRenderer({antialias: true});

// ... Set up renderer, controls, and other necessary configurations for scene2
const canvas2 = document.getElementById('image2');
canvas2.appendChild(renderer2.domElement);

const controls2 = new OrbitControls(camera2, renderer2.domElement);

const texture2 = loader.load('image2.jpg');
const material2 = new THREE.MeshBasicMaterial({map: texture2, side: THREE.DoubleSide});
const mesh2 = new THREE.Mesh(geometry, material2);
// mesh2.position.set(1, 1, 0)
scene2.add(mesh2);

// Create event system
const eventDispatcher = new THREE.EventDispatcher();

// Listen for zoom event on scene1
const onScene1Zoom = (event) => {
  console.log("onScene1Zoom");
  // Adjust the zoom level of camera2 in scene2
  camera2.zoom = event.zoom;
  camera2.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene1zoom', onScene1Zoom);

// Listen for zoom event on scene2
const onScene2Zoom = (event) => {
  console.log("onScene2Zoom");
  // Adjust the zoom level of camera1 in scene1
  camera1.zoom = event.zoom;
  camera1.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene2zoom', onScene2Zoom);

// Update function for rendering the scenes
function update() {
  // Render scene1
  controls1.update();
  renderer1.render(scene1, camera1);

  // Render scene2
  controls2.update();
  renderer2.render(scene2, camera2);

  // Call the update function recursively for smooth animation
  requestAnimationFrame(update);
}

// Start the rendering loop
update();

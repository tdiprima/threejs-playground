// solo 4 imagenes
import * as THREE from "three";

// Create a scene
let scene = new THREE.Scene();

// Create a camera and position it so that all the images are visible
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 2;

// Create a renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load the images
const image1Texture = textureLoader.load('image1.jpg');
const image2Texture = textureLoader.load('image2.jpg');
const image3Texture = textureLoader.load('image3.jpg');
const image4Texture = textureLoader.load('image4.jpg');

// todo: Create a plane geometry with the same aspect ratio as the images
const planeGeometry = new THREE.PlaneGeometry(1, 1);

// Create the mesh objects for the images
const image1 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({map: image1Texture})); // { side: THREE.DoubleSide }
const image2 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({map: image2Texture}));
const image3 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({map: image3Texture}));
const image4 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({map: image4Texture}));

// Position the images
image1.position.set(-1, 1, 0);
image2.position.set(1, 1, 0);
image3.position.set(-1, -1, 0);
image4.position.set(1, -1, 0);

// Add the images to the scene
scene.add(image1, image2, image3, image4);

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

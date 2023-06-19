console.log(`%cREVISION ${THREE.REVISION}`, "color: #ff00cc;");
import * as THREE from 'three';
import { DragControls } from '/jsm/controls/DragControls.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create initial polygon vertices
const initialVertices = [
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
];

// Create geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialVertices, 3));

// Create material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create mesh
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);

// Create handles for each vertex
const handles = [];
for (let i = 0; i < initialVertices.length; i += 3) {
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.fromArray(initialVertices.slice(i, i + 3));
  handles.push(handleMesh);
}

// Add handles to the scene
handles.forEach(element => scene.add(element));

// Create DragControls
const dragControls = new DragControls(handles, camera, renderer.domElement);

// Function to handle dragging start
dragControls.addEventListener('dragstart', function (event) {
  console.log('Drag start');
  event.object.material.color.set(0xffff00);
});

// Function to handle dragging end
dragControls.addEventListener('dragend', function (event) {
  console.log('Drag end');
  event.object.material.color.set(0xff0000);
});

// Function to handle dragging
dragControls.addEventListener('drag', function (event) {
  const position = event.object.position;
  const index = handles.indexOf(event.object);
  geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
  geometry.attributes.position.needsUpdate = true;
});

window.addEventListener("resize", function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();

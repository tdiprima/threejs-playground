import * as THREE from "three";
import { FontLoader } from "/jsm/loaders/FontLoader.js";
import { TextGeometry } from "/jsm/geometries/TextGeometry.js";

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometry, material, mesh
let textGeometry = new TextGeometry("Hello, Three.js!", {
  font: new FontLoader().load("/fonts/helvetiker_regular.typeface.json"), // Path to the font JSON file
  size: 1, // Size of the text
  height: 0.1, // Thickness of the text
  curveSegments: 12, // Number of points on the curves
  bevelEnabled: false // Disable bevel
});

// Notice! We loaded the font inside there ^ and it still works
// Wait - no it dunt, it's a cube again!
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let textMesh = new THREE.Mesh(textGeometry, material);
scene.add(textMesh);

camera.position.z = 5;

function render() {
  requestAnimationFrame(render);
  textMesh.rotation.x += 0.01;
  textMesh.rotation.y += 0.01;
  renderer.render(scene, camera);
}
render();

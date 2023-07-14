import * as THREE from "three";
import { FontLoader } from "/jsm/loaders/FontLoader.js";
import { TextGeometry } from "/jsm/geometries/TextGeometry.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let fontLoader = new FontLoader();

// Load the font file
fontLoader.load("/fonts/helvetiker_regular.typeface.json", function(font) {
  // Create the text geometry
  let textGeometry = new TextGeometry("Hewwo, Bear!", {
    font: font,
    size: 1,
    // height: 1, <- HERE'S WHY IT LOOKS LIKE CRAP
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: false
  });

  // Center the text geometry
  textGeometry.computeBoundingBox();
  textGeometry.center();

  let textMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  let textMesh = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(textMesh);
});

// Set camera position
camera.position.z = 5;

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

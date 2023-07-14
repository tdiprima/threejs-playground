// todo: DO THIS INSTEAD!
import * as THREE from "three";
import { FontLoader } from "/jsm/loaders/FontLoader.js";
import { TextGeometry } from "/jsm/geometries/TextGeometry.js";

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a loader for the font
let fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
  // Create a TextGeometry using the loaded font
  let textGeometry = new TextGeometry("Hewwo, Bear!", {
    font: font, // Pass the loaded font
    size: 1,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: false
  });

  // Create a material for the text
  let textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Create a mesh using the text geometry and material
  let textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // Add the text mesh to the scene
  scene.add(textMesh);

  function render() {
    requestAnimationFrame(render);
    textMesh.rotation.x += 0.01;
    textMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  render();
});

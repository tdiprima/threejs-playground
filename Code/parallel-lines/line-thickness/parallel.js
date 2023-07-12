import * as THREE from "three";
import { LineSegments2 } from '/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from "/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "/jsm/lines/LineMaterial.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x041122));
renderer.setSize(825, 600);
document.body.appendChild(renderer.domElement);

// todo: understand when to use Vector3, and when to use flat array
let positions = new Float32Array([-1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, -1, 0, 0]);

// Create a LineSegments geometry
let geometry = new LineSegmentsGeometry().setPositions(positions);
console.log(positions);

// Create a material for the line
let material = new LineMaterial({
  linewidth: 5, // Set the desired line thickness
  color: 0x00ffff, // Set the line color
});

// Create the LineSegments object
// let line = new THREE.LineSegments(geometry, material);

// Switch it to 2, all hell break loose.
let line = new LineSegments2(geometry, material);

// Add the line to the scene
scene.add(line);

// default camera pos
camera.position.z = 100;

// renders the scene
let render = function() {
  requestAnimationFrame(render);
  // with LineSegments2
  material.resolution.set(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
};

render();

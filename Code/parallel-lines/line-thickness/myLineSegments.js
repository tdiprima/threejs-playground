import * as THREE from "three";
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x041122));
renderer.setSize(825, 600);
document.body.appendChild(renderer.domElement);

// Define your custom line segments as an array of vertices
// let vertices = [
//   -2, 0, 0, // Start point of 1st segment
//   2, 0, 0, // End point of 1st segment
//   0, 0, -2, // Start point of 2nd segment
//   0, 0, 2, // End point of 2nd segment
//   // Add more vertices for additional segments
// ];

// Since the 2's turn into 1's anyway...
// This one comes out the straightest (using LineSegments)
// let vertices = [1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 1];

// Use with LineSegments2
let vertices = [-1, 0, 0, 1, 0, 0];

// Create a LineSegments geometry
let geometry = new LineSegmentsGeometry().setPositions(vertices);
// OR -
// let geometry = new LineSegmentsGeometry().setPositions([-2, 0, 0, 2, 0, 0]);

// Create a material for the line
let material = new LineMaterial({
  linewidth: 5, // works with LineSegments2
  color: 0xff0000 // Set the line color
});

// Create the LineSegments object
// let line = new THREE.LineSegments(geometry, material);
let line = new LineSegments2(geometry, material);

// Add the line to the scene
scene.add(line);

// default camera pos
camera.position.z = 100;

// renders the scene
let render = function() {
  requestAnimationFrame(render);
  // The LineMaterial expects the resolution of the material to be set explicitly, which affects how the lines are rendered.
  material.resolution.set(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
};

render();

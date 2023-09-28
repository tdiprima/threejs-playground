// Originally https://threejs.org/manual/examples/scenegraph-sun-earth-moon.html
// https://codesandbox.io/s/static-forked-68lif?file=/index.html:0-3768
import * as THREE from "three";
import { Line2 } from "/jsm/lines/Line2.js";
import { LineGeometry } from "/jsm/lines/LineGeometry.js";
import { LineMaterial } from "/jsm/lines/LineMaterial.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);

let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x041122)); // Black Pearl
renderer.setSize(825, 600);
document.body.appendChild(renderer.domElement);

function QuadGeometry(w, h) {
  // 4 vertices
  let pts = [
    [0.5, 0.5],
    [-0.5, 0.5],
    [-0.5, -0.5],
    [0.5, -0.5]
  ];

  // Array [0.5, 0.5] to object { x: 0.5, y: 0.5 }
  let points = pts.map(p => {
    return new THREE.Vector2(p[0], p[1]);
  });

  // This object is used to store and manipulate geometric data for rendering.
  let g = new THREE.BufferGeometry();

  // Create a shape or geometry using these points.
  g.setFromPoints(points);

  // "setIndex" defines the order in which the vertices should be connected to form shapes.
  // It starts with vertex 0, then connects it to vertex 1, then to vertex 2, then to vertex 3, and finally back to vertex 0 to complete the shape.
  g.setIndex([0, 1, 2, 3, 0]);

  // "scale" scales the geometry along the x, y, and z axes
  // It scales the geometry by a factor of 11 along the x and y axes and keeps the z-axis scaling as 1.
  g.scale(w, h, 1);

  // "g" has my 12-element array (because it added the "z" to each vertex)
  // And it has the "index" that I specified

  // "unindexed" is a 15-element array (because it duplicated the first one)
  // And we're stripping the "index" part
  let unindexed = g.toNonIndexed();

  let pp = unindexed.getAttribute('position').array;
  console.log("%cpoints", "color: #997fff;", pp);

  // RETURN GEOMETRY
  return new LineGeometry().setPositions(pp);

  // Return line geometry
  // return new LineGeometry().setPositions(unindexed.getAttribute('position').array);
}

let g = QuadGeometry(11, 11);
let m = new LineMaterial({
  color: "yellow",
  linewidth: 5
});
let quad = new Line2(g, m);

scene.add(quad);

// default camera pos
camera.position.z = 100;

// renders the scene
let render = function() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  m.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport
};

render();

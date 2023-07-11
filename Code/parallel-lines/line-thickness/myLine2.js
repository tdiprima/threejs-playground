// from https://threejs.org/manual/examples/scenegraph-sun-earth-moon.html
import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x041122));
renderer.setSize(825, 600);
document.body.appendChild(renderer.domElement);

// Originally https://threejs.org/manual/examples/scenegraph-sun-earth-moon.html
// https://codesandbox.io/s/static-forked-68lif?file=/index.html:0-3768
function QuadGeometry(w, h) {
  let pts = [
    [0.5, 0.5],
    [-0.5, 0.5],
    [-0.5, -0.5],
    [0.5, -0.5]
  ].map(p => {
    return new THREE.Vector2(p[0], p[1]);
  });
  let g = new THREE.BufferGeometry().setFromPoints(pts);
  g.setIndex([0, 1, 2, 3, 0]);
  g.scale(w, h, 1);

  let unindexed = g.toNonIndexed();
  let geo = new LineGeometry().setPositions(unindexed.getAttribute('position').array);

  return geo;
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

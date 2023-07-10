// Wireframe, LineMaterial, plus an osd-like "navigator"
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/controls/OrbitControls.js';
import { LineMaterial } from 'three/examples/lines/LineMaterial.js';
import { Wireframe } from 'three/examples/lines/Wireframe.js';
import { WireframeGeometry2 } from 'three/examples/lines/WireframeGeometry2.js';

let wireframe, renderer, scene, camera, camera2, controls;
let wireframe1;
let matLine, matLineBasic;

// viewport
let insetWidth;
let insetHeight;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(-50, 0, 50);

  camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000);
  camera2.position.copy(camera.position);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 500;

  // Wireframe ( WireframeGeometry2, LineMaterial )

  let geo = new THREE.IcosahedronGeometry(20, 1);

  let geometry = new WireframeGeometry2(geo);

  matLine = new LineMaterial({
    color: 0x4080ff,
    linewidth: 5, // in pixels
    // resolution:  // to be set by renderer, eventually
    dashed: false
  });

  wireframe = new Wireframe(geometry, matLine);
  wireframe.computeLineDistances();
  wireframe.scale.set(1, 1, 1);
  scene.add(wireframe);

  // Line ( THREE.WireframeGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE

  geo = new THREE.WireframeGeometry(geo);

  matLineBasic = new THREE.LineBasicMaterial({color: 0x4080ff});

  wireframe1 = new THREE.LineSegments(geo, matLineBasic);
  wireframe1.computeLineDistances();
  wireframe1.visible = false;
  scene.add(wireframe1);

  window.addEventListener('resize', onWindowResize);
  onWindowResize();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  insetWidth = window.innerHeight / 4; // square
  insetHeight = window.innerHeight / 4;

  camera2.aspect = insetWidth / insetHeight;
  camera2.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);

  // main scene

  renderer.setClearColor(0x000000, 0);

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

  // renderer will set this eventually
  matLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport

  renderer.render(scene, camera);

  // inset scene

  renderer.setClearColor(0x222222, 1);

  renderer.clearDepth(); // important!

  renderer.setScissorTest(true);

  renderer.setScissor(20, 20, insetWidth, insetHeight);

  renderer.setViewport(20, 20, insetWidth, insetHeight);

  camera2.position.copy(camera.position);
  camera2.quaternion.copy(camera.quaternion);

  // renderer will set this eventually
  matLine.resolution.set(insetWidth, insetHeight); // resolution of the inset viewport

  renderer.render(scene, camera2);

  renderer.setScissorTest(false);
}

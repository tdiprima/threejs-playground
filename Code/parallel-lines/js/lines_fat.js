// Line2, LineMaterial, LineGeometry
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/controls/OrbitControls.js';
import { Line2 } from 'three/examples/lines/Line2.js';
import { LineMaterial } from 'three/examples/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/lines/LineGeometry.js';
import * as GeometryUtils from 'three/examples/utils/GeometryUtils.js';

let line, renderer, scene, camera, camera2, controls;
let line1;
let matLine, matLineBasic, matLineDashed;
let stats;

// viewport
let insetWidth;
let insetHeight;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(-40, 0, 60);

  camera2 = new THREE.PerspectiveCamera(40, 1, 1, 1000);
  camera2.position.copy(camera.position);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 500;

  // Position and THREE.Color Data

  let positions = [];
  let colors = [];

  // Oh, good - hilbert curves X-|
  let points = GeometryUtils.hilbert3D(new THREE.Vector3(0, 0, 0), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7);

  let spline = new THREE.CatmullRomCurve3(points);
  let divisions = Math.round(12 * points.length);
  let point = new THREE.Vector3();
  let color = new THREE.Color();

  for (let i = 0, l = divisions; i < l; i++) {
    let t = i / l;

    spline.getPoint(t, point);
    positions.push(point.x, point.y, point.z);

    color.setHSL(t, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
  }

  // Line2 ( LineGeometry, LineMaterial )

  let geometry = new LineGeometry();
  geometry.setPositions(positions);
  geometry.setColors(colors);

  matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 5, // in world units with size attenuation, pixels otherwise
    vertexColors: true,

    // resolution:  // to be set by renderer, eventually
    dashed: false,
    alphaToCoverage: true
  });

  line = new Line2(geometry, matLine);
  line.computeLineDistances();
  line.scale.set(1, 1, 1);
  scene.add(line);

  // THREE.Line ( THREE.BufferGeometry, THREE.LineBasicMaterial ) - rendered with gl.LINE_STRIP

  let geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  matLineBasic = new THREE.LineBasicMaterial({ vertexColors: true });
  matLineDashed = new THREE.LineDashedMaterial({ vertexColors: true, scale: 2, dashSize: 1, gapSize: 1 });

  line1 = new THREE.Line(geo, matLineBasic);
  line1.computeLineDistances();
  line1.visible = false;
  scene.add(line1);

  //

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
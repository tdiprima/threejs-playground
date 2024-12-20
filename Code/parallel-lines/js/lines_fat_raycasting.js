// Line2, LineSegments2
import * as THREE from 'three';

import Stats from 'three/examples/libs/stats.module.js';
import { GPUStatsPanel } from 'three/examples/utils/GPUStatsPanel.js';

import { GUI } from 'three/examples/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/controls/OrbitControls.js';
import { LineMaterial } from 'three/examples/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/lines/LineSegmentsGeometry.js';
import { Line2 } from 'three/examples/lines/Line2.js';
import { LineGeometry } from 'three/examples/lines/LineGeometry.js';

let line, thresholdLine, segments, thresholdSegments;
let renderer, scene, camera, camera2, controls;
let raycaster, sphereInter, sphereOnLine;
let matLine, matThresholdLine;
let stats, gpuPanel;
let gui;

// viewport
let insetWidth;
let insetHeight;

let pointer = new THREE.Vector2(Infinity, Infinity);

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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

  raycaster = new THREE.Raycaster();
  raycaster.params.Line2 = {};
  raycaster.params.Line2.threshold = 0;

  let sphereGeometry = new THREE.SphereGeometry(0.25);
  let sphereInterMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, depthTest: false });
  let sphereOnLineMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, depthTest: false });

  sphereInter = new THREE.Mesh(sphereGeometry, sphereInterMaterial);
  sphereOnLine = new THREE.Mesh(sphereGeometry, sphereOnLineMaterial);
  sphereInter.visible = false;
  sphereOnLine.visible = false;
  sphereInter.renderOrder = 10;
  sphereOnLine.renderOrder = 10;
  scene.add(sphereInter);
  scene.add(sphereOnLine);

  // Position and THREE.Color Data

  let positions = [];
  let colors = [];
  let points = [];
  for (let i = -50; i < 50; i++) {
    let t = i / 3;
    points.push(new THREE.Vector3(t * Math.sin(2 * t), t, t * Math.cos(2 * t)));
  }

  let spline = new THREE.CatmullRomCurve3(points);
  let divisions = Math.round(3 * points.length);
  let point = new THREE.Vector3();
  let color = new THREE.Color();

  for (let i = 0, l = divisions; i < l; i++) {
    let t = i / l;

    spline.getPoint(t, point);
    positions.push(point.x, point.y, point.z);

    color.setHSL(t, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
  }

  let lineGeometry = new LineGeometry();
  lineGeometry.setPositions(positions);
  lineGeometry.setColors(colors);

  let segmentsGeometry = new LineSegmentsGeometry();
  segmentsGeometry.setPositions(positions);
  segmentsGeometry.setColors(colors);

  matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 1, // in world units with size attenuation, pixels otherwise
    worldUnits: true,
    vertexColors: true,

    // resolution:  // to be set by renderer, eventually
    alphaToCoverage: true
  });

  matThresholdLine = new LineMaterial({
    color: 0xffffff,
    linewidth: matLine.linewidth, // in world units with size attenuation, pixels otherwise
    worldUnits: true,
    // vertexColors: true,
    transparent: true,
    opacity: 0.2,
    depthTest: false,
    visible: false
    // resolution:  // to be set by renderer, eventually
  });

  segments = new LineSegments2(segmentsGeometry, matLine);
  segments.computeLineDistances();
  segments.scale.set(1, 1, 1);
  scene.add(segments);
  segments.visible = false;

  thresholdSegments = new LineSegments2(segmentsGeometry, matThresholdLine);
  thresholdSegments.computeLineDistances();
  thresholdSegments.scale.set(1, 1, 1);
  scene.add(thresholdSegments);
  thresholdSegments.visible = false;

  line = new Line2(lineGeometry, matLine);
  line.computeLineDistances();
  line.scale.set(1, 1, 1);
  scene.add(line);

  thresholdLine = new Line2(lineGeometry, matThresholdLine);
  thresholdLine.computeLineDistances();
  thresholdLine.scale.set(1, 1, 1);
  scene.add(thresholdLine);

  let geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  //
  document.addEventListener('pointermove', onPointerMove);
  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  stats = new Stats();
  document.body.appendChild(stats.dom);

  gpuPanel = new GPUStatsPanel(renderer.getContext());
  stats.addPanel(gpuPanel);
  stats.showPanel(0);
  initGui();
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

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  requestAnimationFrame(animate);

  stats.update();

  // main scene

  renderer.setClearColor(0x000000, 0);

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

  raycaster.setFromCamera(pointer, camera);

  let obj = line.visible ? line : segments;
  let intersects = raycaster.intersectObject(obj, true);

  if (intersects.length > 0) {
    sphereInter.visible = true;
    sphereOnLine.visible = true;
    sphereInter.position.copy(intersects[0].point);
    sphereOnLine.position.copy(intersects[0].pointOnLine);
    let i = intersects[0].faceIndex;
    let colors = obj.geometry.getAttribute('instanceColorStart');
    let color = new THREE.Color().setRGB(colors.getX(i), colors.getY(i), colors.getZ(i));
    sphereInter.material.color.copy(color.clone().offsetHSL(0.3, 0, 0));
    sphereOnLine.material.color.copy(color.clone().offsetHSL(0.7, 0, 0));
    renderer.domElement.style.cursor = 'crosshair';
  } else {
    sphereInter.visible = false;
    sphereOnLine.visible = false;
    renderer.domElement.style.cursor = '';
  }

  // renderer will set this eventually
  matLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport
  matThresholdLine.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport

  gpuPanel.startQuery();
  renderer.render(scene, camera);
  gpuPanel.endQuery();

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

//

function switchLine(val) {
  switch (val) {
    case 0:
      line.visible = true;
      thresholdLine.visible = true;

      segments.visible = false;
      thresholdSegments.visible = false;

      break;

    case 1:
      line.visible = false;
      thresholdLine.visible = false;

      segments.visible = true;
      thresholdSegments.visible = true;

      break;
  }
}

function initGui() {
  gui = new GUI();

  let param = {
    'line type': 0,
    'world units': matLine.worldUnits,
    'visualize threshold': matThresholdLine.visible,
    width: matLine.linewidth,
    alphaToCoverage: matLine.alphaToCoverage,
    threshold: raycaster.params.Line2.threshold,
  };

  gui
    .add(param, 'line type', { LineGeometry: 0, LineSegmentsGeometry: 1 })
    .onChange(val => {
      switchLine(val);
    })
    .setValue(1);

  gui.add(param, 'world units').onChange(val => {
    matLine.worldUnits = val;
    matLine.needsUpdate = true;
    matThresholdLine.worldUnits = val;
    matThresholdLine.needsUpdate = true;
  });

  gui.add(param, 'visualize threshold').onChange(val => {
    matThresholdLine.visible = val;
  });

  gui.add(param, 'width', 1, 10).onChange(val => {
    matLine.linewidth = val;
    matThresholdLine.linewidth = matLine.linewidth + raycaster.params.Line2.threshold;
  });

  gui.add(param, 'alphaToCoverage').onChange(val => {
    matLine.alphaToCoverage = val;
  });

  gui.add(param, 'threshold', 0, 10).onChange(val => {
    raycaster.params.Line2.threshold = val;
    matThresholdLine.linewidth = matLine.linewidth + raycaster.params.Line2.threshold;
  });
}

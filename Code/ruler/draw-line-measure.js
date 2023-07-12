// Draw & Measure Lines
// A reimagined version of the fabric.js program using three.js
// TODO: three.min.js, TextGeometry.js, <div> id "canvas" to append the renderer's DOM element to.
import * as THREE from "three";
import { TextGeometry } from "three/examples/geometries/TextGeometry.js";

let scene, camera, renderer;
let line, lineGeometry, lineMaterial;
let isDrawing = false;
let startPoint, endPoint;
let startVector, endVector;
let text;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  lineGeometry = new THREE.BufferGeometry();
  lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  document.addEventListener('mousedown', onMouseDown, false);
  document.addEventListener('mousemove', onMouseMove, false);
  document.addEventListener('mouseup', onMouseUp, false);
}

function onMouseDown(event) {
  isDrawing = true;

  startPoint = getMouseCoordinates(event);
  startVector = new THREE.Vector3(startPoint.x, startPoint.y, 0);

  lineGeometry.setFromPoints([startVector, startVector]);
  line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}

function onMouseMove(event) {
  if (!isDrawing) return;

  endPoint = getMouseCoordinates(event);
  endVector = new THREE.Vector3(endPoint.x, endPoint.y, 0);

  line.geometry.setFromPoints([startVector, endVector]);

  if (text) scene.remove(text);

  const length = Calculate.lineLength(startPoint.x, startPoint.y, endPoint.x, endPoint.y).toFixed(2);
  // const textGeometry = new TextGeometry(`Length ${length}`, { size: 0.1 });
  const textGeometry = new TextGeometry(`Length ${length}`, { size: 1 });
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  text = new THREE.Mesh(textGeometry, textMaterial);
  text.position.copy(endVector);
  scene.add(text);

  renderer.render(scene, camera);
}

function onMouseUp() {
  isDrawing = false;
}

function getMouseCoordinates(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    const point = intersects[0].point;
    return { x: point.x, y: point.y };
  }

  return { x: 0, y: 0 };
}

const Calculate = {
  lineLength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },
};

init();

import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

let VIEW_ANGLE = 75;
let NEAR = 0.1;
let FAR = 1000;
let RENDER_WIDTH = window.innerWidth / 2;
let RENDER_HEIGHT = window.innerHeight / 2;
let ASPECT = RENDER_WIDTH / RENDER_HEIGHT;

let mineShaft = "#2b2b2b";
let outerSpace = "#484848";

let detachControls = false; // Flag to toggle controls detachment
let isDrawing = false;

let scene1 = new THREE.Scene();
scene1.background = new THREE.Color(mineShaft);

let camera1 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera1.name = "camera1";
camera1.position.z = 2;

let renderer1 = new THREE.WebGLRenderer();
renderer1.setSize(RENDER_WIDTH, RENDER_HEIGHT);
document.getElementById('image1').appendChild(renderer1.domElement);

// todo: position?
let canvas1 = document.createElement('canvas');
canvas1.width = RENDER_WIDTH;
canvas1.height = RENDER_HEIGHT;

let context1 = canvas1.getContext('2d'); // todo: not a function? wth?
context1.strokeStyle = "#ff0000";
context1.lineWidth = 2;

let controls1 = new OrbitControls(camera1, renderer1.domElement);
controls1.addEventListener('change', onControlsChange1);

let texture1 = new THREE.TextureLoader().load('/images/image1.jpg');
let material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
let geometry1 = new THREE.PlaneGeometry(3, 2);
let mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.name = "mesh1";
scene1.add(mesh1);

let scene2 = new THREE.Scene();
scene2.background = new THREE.Color(outerSpace);

let camera2 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera2.name = "camera2";
camera2.position.z = 2;

let renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(RENDER_WIDTH, RENDER_HEIGHT);
document.getElementById('image2').appendChild(renderer2.domElement);

// todo: position?
let canvas2 = document.createElement('canvas2');
canvas2.width = RENDER_WIDTH;
canvas2.height = RENDER_HEIGHT;

let context2 = canvas2.getContext('2d');
context2.strokeStyle = "#0000ff";
context2.lineWidth = 2;

let controls2 = new OrbitControls(camera2, renderer2.domElement);
controls2.addEventListener('change', onControlsChange2);

let texture2 = new THREE.TextureLoader().load('/images/image2.jpg');
let material2 = new THREE.MeshBasicMaterial({map: texture2, side: THREE.DoubleSide});
let geometry2 = new THREE.PlaneGeometry(3, 2);
let mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.name = "mesh2";
scene2.add(mesh2);

function onControlsChange1() {
  // console.log("onControlsChange1"); // YEP! IT WORKS.
  if (detachControls) return;
  camera2.copy(camera1);
  camera2.updateProjectionMatrix();
}

function onControlsChange2() {
  // console.log("onControlsChange2"); // WORKS :)
  if (detachControls) return;
  camera1.copy(camera2);
  camera1.updateProjectionMatrix();
}

// Function to detach or reattach controls based on the 'detachControls' flag
function toggleControlsDetachment() {
  detachControls = !detachControls;
  controls1.enabled = true;
  controls2.enabled = true;
}

// Toggle button click event listener
document.getElementById("toggleButton").addEventListener("click", toggleControlsDetachment);

function updatePointer(event) {
  const mouse = new THREE.Vector2();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  return mouse;
}

function onCanvasMouseMove1(event) {
  if (isDrawing) {
    let x = event.clientX - canvas1.offsetLeft;
    let y = event.clientY - canvas1.offsetTop;
    context1.lineTo(x, y);
    context1.stroke();
    texture1.needsUpdate = true; // todo: wait, what texture?
  }
}

function onCanvasMouseMove2(event) {
  if (isDrawing) {
    let x = event.clientX - canvas2.offsetLeft;
    let y = event.clientY - canvas2.offsetTop;
    context2.lineTo(x, y);
    context2.stroke();
    texture2.needsUpdate = true;
  }
}

canvas1.addEventListener('mousemove', onCanvasMouseMove1);
canvas2.addEventListener('mousemove', onCanvasMouseMove2);

// MOUSEDOWN / RAYCASTING
function onMouseDown1(event) {
  // console.log("onMouseDown1");
  isDrawing = true;
  let x = event.clientX - canvas1.offsetLeft;
  let y = event.clientY - canvas1.offsetTop;
  context1.beginPath();
  context1.moveTo(x, y);

  const mouse = updatePointer(event);

  const raycaster1 = new THREE.Raycaster();
  raycaster1.setFromCamera(mouse, camera1);
  const intersects1 = raycaster1.intersectObject(mesh1);

  if (intersects1.length > 0) {
    console.log('Image 1 clicked!', intersects1[0].object);
    event.stopPropagation();
    return;
  }
}

function onMouseDown2(event) {
  // console.log("onMouseDown2");
  isDrawing = true;
  let x = event.clientX - canvas2.offsetLeft;
  let y = event.clientY - canvas2.offsetTop;
  context2.beginPath();
  context2.moveTo(x, y);

  const mouse = updatePointer(event);

  const raycaster2 = new THREE.Raycaster();
  raycaster2.setFromCamera(mouse, camera2);
  const intersects2 = raycaster2.intersectObject(mesh2);

  if (intersects2.length > 0) {
    console.log('Image 2 clicked!', intersects2[0].object);
    event.stopPropagation();
    return;
  }
}

renderer1.domElement.addEventListener('mousedown', onMouseDown1);
renderer2.domElement.addEventListener('mousedown', onMouseDown2);

window.addEventListener('resize', function () {
  const width = window.innerWidth
  const height = window.innerHeight
  const aspect = width / height

  camera1.aspect = aspect;
  camera1.updateProjectionMatrix();

  camera2.aspect = aspect;
  camera2.updateProjectionMatrix();

  renderer1.setSize(RENDER_WIDTH, RENDER_HEIGHT);
  renderer2.setSize(RENDER_WIDTH, RENDER_HEIGHT);
});

function update() {
  if (!detachControls) {
    controls1.update();
    controls2.update();
  }

  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);

  requestAnimationFrame(update);
}

update();
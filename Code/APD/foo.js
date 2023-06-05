// Image 1 clicked! no matter what.
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

// Create the first scene
let scene1 = new THREE.Scene();
scene1.background = new THREE.Color(mineShaft);

let camera1 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera1.position.z = 2;

let renderer1 = new THREE.WebGLRenderer();
renderer1.setSize(RENDER_WIDTH, RENDER_HEIGHT);
document.getElementById('image1').appendChild(renderer1.domElement);

// Load the first image texture
let texture1 = new THREE.TextureLoader().load('/images/image1.jpg');
let material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
let geometry1 = new THREE.PlaneGeometry(3, 2);
let mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.name = "mesh1";
scene1.add(mesh1);

// Create the second scene
let scene2 = new THREE.Scene();
scene2.background = new THREE.Color(outerSpace);

let camera2 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
camera2.position.z = 2;

let renderer2 = new THREE.WebGLRenderer();
renderer2.setSize(RENDER_WIDTH, RENDER_HEIGHT);
document.getElementById('image2').appendChild(renderer2.domElement);

// Create the OrbitControls instances for each scene
let controls1 = new OrbitControls(camera1, renderer1.domElement);
controls1.addEventListener('change', onControlsChange1);

let controls2 = new OrbitControls(camera2, renderer2.domElement);
controls2.addEventListener('change', onControlsChange2);

// Load the second image texture
let texture2 = new THREE.TextureLoader().load('/images/image2.jpg');
let material2 = new THREE.MeshBasicMaterial({map: texture2, side: THREE.DoubleSide});
let geometry2 = new THREE.PlaneGeometry(3, 2);
let mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.name = "mesh2";
scene2.add(mesh2);

// Event handler for changes in controls1
function onControlsChange1() {
  // console.log("onControlsChange1"); // YEP! IT WORKS.
  camera2.copy(camera1);
  camera2.updateProjectionMatrix();
}

// Event handler for changes in controls2
function onControlsChange2() {
  // console.log("onControlsChange2"); // WORKS :)
  camera1.copy(camera2);
  camera1.updateProjectionMatrix();
}

// MOUSEDOWN / RAYCASTING
function onDocumentMouseDown(event) {

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // TODO - camera?? (parent?) intersects?? re-create raycaster each time?
  const raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(mouse, camera1);

  const intersects = raycaster.intersectObjects([mesh1, mesh2]);

  if (intersects.length > 0) {
    // selectedCamera = intersects[0].object.parent.children[0];
    console.log('Image clicked!', intersects[0].object);
  }
}

document.addEventListener('mousedown', onDocumentMouseDown);

window.addEventListener('resize', function () {
  camera1.aspect = window.innerWidth / window.innerHeight;
  camera1.updateProjectionMatrix();
  camera2.aspect = window.innerWidth / window.innerHeight;
  camera2.updateProjectionMatrix();
  renderer1.setSize(RENDER_WIDTH, RENDER_HEIGHT);
  renderer2.setSize(RENDER_WIDTH, RENDER_HEIGHT);
});

// Update function for rendering the scenes
function update() {
  controls1.update();
  renderer1.render(scene1, camera1);

  controls2.update();
  renderer2.render(scene2, camera2);

  requestAnimationFrame(update);
}

// Start the rendering loop
update();

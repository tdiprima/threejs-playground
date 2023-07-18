import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

console.log(`%cREVISION: ${THREE.REVISION}`, "color: #ccff00;");
let btnDraw = document.getElementById("toggleButton");
let imageSource = "/images/image1.jpg";
let isDrawing = false;
let mouseIsPressed = false;
let positions = []; // Set up arrays to hold line data
let controls;
let color = "#0000ff";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new OrbitControls(camera, renderer.domElement);

btnDraw.addEventListener("click", function () {
  positions = [];
  if (isDrawing) {
    isDrawing = false;
    controls.enabled = true;

    renderer.domElement.removeEventListener("mousemove", onMouseMove);
    renderer.domElement.removeEventListener("mouseup", onMouseUp);
  } else {
    isDrawing = true;
    controls.enabled = false;

    // Set up the mouse event listeners
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
  }
});

let loader = new THREE.TextureLoader();
let planeGeom = new THREE.PlaneGeometry(10, 10);
let texture = loader.load(imageSource);
let planeMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
let plane = new THREE.Mesh(planeGeom, planeMat);
scene.add(plane);

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Create a new LineMaterial instance with appropriate parameters
let material = new LineMaterial({
  color: new THREE.Color(color),
  linewidth: 5,
  resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
});

let mesh;

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new LineGeometry for each line
    let lineGeometry = new LineGeometry();

    // Set initial positions as a line with zero length
    lineGeometry.setPositions([0, 0, 0, 0, 0, 0]);

    mesh = new Line2(lineGeometry, material);

    console.log("%cpositions", "color: #ff00cc;", mesh.geometry.attributes.position.array);

    scene.add(mesh);
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      let intersectedObject = intersects[0].object;
      if (intersectedObject.geometry) {
        console.log("%cYou've been warned.", "color: #ff6a5a;font-size: larger;");
        let point = intersects[0].point;
        positions.push(point.x, point.y, point.z);

        let lineGeometry = mesh.geometry;
        lineGeometry.setPositions(positions);

        // Set needsUpdate to true for the position attribute
        lineGeometry.attributes.position.needsUpdate = true;
      }
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    let lineGeometry = mesh.geometry;
    lineGeometry.setDrawRange(0, positions.length / 3);
    lineGeometry.computeBoundingSphere();

    positions = [];
  }
}

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();


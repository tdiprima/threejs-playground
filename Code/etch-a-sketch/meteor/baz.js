import * as THREE from "three";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";

let btnDraw = document.getElementById("toggleButton");
let imageSource = "/images/image1.jpg";
let isDrawing = false;
let mouseIsPressed = false;
// let positions = []; todo
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

btnDraw.addEventListener("click", function() {
  // positions = []; // todo "current"?
  if (isDrawing) {
    isDrawing = false;
    controls.enabled = true;

    renderer.domElement.removeEventListener("mousemove", onMouseMove);
    renderer.domElement.removeEventListener("mouseup", onMouseUp);
  } else {
    isDrawing = true;
    controls.enabled = false;

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
  }
});

let loader = new THREE.TextureLoader();
let planeGeom = new THREE.PlaneGeometry(10, 10);
let texture = loader.load(imageSource);
let planeMat = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide
});
let plane = new THREE.Mesh(planeGeom, planeMat);
scene.add(plane);

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Dashed Line Issue Solution
let lineMaterial = new THREE.LineBasicMaterial({
  color
});
lineMaterial.polygonOffset = true;
lineMaterial.polygonOffsetFactor = -1;
lineMaterial.depthTest = false;
lineMaterial.depthWrite = false;
lineMaterial.transparent = true;
lineMaterial.alphaTest = 0.5; // Adjust this value as needed

let line;
// START
let currentPolygonPositions = []; // Store positions for current polygon
let polygonPositions = []; // Store positions for each polygon
// const distanceThreshold = 0.001;
const distanceThreshold = 0.1;

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new BufferAttribute for each line
    let bufferGeometry = new THREE.BufferGeometry();
    line = new THREE.Line(bufferGeometry, lineMaterial);
    scene.add(line);

    currentPolygonPositions = []; // Start a new array
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      let point = intersects[0].point;

      // Store the position in the current polygon's array
      currentPolygonPositions.push(point.x, point.y, point.z);

      let bufferGeometry = line.geometry;

      // DISTANCE CHECK
      const lastVertex = new THREE.Vector3().fromArray(currentPolygonPositions.slice(-3));
      const currentVertex = new THREE.Vector3(point.x, point.y, point.z);
      const distance = lastVertex.distanceTo(currentVertex);
      console.log("%clastVertex", "color: deeppink", lastVertex);
      console.log("%ccurrentVertex", "color: #ccff00;", currentVertex);
      console.log("%cdistance", "color: #997fff;", distance);

      // If I do distance === 0 (theoretically it's the 1st one), the drawing is "off",
      // and we still get connections sometimes.  So idk wtf.
      if (distance === 0 || distance > distanceThreshold) {
        console.log("here");
        // Use the current polygon's array for the line's position attribute
        line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3));

        bufferGeometry.attributes.position.needsUpdate = true;
      }
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    // Draw the final line
    line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
    line.geometry.computeBoundingSphere();

    // Store the current polygon's positions in the polygonPositions array
    polygonPositions.push(currentPolygonPositions);
    // Clear the current polygon's array
    currentPolygonPositions = [];
  }
}
// END

window.addEventListener("resize", function() {
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

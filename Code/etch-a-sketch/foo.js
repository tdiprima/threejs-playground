// new array
import * as THREE from "three";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";

let btnDraw = document.getElementById("toggleButton");
let imageSource = "/images/image1.jpg";
let isDrawing = false;
let mouseIsPressed = false;
let positions = [];
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

// Set up geometry to raycast against
let loader = new THREE.TextureLoader();
let planeGeom = new THREE.PlaneGeometry(10, 10);

// Get texture
let texture = loader.load(imageSource);

// Set material texture
let planeMat = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
let plane = new THREE.Mesh(planeGeom, planeMat);
scene.add(plane);

// Set up the raycaster and mouse vector
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Set up line material and geometry
let lineMaterial = new THREE.LineBasicMaterial({ color });

// Dashed Line Issue Solution
lineMaterial.polygonOffset = true;
lineMaterial.polygonOffsetFactor = -1;
lineMaterial.depthTest = false;
lineMaterial.depthWrite = false;
lineMaterial.transparent = true;
lineMaterial.alphaTest = 0.5; // Adjust this value as needed

let line;
let currentPolygonPositions = []; // Declare a variable to store positions for the current polygon
let polygonPositions = []; // Declare an array to store positions for each polygon

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new BufferAttribute for each line
    let bufferGeometry = new THREE.BufferGeometry();
    line = new THREE.Line(bufferGeometry, lineMaterial);
    scene.add(line);

    currentPolygonPositions = []; // Start a new array for the current polygon's positions
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Use raycaster to get intersection point with scene
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      let point = intersects[0].point;
      // positions.push(point.x, point.y, point.z); TODO

      let bufferGeometry = line.geometry;
      // line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      currentPolygonPositions.push(point.x, point.y, point.z); // Store the position in the current polygon's array
      line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3)); // Use the current polygon's array for the line's position attribute

      bufferGeometry.attributes.position.needsUpdate = true;
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    // Draw the final line
    line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
    line.geometry.computeBoundingSphere();

    console.log(`%cNum vertices:`, 'color: #997fff', currentPolygonPositions.length);
    console.log("positions", line.geometry.getAttribute("position").array);

    polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions in the polygonPositions array
    currentPolygonPositions = []; // Clear the current polygon's array
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

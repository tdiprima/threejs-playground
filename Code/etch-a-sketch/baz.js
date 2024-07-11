// Calculate polygon area and perimeter in microns
import * as THREE from "three";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";
let btnDraw = document.getElementById("toggleButton");
let imageSource = "/images/image1.jpg";
let isDrawing = false;
let mouseIsPressed = false;
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
  if (isDrawing) {
    isDrawing = false;
    controls.enabled = true;

    // Remove the mouse event listeners
    renderer.domElement.removeEventListener("mousemove", onMouseMove);
    renderer.domElement.removeEventListener("mouseup", onMouseUp);
  } else {
    // Drawing on
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

let lineMaterial = new THREE.LineBasicMaterial({ color });

// Dashed Line Issue Solution
lineMaterial.polygonOffset = true;
lineMaterial.polygonOffsetFactor = -1;
lineMaterial.depthTest = false;
lineMaterial.depthWrite = false;
lineMaterial.transparent = true;
lineMaterial.alphaTest = 0.5; // Adjust this value as needed

// START
let line;
let currentPolygonPositions = []; // Store positions for current polygon
let polygonPositions = []; // Store positions for each polygon
const distanceThreshold = 0.1;

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
    const canvas = document.querySelector('canvas');
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Use raycaster to get intersection point with scene
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      let point = intersects[0].point;

      // Check if it's the first vertex of the current polygon
      const isFirstVertex = currentPolygonPositions.length === 0;

      if (isFirstVertex) {
        // Store the position in the current polygon's array
        currentPolygonPositions.push(point.x, point.y, point.z);
      } else {
        // DISTANCE CHECK
        const lastVertex = new THREE.Vector3().fromArray(currentPolygonPositions.slice(-3));
        const currentVertex = new THREE.Vector3(point.x, point.y, point.z);
        const distance = lastVertex.distanceTo(currentVertex);

        if (distance > distanceThreshold) {
          currentPolygonPositions.push(point.x, point.y, point.z); // Store the position in the current polygon's array
          line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3)); // Use the current polygon's array for the line's position attribute
        }
      }

      try {
        let bufferGeometry = line.geometry;
        bufferGeometry.attributes.position.needsUpdate = true;
      } catch (e) {
        // No big deal.
      }
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    // Ensure there are at least 3 points to form a closed polygon
    if (currentPolygonPositions.length >= 9) { // 3 points * 3 coordinates (x, y, z)
      // Close the polygon by adding the first point to the end
      const firstPoint = currentPolygonPositions.slice(0, 3);
      currentPolygonPositions.push(...firstPoint);

      // Create a new geometry with the closed polygon positions
      const closedPolygonGeometry = new THREE.BufferGeometry();
      closedPolygonGeometry.setAttribute('position', new THREE.Float32BufferAttribute(currentPolygonPositions, 3));
      line.geometry = closedPolygonGeometry;
      line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
      line.geometry.computeBoundingSphere();

      // Calculate area and perimeter
      const area = calculatePolygonArea(currentPolygonPositions);
      const perimeter = calculatePolygonPerimeter(currentPolygonPositions);

      // Display the area and perimeter
      displayAreaAndPerimeter(area, perimeter);
    }

    polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions

    currentPolygonPositions = []; // Clear the current polygon's array for the next drawing
  }
}

function calculatePolygonArea(positions) {
  let area = 0;
  let n = positions.length / 3;
  for (let i = 0; i < n - 1; i++) {
    let x1 = positions[3 * i];
    let y1 = positions[3 * i + 1];
    let x2 = positions[3 * (i + 1)];
    let y2 = positions[3 * (i + 1) + 1];
    area += x1 * y2 - x2 * y1;
  }
  area = Math.abs(area) / 2;
  return area;
}

function calculatePolygonPerimeter(positions) {
  let perimeter = 0;
  let n = positions.length / 3;
  for (let i = 0; i < n - 1; i++) {
    let x1 = positions[3 * i];
    let y1 = positions[3 * i + 1];
    let x2 = positions[3 * (i + 1)];
    let y2 = positions[3 * (i + 1) + 1];
    perimeter += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  return perimeter;
}

function displayAreaAndPerimeter(area, perimeter) {
  // Convert area and perimeter to microns
  let areaInMicrons = area / 16; // 1 micron² = 16 pixels²
  let perimeterInMicrons = perimeter / 4; // 1 micron = 4 pixels

  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.top = "10px";
  div.style.left = "10px";
  div.style.backgroundColor = "white";
  div.style.padding = "10px";
  div.style.border = "1px solid black";

  let closeButton = document.createElement("span");
  closeButton.style.float = "right";
  closeButton.style.cursor = "pointer";
  closeButton.textContent = "X";
  closeButton.addEventListener("click", function() {
    div.style.display = "none";
  });

  div.innerHTML = `Area: ${areaInMicrons.toFixed(2)} microns²<br>Perimeter: ${perimeterInMicrons.toFixed(2)} microns`;
  div.appendChild(closeButton);
  document.body.appendChild(div);
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

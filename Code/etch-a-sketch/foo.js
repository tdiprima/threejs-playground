/**
 * The code checks if it's the first vertex of the current polygon
 * by comparing the length of currentPolygonPositions with zero.
 * If it's the first vertex, it is directly added to the positions array
 * without the distance check. For subsequent vertices, the distance check
 * is performed as before.
 */
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
    }

    polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions

    currentPolygonPositions = []; // Clear the current polygon's array for the next drawing
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

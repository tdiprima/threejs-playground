import * as THREE from "three";
import { FontLoader } from "/jsm/loaders/FontLoader.js";
import { TextGeometry } from "/jsm/geometries/TextGeometry.js";

let message = "";

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Variables for line drawing
let isDrawing = false;
let startPoint, endPoint;
let line, textMesh;

// todo: FONT LOADER HERE
let fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
  // Event listeners for mouse interactions
  renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  renderer.domElement.addEventListener('mouseup', onMouseUp, false);

  function onMouseDown(event) {
    isDrawing = true;
    startPoint = getMouseCoordinates(event);

    // Create the line geometry
    let lineGeometry = new THREE.BufferGeometry();
    let lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    // Set initial position as start point
    lineGeometry.setFromPoints([startPoint, startPoint]);

    // Create the line mesh
    line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
  }

  function onMouseMove(event) {
    if (!isDrawing) return;

    endPoint = getMouseCoordinates(event);

    // Update the line geometry with start and end points
    line.geometry.setFromPoints([startPoint, endPoint]);

    // Calculate the line length
    let length = Calculate.lineLength(startPoint.x, startPoint.y, endPoint.x, endPoint.y).toFixed(2);

    // Create the text geometry
    message = `Length: ${length}`;
    console.log(`%c${message}`, "color: #ccff00;");

    let textGeometry = new TextGeometry(message, {
      font: font,
      size: 0.2,
      height: 0.1
    });

    // Create the text material
    let textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Remove the previous text mesh if it exists
    if (textMesh) {
      scene.remove(textMesh);
    }

    // Create the text mesh
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Set the position of the text mesh based on the end point of the line
    textMesh.position.copy(endPoint);
    scene.add(textMesh);

    // Render the scene
    renderer.render(scene, camera);
  }

  function onMouseUp() {
    isDrawing = false;
    console.log(`%c${message}`, "color: #ccff00;");
  }

  // Function to convert mouse coordinates to normalized device coordinates
  function getMouseCoordinates(event) {
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      return intersects[0].point;
    }

    return { x: 0, y: 0, z: 0 };
  }

  // Helper object for calculations
  const Calculate = {
    lineLength(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
  };

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  // Start rendering
  render();
});

import * as THREE from "three";
import { FontLoader } from "three/examples/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/geometries/TextGeometry.js";

let scene, camera, renderer;
let line, lineGeometry, lineMaterial;
let isDrawing = false;
let startPoint, endPoint;
let startVector, endVector;
// let textMesh = new THREE.Mesh(); // <- because animate(), but it makes it look weird!
let textMesh;
let message = "";
let loader = new FontLoader();

// https://github.com/mrdoob/three.js/tree/dev/examples/fonts
let myFont = "/fonts/helvetiker_regular.typeface.json";
// let myFont = "https://threejs.org/examples/fonts/gentilis_regular.typeface.json";
// let myFont = "https://threejs.org/examples/fonts/optimer_regular.typeface.json";

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let planeGeometry = new THREE.PlaneGeometry(14.5, 7.5);
  let planeMaterial = new THREE.MeshBasicMaterial({ color: "#5a5a5a" }); // Chicago
  let plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  lineGeometry = new THREE.BufferGeometry();
  lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  renderer.domElement.addEventListener('mouseup', onMouseUp, false);
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

  if (textMesh) scene.remove(textMesh);

  // CREATE TEXT GEOMETRY
  loader.load(myFont, function (font) {
    // p.s. If it looks like a box, then you didn't do loader.load(font)!
    if (textMesh) scene.remove(textMesh);

    let length = Calculate.lineLength(
      startPoint.x,
      startPoint.y,
      endPoint.x,
      endPoint.y,
      calculateScaleFactor(camera, renderer)
    ).toFixed(2);

    message = `Length ${length}`;

    let textGeometry = new TextGeometry(message, {
      font: font,
      size: 0.2,
      height: 0.1,
      // curveSegments: 12,
      // bevelEnabled: false
    });

    let textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.copy(endVector);
    scene.add(textMesh);

    renderer.render(scene, camera);
  });
}

function onMouseUp() {
  isDrawing = false;
  console.log(`%c${message}`, "color: #ccff00;");
}

function getMouseCoordinates(event) {
  let mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    let point = intersects[0].point;
    return { x: point.x, y: point.y };
  }

  return { x: 0, y: 0 };
}

const Calculate = {
  lineLength(x1, y1, x2, y2, scaleFactor) {
    const threeJsUnitsLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return threeJsUnitsLength * scaleFactor; // Convert to pixels
  }
};

// Determine scaleFactor based on scene setup
function calculateScaleFactor(camera, renderer) {
  // Calculate the visible height at the depth of the plane
  const distance = camera.position.z;
  const vFov = (camera.fov * Math.PI) / 180; // Convert vertical fov to radians
  const planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance;

  // Calculate the scale factor
  const screenHeight = renderer.domElement.clientHeight;
  const scaleFactor = screenHeight / planeHeightAtDistance;

  return scaleFactor;
}

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function animate() {
  requestAnimationFrame(animate);
  // The textMesh will always face towards the camera, preventing it from appearing
  // "tilted" or "swiveled" as the camera moves around the scene.
  // textMesh.lookAt(camera.position); // Make the text face the camera
  renderer.render(scene, camera);
})();

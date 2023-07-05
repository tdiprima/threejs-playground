// Like uno.js ++
import * as THREE from "three";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

console.log(`%cREVISION ${THREE.REVISION}`, "color: #ff00cc;");

let line;
let isDown;
let startx = [];
let endx = [];
let starty = [];
let endy = [];
let temp = 0;
let trigger = '1';
let text;

// Set up Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a line material
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Create an empty geometry for the line
const geometry = new THREE.Geometry(); // todo: BufferGeometry

// Create a group to hold the line and text
const group = new THREE.Group();
scene.add(group);

// Event listener for mouse down
function onMouseDown(event) {
  let pointer = getPointer(event);
  if (trigger === '1') {
    isDown = true;
    startx[temp] = pointer.x;
    starty[temp] = pointer.y;
    geometry.vertices.push(new THREE.Vector3(pointer.x, pointer.y, 0));
    line = new THREE.Line(geometry, material);
    group.add(line);
  } else {
    // Update object coordinates
    group.children.forEach(obj => {
      obj.geometry.verticesNeedUpdate = true;
      obj.geometry.computeBoundingSphere();
    });
  }
}

// Event listener for mouse move
function onMouseMove(event) {
  if (!isDown) return;
  scene.remove(text);
  renderer.render(scene, camera);
  let pointer = getPointer(event);
  line.geometry.vertices.push({"x": pointer.x, "y": pointer.y, "z": 0});
  endx[temp] = pointer.x;
  endy[temp] = pointer.y;

  if (trigger === '1') {
    let px = Calculate.lineLength(startx[temp], starty[temp], endx[temp], endy[temp]).toFixed(2);

    const loader = new FontLoader();

    loader.load('/fonts/helvetiker_bold.typeface.json', function (font) {

      const textGeometry = new TextGeometry(`Length ${px}`, {
        size: 0.2,
        font: font
      });
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      text = new THREE.Mesh(textGeometry, textMaterial);
      text.position.set(endx[temp], endy[temp], 0);
      group.add(text);
      // scene.add(text); ?

    });
  }

  line.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);
}

// Event listener for mouse up
function onMouseUp(event) {
  isDown = false;
}

// Helper function to get normalized pointer coordinates
function getPointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  return { x, y };
}

// Event listeners for mouse actions
renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);

// Function to calculate line length
const Calculate = {
  lineLength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 * 1 - x1 * 1, 2) + Math.pow(y2 * 1 - y1 * 1, 2));
  },
};

// Toggle trigger value
document.getElementById('selec').addEventListener('click', function () {
  if (trigger === '1') {
    trigger = '0';
  } else {
    trigger = '1';
  }
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();


// With sprites, you won't need to worry about the tilting effect
// since sprites always face the camera by default.
import * as THREE from "three";

let scene, camera, renderer;
let line, lineGeometry, lineMaterial;
let isDrawing = false;
let startPoint, endPoint;
let startVector, endVector;
let sprite;
let message = "";

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
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

  if (sprite) scene.remove(sprite);

  // CREATE SPRITE
  let length = Calculate.lineLength(startPoint.x, startPoint.y, endPoint.x, endPoint.y).toFixed(2);
  message = `${length}`;
  let textTexture = createTextTexture(message);
  let spriteMaterial = new THREE.SpriteMaterial({ map: textTexture });
  sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.4, 0.2, 1);
  sprite.position.copy(endVector);
  scene.add(sprite);

  renderer.render(scene, camera);
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

/**
 * Create Text Texture (using sprite)
 */
function createTextTexture(text) {
  // const texture = loader.load('your-texture.png'); // <- or load a png as your texture
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  let textMetrics = context.measureText(text);
  let width = textMetrics.width;
  // console.log("text width:", width);
  let height = 12;

  canvas.width = width;
  canvas.height = height;

  context.font = `Bold ${height - 2}px Arial`; // -2 for padding
  context.fillStyle = 'white';
  context.fillText(text, 0, height);

  let texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  return texture;
}

const Calculate = {
  lineLength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
};

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
})();

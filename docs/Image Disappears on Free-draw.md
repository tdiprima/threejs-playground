## Solution

TextureLoader.  PlaneGeometry.  Raycaster.  _Done._

```js
console.log(`%cREVISION: ${THREE.REVISION}`, "color: #ccff00;");
let scene = new THREE.Scene();
let imageSource = "/images/image1.jpg";

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up geometry to raycast against
const loader = new THREE.TextureLoader();
const planeGeom = new THREE.PlaneGeometry(10, 10);

// Get texture
const texture = loader.load(imageSource);

// Set material texture
const material = new THREE.MeshBasicMaterial({ map: texture });

const mesh = new THREE.Mesh(planeGeom, material);
scene.add(mesh);

// Set up the raycaster and mouse vector
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Set up line material and geometry
let lineMaterial = new THREE.LineBasicMaterial({color: "#0000ff"});
let bufferGeometry = new THREE.BufferGeometry();

// Set up arrays to hold line data
let positions = [];

// Set up line object
let line = new THREE.Line(bufferGeometry, lineMaterial);
scene.add(line);

// Set up the mouse event listeners
document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener("mouseup", onMouseUp, false);

function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use raycaster to get intersection point with scene
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    let point = intersects[0].point;
    positions.push(point.x, point.y, point.z);
    line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  }
}

function onMouseUp() {
  // Remove the mouse event listeners
  // todo: You don't have to.
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);

  // Draw the final line
  console.log("positions", positions);
  line.geometry.setDrawRange(0, positions.length / 3);
  line.geometry.computeBoundingSphere();
}

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
```

## Original:

```js
import * as THREE from "three";let isDrawing = false;let scene = new THREE.Scene();let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);camera.position.z = 10;let renderer = new THREE.WebGLRenderer();renderer.setSize(window.innerWidth, window.innerHeight);renderer.setClearColor(0x101010);document.body.appendChild(renderer.domElement);let light = new THREE.DirectionalLight(0xffffff, 2);light.position.setScalar(10);scene.add(light);let planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);let texture = new THREE.TextureLoader().load("/images/uv_grid_opengl.jpg");let planeMaterial = new THREE.MeshBasicMaterial({ map: texture });let plane = new THREE.Mesh(planeGeometry, planeMaterial);scene.add(plane);// Create a canvas element and add it as a texture to the plane geometrylet canvas = document.createElement('canvas');canvas.width = window.innerWidth;canvas.height = window.innerHeight;

let context = canvas.getContext("2d");let canvasTexture = new THREE.CanvasTexture(canvas);planeMaterial.map = canvasTexture;context.strokeStyle = "#FF0000";context.lineWidth = 5;// allow the user to draw on the canvasfunction onCanvasMouseDown(event) {  isDrawing = true;  let x = event.clientX - canvas.offsetLeft;  let y = event.clientY - canvas.offsetTop;  context.beginPath();  context.moveTo(x, y);}function onCanvasMouseMove(event) {  if (isDrawing) {    let x = event.clientX - canvas.offsetLeft;    let y = event.clientY - canvas.offsetTop;    context.lineTo(x, y);    context.stroke();    // Tell three.js to update the texture with the latest contents of the canvas    canvasTexture.needsUpdate = true;  }}// TODO: I tried each of these.// canvas.addEventListener// window.addEventListener// document.addEventListenerdocument.addEventListener('mousemove', onCanvasMouseMove);document.addEventListener('mousedown', onCanvasMouseDown);// Add mouseupdocument.addEventListener('mouseup', function() {  isDrawing = false;  context.closePath();  context.stroke();});// Append canvas to body after creating itdocument.body.appendChild(canvas);
(function render() {  requestAnimationFrame(render);  renderer.render(scene, camera);})();
```

## Conversation

I have a three.js script where I am loading an image, plus letting the user free-draw.  My free-draw part works, but the image doesn't show up.  The thing that makes the image disappear is:

```javascript
planeMaterial.map = canvasTexture;
```

The issue you're facing is related to the order in which you're setting the texture for the material and updating the canvas texture.

In your code, you're setting the canvas texture to the `planeMaterial.map` property before any drawing occurs on the canvas. At that point, the canvas is empty, and as a result, the image texture appears to be missing.

To fix this issue, you should update the canvas texture only after you have drawn something on the canvas. Here's the modified code:

```javascript
// ...

let canvasTexture = new THREE.CanvasTexture(canvas);

// ...

// allow the user to draw on the canvas
function onCanvasMouseDown(event) {
  isDrawing = true;
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;
  context.beginPath();
  context.moveTo(x, y);
}

function onCanvasMouseMove(event) {
  if (isDrawing) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    context.lineTo(x, y);
    context.stroke();

    // Move this line inside the if statement
    canvasTexture.needsUpdate = true;
  }
}

// ...

(function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
})();
```

By moving `canvasTexture.needsUpdate = true;` inside the `if (isDrawing)` block, the canvas texture will only be updated when there is an actual drawing action taking place. This way, the image texture will be visible while allowing the user to free-draw on top of it.

<br>

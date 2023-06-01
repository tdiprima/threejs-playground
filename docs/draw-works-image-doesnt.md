## Battling free-draw in secure witchfire 🧙🏻‍♀️

```js
import * as THREE from "three";
console.log(`%cREVISION: ${THREE.REVISION}`, "color: #ccff00;");

let isDrawing = false;

let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 10;

let renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101010);
document.body.appendChild(renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 2);
light.position.setScalar(10);
scene.add(light);

// todo: why. ffs why not loading.
let planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
let texture = new THREE.TextureLoader().load("/images/uv_grid_opengl.jpg");
let planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// Create a canvas element and add it as a texture to the plane geometry
let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext("2d");

let canvasTexture = new THREE.CanvasTexture(canvas);
planeMaterial.map = canvasTexture;

context.strokeStyle = "#FF0000";
context.lineWidth = 5;

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
        // Tell three.js to update the texture with the latest contents of the canvas
        canvasTexture.needsUpdate = true;
    }
}

// TODO: So I guess I tried each of these.
// canvas.addEventListener
// window.addEventListener
// document.addEventListener
document.addEventListener('mousemove', onCanvasMouseMove);
document.addEventListener('mousedown', onCanvasMouseDown);

// Add mouseup
document.addEventListener('mouseup', function() {
    isDrawing = false;
    context.closePath();
    context.stroke();
});

(function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
})();
```

<br>

The issue in your code lies in the event listeners for mouse events. You are currently attaching the event listeners to the `document`, which means that the `canvas` element does not receive the mouse events correctly. To fix this, you need to attach the event listeners directly to the `canvas` element instead.

Here's the modified code with the event listeners attached to the `canvas` element.

Well, now nothing works.

As you can see from above, I already tried canvas and everything else.

```javascript
import * as THREE from "three";

let isDrawing = false;
let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 10;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x101010);
document.body.appendChild(renderer.domElement);

let light = new THREE.DirectionalLight(0xffffff, 2);
light.position.setScalar(10);
scene.add(light);

let planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
let texture = new THREE.TextureLoader().load("/images/uv_grid_opengl.jpg");
let planeMaterial = new THREE.MeshBasicMaterial({
    map: texture
});

let plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext("2d");
let canvasTexture = new THREE.CanvasTexture(canvas);
planeMaterial.map = canvasTexture;
context.strokeStyle = "#FF0000";
context.lineWidth = 5;

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
        canvasTexture.needsUpdate = true;
    }
}

canvas.addEventListener('mousemove', onCanvasMouseMove);
canvas.addEventListener('mousedown', onCanvasMouseDown);
canvas.addEventListener('mouseup', function() {
    isDrawing = false;
    context.closePath();
    context.stroke();
});

document.body.appendChild(canvas); // Append the canvas to the body

(function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
})();
```

<br>

In this modified code, the event listeners are added to the `canvas` element using `canvas.addEventListener` instead of `document.addEventListener`. Additionally, the `canvas` element is appended to the `body` after creating it.

<br>

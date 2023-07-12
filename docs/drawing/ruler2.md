## Ruler #2

I have fabric.js code that lets the user draw a line on the canvas, and it measures the line in real time.  Could you convert this script to three.js?

```javascript
// FABRIC BONANZA
let line;
let isDown;
let startx = [];
let endx = [];
let starty = [];
let endy = [];
let temp = 0;
let trigger = '1';
let text;

let canvas = new fabric.Canvas('canvas', {
  hoverCursor: 'pointer',
  selection: false
});
fabric.Object.prototype.transparentCorners = false;

canvas.on('mouse:down', o => {
  let event = o.e;
  if (trigger === '1') {
    isDown = true;
    let pointer = canvas.getPointer(event);
    let points = [pointer.x, pointer.y, pointer.x, pointer.y];
    startx[temp] = pointer.x;
    starty[temp] = pointer.y;
    line = new fabric.Line(points, {
      strokeWidth: 2,
      stroke: '#0f0',
      originX: 'center',
      originY: 'center'
    });
    canvas.add(line);
  } else {
    canvas.forEachObject(obj => {
      obj.setCoords(); // update coordinates
    });
  }
});

let Calculate = {
  lineLength(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 * 1 - x1 * 1, 2) + Math.pow(y2 * 1 - y1 * 1, 2));
  },
};

canvas.on('mouse:move', o => {
  if (!isDown) return;
  canvas.remove(text); // remove text element before re-adding it
  canvas.renderAll();
  let pointer = canvas.getPointer(o.e);
  line.set({
    x2: pointer.x,
    y2: pointer.y
  });

  endx[temp] = pointer.x;
  endy[temp] = pointer.y;

  if (trigger === '1') {
    let px = Calculate.lineLength(startx[temp], starty[temp], endx[temp], endy[temp]).toFixed(2);
    text = new fabric.Text(`Length ${px}`, {
      left: endx[temp],
      top: endy[temp],
      fontSize: 12
    });
    canvas.add(text);
  }

  canvas.renderAll();
});

canvas.on('mouse:up', o => {
  let event = o.e;
  isDown = false;
});

document.getElementById("selec").addEventListener("click", function() {
  if (trigger === '1') {
    trigger = '0';
  } else {
    trigger = '1';
  }
});
```

## Fabric to Three Conversion

To convert the provided fabric.js code to three.js, you'll need to use the WebGL renderer and create the necessary objects and event listeners.

<mark>**Go run this in three.js/examples, rev 124.**</mark>

```html
<button id="selec">Selection Mode</button>
```

```javascript
import * as THREE from '../build/three.module.js';
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

// todo: Create an empty geometry for the line
const geometry = new THREE.Geometry();
// https://threejs.org/docs/#api/en/core/BufferGeometry
// const geometry = new THREE.BufferGeometry();

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
    // todo: Can't assign Geometry to line. But if you change to BufferGeometry, you lose geometry.vertices.
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
  geometry.vertices[1] = new THREE.Vector3(pointer.x, pointer.y, 0);
  endx[temp] = pointer.x;
  endy[temp] = pointer.y;

  if (trigger === '1') {
    let px = Calculate.lineLength(startx[temp], starty[temp], endx[temp], endy[temp]).toFixed(2);
    const textGeometry = new THREE.TextGeometry(`Length ${px}`, { size: 0.2 });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(endx[temp], endy[temp], 0);
    group.add(text);
  }

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
document.getElementById('selec').addEventListener('click',

 function () {
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
```

<br>
Please note that the above code is just a basic conversion, and you might need to adjust it further based on your specific requirements.

## Geometry requires position attribute

I'm getting an error on mousemove.  `THREE.Geometry.fromBufferGeometry()`: **Position attribute required for conversion.**

The error message indicates that the `THREE.Geometry` class requires a `position` attribute for the conversion from `THREE.BufferGeometry`. To resolve this issue, you can use `THREE.BufferGeometry` instead of `THREE.Geometry` to create the line geometry.

```javascript
const geometry = new THREE.BufferGeometry();const positions = [];//...function onMouseDown(event) {  let pointer = getPointer(event);  if (trigger === '1') {    //...    positions.push(pointer.x, pointer.y, 0);    geometry.setDrawRange(0, positions.length / 3);    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));    //...  } else {    group.children.forEach(obj => {      obj.geometry.attributes.position.needsUpdate = true;      //...    });  }}function onMouseMove(event) {  //...  positions[positions.length - 3] = pointer.x;  positions[positions.length - 2] = pointer.y;  //...}
```

This updated code should resolve the `THREE.Geometry.fromBufferGeometry()` error.

<span style="color:red;font-weight:bold;">It might've fixed the first error!  But it looks like there's a 2nd place that needs fixing...</span>

## Font error

Plus, I have a new error:

`THREE.TextGeometry`: font parameter is not an instance of THREE.Font.

Right.  Because we got past the 1st hurdle.

Before I went on a wild goose chase trying to fix this one, I switched the version to 146 or whatever.

What happens &ndash; a stupid white box again.

<span style="color:#0000dd;">onmousedown, i get a square on the screen where i clicked.  I should be drawing a line; not a square.  any ideas?</span>

The issue is occurring because the `onMouseDown` function is creating a new `THREE.Line` object every time you click the mouse, resulting in **separate line segments** instead of a continuous line. To fix this, you can modify the code to create a single line and update its vertices dynamically as the user drags the mouse. Here's the updated code:

```javascript
import * as THREE from '../build/three.module.js';
let line;
let isDrawing = false;
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
const geometry = new THREE.BufferGeometry();
const positions = [];

// Create a group to hold the line and text
const group = new THREE.Group();
scene.add(group);

// Event listener for mouse down
function onMouseDown(event) {
  let pointer = getPointer(event);
  if (trigger === '1') {
    isDrawing = true;
    startx[temp] = pointer.x;
    starty[temp] = pointer.y;
  } else {
    // Update object coordinates
    group.children.forEach(obj => {
      obj.geometry.attributes.position.needsUpdate = true;
      obj.geometry.computeBoundingSphere();
    });
  }
}

// Event listener for mouse move
function onMouseMove(event) {
  if (!isDrawing) return;
  scene.remove(line);
  scene.remove(text);
  renderer.render(scene, camera);
  let pointer = getPointer(event);
  endx[temp] = pointer.x;
  endy[temp] = pointer.y;

  if (trigger === '1') {
    let px = Calculate.lineLength(startx[temp], starty[temp], endx[temp], endy[temp]).toFixed(2);
    const textGeometry = new THREE.TextGeometry(`Length ${px}`, { size: 0.2 });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.set(endx[temp], endy[temp], 0);
    group.add(text);
  }

  positions[0] = startx[temp];
  positions[1] = starty[temp];
  positions[3] = endx[temp];
  positions[4] = endy[temp];

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  line = new THREE.Line(geometry, material);
  scene.add(line);
  renderer.render(scene, camera);
}

// Event listener for mouse up
function onMouseUp(event) {
  isDrawing = false;
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
```

<br>
This updated code should allow you to draw a continuous line on the canvas as you drag the mouse, instead of creating separate line segments.

## Start over?

So in 124, you still get THREE.TextGeometry: font parameter is not an instance of THREE.Font, and THREE.Geometry.fromBufferGeometry(): Position attribute required for conversion.  <mark>**Like I said!** Maybe the issue is occurring in 2 spots,</mark> and we just gotta fix the 2nd one.

<span style="color:#0000dd;">I still get the square, plus a new error.  I'm wondering if we should just go back to your original answer, and simply try to fix the error on mousemove - "Geometry.fromBufferGeometry(): Position attribute required for conversion."?</span>

I apologize for the inconvenience. If you prefer to go back to the original answer and address the error related to `THREE.Geometry.fromBufferGeometry()`, we can certainly do that. To fix the error, we need to ensure that the `position` attribute is set correctly in the geometry.

Here's the modified code that addresses the error on `mousemove` while using `THREE.Geometry`:

```javascript
import * as THREE from '../build/three.module.js';
let line;let isDown;let startx = [];let endx = [];let starty = [];let endy = [];let temp = 0;let trigger = '1';let text;// Set up Three.js sceneconst scene = new THREE.Scene();const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);camera.position.z = 5;const renderer = new THREE.WebGLRenderer({ antialias: true });renderer.setSize(window.innerWidth, window.innerHeight);document.body.appendChild(renderer.domElement);// Create a line materialconst material = new THREE.LineBasicMaterial({ color: 0x00ff00 });// TODO: Note, we're back to Geometryconst geometry = new THREE.Geometry();// Create a group to hold the line and textconst group = new THREE.Group();scene.add(group);// Event listener for mouse downfunction onMouseDown(event) {  let pointer = getPointer(event);  if (trigger === '1') {    isDown = true;    startx[temp] = pointer.x;    starty[temp] = pointer.y;    geometry.vertices.push(new THREE.Vector3(pointer.x, pointer.y, 0));    line = new THREE.Line(geometry, material);    group.add(line);  } else {    // Update object coordinates    group.children.forEach(obj => {      obj.geometry.verticesNeedUpdate = true;      obj.geometry.computeBoundingSphere();    });  }}// Event listener for mouse movefunction onMouseMove(event) {  if (!isDown) return;  scene.remove(text);  renderer.render(scene, camera);  let pointer = getPointer(event);  line.geometry.vertices[1].x = pointer.x;  line.geometry.vertices[1].y = pointer.y;  endx[temp] = pointer.x;  endy[temp] = pointer.y;  if (trigger === '1') {    let px = Calculate.lineLength(startx[temp], starty[temp], endx[temp], endy[temp]).toFixed(2);    const textGeometry = new THREE.TextGeometry(`Length ${px}`, { size: 0.2 });    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });    text = new THREE.Mesh(textGeometry, textMaterial);    text.position.set(endx[temp], endy[temp], 0);    group.add(text);  }  line.geometry.verticesNeedUpdate = true;  renderer.render(scene, camera);}// Event listener for mouse upfunction onMouseUp(event) {  isDown = false;}// Helper function to get normalized pointer coordinatesfunction getPointer(event) {  const rect = renderer.domElement.getBoundingClientRect();  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;  return { x, y };}// Event listeners for mouse actionsrenderer.domElement.addEventListener('mousedown', onMouseDown, false);renderer.domElement.addEventListener('mousemove', onMouseMove, false);renderer.domElement.addEventListener('mouseup', onMouseUp, false);// Function to calculate line lengthconst Calculate = {  lineLength(x1, y1, x2, y2) {    return Math.sqrt(Math.pow(x2 * 1 - x1 * 1, 2) + Math.pow(y2 * 1 - y1 * 1, 2));  },};// Toggle trigger valuedocument.getElementById('selec').addEventListener('click', function () {  if (trigger === '1') {    trigger = '0';  } else {    trigger = '1';  }});// Render loopfunction animate() {  requestAnimationFrame(animate);  renderer.render(scene, camera);}animate();
```

Please give this code a try. It should resolve the error related to `THREE.Geometry.fromBufferGeometry()` and allow you to draw a line instead of a square.

## Error

```js
// Uncaught TypeError: can't access property "x", line.geometry.vertices[1] is undefined
line.geometry.vertices[1].x = pointer.x;
line.geometry.vertices[1].y = pointer.y;
```

<br>
OK, no problem.  But the IDE is saying again: "Argument type Geometry is not assignable to parameter type BufferGeometry".

```js
line = new THREE.Line(geometry, material);
```

### Fixed with:

```js
// line.geometry.vertices[1].x = pointer.x;
// line.geometry.vertices[1].y = pointer.y;
geometry.vertices[1] = new THREE.Vector3(pointer.x, pointer.y, 0);
// geometry.vertices.push({"x": pointer.x, "y": pointer.y, "z": 0});
```

### Errors:

* THREE.TextGeometry: font parameter is not an instance of THREE.Font.
* THREE.Geometry.fromBufferGeometry(): Position attribute required for conversion.

<br>

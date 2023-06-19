## Editable Polygon

Is there a way to create an editable polygon in three.js?  Like, create a polygon with a few little round "handles" along the line, and allow the user to click the handles and drag them such that they can reshape the polygon?

Yes, it is possible to create an editable polygon in Three.js by implementing a user interface that allows users to interact with the polygon's vertices and reshape it. Here's a general outline of how you can achieve this:

1. Create the initial polygon:
   - Define an array of vertices that form the initial polygon shape.
   - Use the `THREE.Geometry()` class or the `THREE.BufferGeometry()` class to create a geometry object from the vertices.
   - Create a material using `THREE.MeshBasicMaterial()` or `THREE.MeshPhongMaterial()`.
   - Create a mesh by combining the geometry and material using `THREE.Mesh()`.

2. Add draggable handles:
   - For each vertex of the polygon, create a small sphere or another suitable shape using `THREE.Mesh()` or `THREE.Points()`.
   - Position each handle at the corresponding vertex position of the polygon.
   - Attach event listeners to handle user interaction, such as `mousedown`, `mousemove`, and `mouseup` or touch events like `touchstart`, `touchmove`, and `touchend`.
   - Implement the logic to handle dragging and updating the position of the handles and polygon vertices in response to user input.

3. Update the polygon shape:
   - When a handle is dragged, update its position based on user input.
   - Recalculate the new positions of the polygon vertices based on the updated handle positions.
   - Update the geometry of the polygon with the new vertex positions using the `geometry.vertices` array.
   - Call `geometry.verticesNeedUpdate = true` to notify Three.js that the geometry has changed and needs to be updated.

Here's a simplified example code snippet that demonstrates the basic concept:

```javascript
// Create initial polygon vertices
const initialVertices = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(1, 1, 0),
];

// Create geometry
const geometry = new THREE.Geometry();
geometry.vertices = initialVertices;

// Create material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create mesh
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);

// Create handles for each vertex
const handles = [];
for (let i = 0; i < initialVertices.length; i++) {
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.copy(initialVertices[i]);
  handles.push(handleMesh);

  // Add event listeners for dragging
  handleMesh.addEventListener('mousedown', onMouseDown);
  handleMesh.addEventListener('mousemove', onMouseMove);
  handleMesh.addEventListener('mouseup', onMouseUp);
}

// Function to handle dragging
function onMouseDown(event) {
  // Set a flag or store the handle as active
}

function onMouseMove(event) {
  // If a handle is active, update its position based on mouse movement
  // Recalculate the new polygon vertices and update the geometry
}

function onMouseUp(event) {
  // Clear the active handle flag or remove reference to the active handle
}

// Add handles to the scene
handles.forEach(element => scene.add(element));

// Implement the logic to update the polygon shape when handles are dragged
// Update the geometry.vertices array with the new positions and set verticesNeedUpdate to true

// Render the scene
```

This code provides a basic structure for creating an editable polygon in Three.js. You'll need to adapt it to suit your specific requirements and add additional functionality as needed.

## Version

Certainly! Here's an updated example using Three.js version r143, which utilizes `THREE.BufferGeometry` and `THREE.BufferAttribute` instead of the older `THREE.Geometry`:

```javascript
// Create initial polygon vertices
const initialVertices = [
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
];

// Create geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialVertices, 3));

// Create material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create mesh
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);

// Create handles for each vertex
const handles = [];
for (let i = 0; i < initialVertices.length; i += 3) {
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.fromArray(initialVertices.slice(i, i + 3));
  handles.push(handleMesh);

  // Add event listeners for dragging
  handleMesh.addEventListener('mousedown', onMouseDown);
  handleMesh.addEventListener('mousemove', onMouseMove);
  handleMesh.addEventListener('mouseup', onMouseUp);
}

// Function to handle dragging
let activeHandle = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseDown(event) {
  event.preventDefault();
  activeHandle = event.target;
  const index = handles.indexOf(activeHandle);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(mesh);
  if (intersects.length > 0) {
    const position = intersects[0].point;
    geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
    geometry.attributes.position.needsUpdate = true;
  }
}

function onMouseMove(event) {
  event.preventDefault();
  if (activeHandle) {
    const index = handles.indexOf(activeHandle);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      const position = intersects[0].point;
      geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
      geometry.attributes.position.needsUpdate = true;
    }
  }
}

function onMouseUp(event) {
  event.preventDefault();
  activeHandle = null;
}

// Add handles to the scene
handles.forEach(element => scene.add(element));

// Render the scene
```

In this updated example, we use `THREE.BufferGeometry` and `THREE.BufferAttribute` to manage the polygon's vertex positions. The `geometry.setAttribute('position', ...)` method sets up the initial vertex positions. When a handle is dragged, the `onMouseDown` and `onMouseMove` functions update the position of the corresponding vertex in the buffer attribute, and `geometry.attributes.position.needsUpdate = true` notifies Three.js to update the geometry.

Remember to adapt the code to your specific implementation, including setting up a camera, scene, and rendering loop if they are not already present in your application.

## Drag

I apologize for the oversight. The example I provided doesn't include the necessary code to handle mouse events correctly for dragging the handles. Here's an updated version that should address the issue:

```javascript
// Create initial polygon vertices
const initialVertices = [
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
];

// Create geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialVertices, 3));

// Create material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create mesh
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);

// Create handles for each vertex
const handles = [];
for (let i = 0; i < initialVertices.length; i += 3) {
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.fromArray(initialVertices.slice(i, i + 3));
  handles.push(handleMesh);

  // Add event listeners for dragging
  handleMesh.addEventListener('pointerdown', onPointerDown);
  handleMesh.addEventListener('pointermove', onPointerMove);
  handleMesh.addEventListener('pointerup', onPointerUp);

  handleMesh.cursor = 'move';
  handleMesh.userData.index = i / 3;
}

// Function to handle dragging
let activeHandle = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(event) {
  event.preventDefault();
  activeHandle = event.target;
  activeHandle.material.color.set(0xffff00);
}

function onPointerMove(event) {
  event.preventDefault();
  if (activeHandle) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      const position = intersects[0].point;
      const index = activeHandle.userData.index;
      geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
      geometry.attributes.position.needsUpdate = true;
    }
  }
}

function onPointerUp(event) {
  event.preventDefault();
  activeHandle.material.color.set(0xff0000);
  activeHandle = null;
}

// Add handles to the scene
handles.forEach(element => scene.add(element));

// Render the scene
```

This updated code should enable you to drag the handles to reshape the polygon. It uses the `pointerdown`, `pointermove`, and `pointerup` events for mouse interaction, and it properly updates the vertex positions based on the mouse movement.

Make sure to adjust the code as needed to fit into your existing Three.js setup, including setting up a camera, scene, and render loop.

## Event handlers

I apologize for the confusion. The issue seems to be related to the event listeners not being triggered properly on the handles. This might occur if you're using an older version of Three.js that doesn't support pointer events.

To address this, you can switch to using mouse events instead. Here's an updated version of your code that uses mouse events:

```javascript
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create initial polygon vertices
const initialVertices = [
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
];

// Create geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialVertices, 3));

// Create material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create mesh
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);

// Create handles for each vertex
const handles = [];
for (let i = 0; i < initialVertices.length; i += 3) {
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000
  });
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.fromArray(initialVertices.slice(i, i + 3));
  handles.push(handleMesh);

  // Add event listeners for dragging
  handleMesh.addEventListener('mousedown', onPointerDown);
  handleMesh.addEventListener('mousemove', onPointerMove);
  handleMesh.addEventListener('mouseup', onPointerUp);

  handleMesh.cursor = 'move';
  handleMesh.userData.index = i / 3;
}

// Function to handle dragging
let activeHandle = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(event) {
  event.preventDefault();
  console.log("onPointerDown");
  activeHandle = event.target;
  activeHandle.material.color.set(0xffff00);

  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mouseup', onPointerUp);
}

function onPointerMove(event) {
  event.preventDefault();
  console.log("onPointerMove");
  if (activeHandle) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      const position = intersects[0].point;
      const index = activeHandle.userData.index;
      geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
      geometry.attributes.position.needsUpdate = true;
    }
  }
}

function onPointerUp(event) {
  event.preventDefault();
  console.log("onPointerUp");
  activeHandle.material.color.set(0xff0000);
  activeHandle = null;

  document.removeEventListener('mousemove', onPointerMove);
  document.removeEventListener('mouseup', onPointerUp);
}

// Add handles to the scene
handles.forEach(element => scene.add(element));

window.addEventListener("resize", function() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

// Render the scene
(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();
```

This code should work with mouse events and allow you to drag the handles to reshape the polygon. Please give it a try and let me know if you encounter any further issues.

<br>

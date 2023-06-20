## Note to Self

If event handlers are not firing, see if there's a controls thing in THREE that handles what you want. Example: DragControls.

## Editable Polygon

Is there a way to create an editable polygon?  Like, create a polygon with a few little round "handles" along the line, and allow the user to click the handles and drag them such that they can reshape the polygon?

Yes, it is possible to create an editable polygon in Three.js by implementing a user interface that allows users to interact with the polygon's vertices and reshape it.

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

## DragControls

Mouse events not working!  Use DragControls.  Duh!

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
  1, 1, 0
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
}

// Add handles to the scene
handles.forEach(element => scene.add(element));

// Create DragControls
const dragControls = new THREE.DragControls(handles, camera, renderer.domElement);

// Function to handle dragging start
dragControls.addEventListener('dragstart', function (event) {
  console.log('Drag start');
  event.object.material.color.set(0xffff00);
});

// Function to handle dragging end
dragControls.addEventListener('dragend', function (event) {
  console.log('Drag end');
  event.object.material.color.set(0xff0000);
});

// Function to handle dragging
dragControls.addEventListener('drag', function (event) {
  const position = event.object.position;
  const index = handles.indexOf(event.object);
  geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
  geometry.attributes.position.needsUpdate = true;
});

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

In this updated version, we use the `THREE.DragControls` utility to handle the dragging of the handles.

The `dragControls.addEventListener('dragstart', ...)` and `dragControls.addEventListener('dragend', ...)` functions are used to set the color of the handle when dragging starts and ends.

The `dragControls.addEventListener('drag', ...)` function is responsible for updating the position of the corresponding vertex in the geometry when a handle is dragged.

<br>

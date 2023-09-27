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

editable-polygon/editable-polygon.html

```javascript
// Create geometry
// Create handles for each vertex

// Create DragControls
const dragControls = new THREE.DragControls(handles, camera, renderer.domElement);

// Create functions to handle dragging
dragControls.addEventListener('drag', function (event) {
  const position = event.object.position;
  const index = handles.indexOf(event.object);
  geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
  geometry.attributes.position.needsUpdate = true;
});
```

In this updated version, we use the `THREE.DragControls` utility to handle the dragging of the handles.

The `dragControls.addEventListener('dragstart', ...)` and `dragControls.addEventListener('dragend', ...)` functions are used to set the color of the handle when dragging starts and ends.

The `dragControls.addEventListener('drag', ...)` function is responsible for updating the position of the corresponding vertex in the geometry when a handle is dragged.

<br>

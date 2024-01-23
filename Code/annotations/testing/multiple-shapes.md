## Multiple shapes

The key change is the addition of a function to create and add a new mesh for each shape, instead of updating the vertices of a single mesh.

To modify your code to allow for the creation of multiple shapes, you need to adapt the logic for handling the drawing and storing of each shape. Each time a new shape is drawn, instead of updating the vertices of a single mesh, you should create a new mesh for that shape and add it to the scene. This way, previously drawn shapes will remain visible.

Here are the necessary modifications:

1. **Create a function to add a new mesh**: This function will create a new mesh for each shape and add it to the scene.

2. **Update event handlers**: Modify the `onMouseUp` and `onDoubleClick` event handlers to use this new function.

3. **Manage multiple meshes**: Keep track of all the meshes you create so you can manage them separately.

[testing.html](testing.html)

Here's how you can implement these changes in your code:

```javascript
export function polygons(scene, camera, renderer, controls) {
  // ... [Other initializations]

  // Array to store all meshes
  let allMeshes = [];

  // Create a new mesh and add it to the scene
  function addMesh(geometry, material) {
    let newMesh = new THREE.LineLoop(geometry, material);
    newMesh.renderOrder = 999;
    scene.add(newMesh);
    allMeshes.push(newMesh); // Store the mesh
  }

  // Rest of your initializations...
  // ...

  // Modify the onMouseUp and onDoubleClick event handlers
  function onMouseUp(event) {
    if (typeOfShape !== "polygon") {
      isDrawing = false;
    }

    endPoint = getMousePosition(event.clientX, event.clientY);
    points.push(endPoint);

    // Instead of updating, create a new mesh
    if (typeOfShape !== "polygon") {
      let newGeometry = new THREE.BufferGeometry();
      newGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      addMesh(newGeometry, material);
      points = [];
    }
  }

  function onDoubleClick(event) {
    if (typeOfShape === "polygon") {
      if (isDrawing && points.length >= 3) {
        isDrawing = false;
        points.pop(); // Remove the duplicated point from double-click
        updatePolygon();
        let newGeometry = new THREE.BufferGeometry();
        newGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        addMesh(newGeometry, material);
        points = [];
        positions = []; // Reset for next time
      }
    }
  }

  // Rest of your functions...
  // ...

  // The update functions should now only update the vertices
  // and not add the mesh to the scene. The addMesh function takes care of that.
}
```

With these changes, each time a new shape is drawn, it creates a new mesh and adds it to the scene. This allows all drawn shapes to persist. The `allMeshes` array can be used to manage these meshes later if needed, for example, to remove them from the scene or to apply transformations.

## All the code

Certainly! I'll provide you with a complete and modified version of your code to allow for the creation and management of multiple shapes (rectangles, ellipses, and polygons). The key change is the addition of a function to create and add a new mesh for each shape, instead of updating the vertices of a single mesh.

In this code:

- A new mesh is created and added to the scene each time the user finishes drawing a shape.
- Event listeners are added and removed based on the drawing mode.
- The `updateMesh` function updates the vertices array based on the shape being drawn.
- The `addMesh` function adds a new mesh to the scene with the given geometry and material.

This setup allows you to draw multiple shapes of different types, and they will all persist on the scene. Remember to fill in the parts of the code related to vertex calculations for rectangles and ellipses, as well as the `getMousePosition` function, similar to your original implementation.

<span style="color:blue;font-size:larger;">I used to be able to see the shape as I draw it.  Now it only shows up on mouseup.</span>

To ensure that the shape is visible as it's being drawn, you need to update the approach slightly. The issue with the current implementation is that it creates a new mesh only on `mouseup` or `dblclick`, which means you don't see the shape while drawing it. To resolve this, you can follow these steps:

1. **Create a temporary mesh for drawing**: When you start drawing a shape, create a temporary mesh that will be updated as you draw. This mesh is what you'll see while drawing.

2. **Replace the temporary mesh with a permanent one on completion**: When the drawing is complete (on `mouseup` for rectangles and ellipses, and on `dblclick` for polygons), replace this temporary mesh with a permanent one and add it to the `allMeshes` array.

3. **Update `onMouseMove`**: Ensure `onMouseMove` continually updates the temporary mesh as you draw.

In this revised code:

- `startDrawing` creates a temporary mesh for drawing.
- `updateMesh` now takes a geometry as a parameter and updates it as you move the mouse.
- `completeDrawing` replaces the temporary mesh with a permanent one when you finish drawing.

This approach allows the shape to be visible as it's being drawn and keeps the drawn shapes on the screen.

This version will include the necessary adjustments to ensure that the shape is visible as it's being drawn and that it persists after completion.

This complete code now includes the logic for drawing and displaying shapes in real-time as they are being created, and then finalizing them as permanent shapes on the canvas. Make sure to add the specific calculations for updating vertices in the `updateRectangle` and `updateEllipse` functions as per your original logic. Also, ensure that `getMousePosition` is implemented as in your original code to correctly calculate the mouse position.

<span style="color:blue;font-size:larger;">How do I update the vertices of the passed geometry for ellipse?</span>

Updating the vertices of the passed geometry for an ellipse involves calculating the positions of a series of points around the ellipse's perimeter. The ellipse can be defined by its center, horizontal radius, and vertical radius. Here's how you can implement the `updateEllipse` function to update the vertices of the passed geometry for an ellipse:

1. **Calculate the Center and Radii**: Compute the center of the ellipse and its horizontal and vertical radii based on the `startPoint` and `endPoint`.

2. **Loop through Segments**: Iterate through a number of segments (this defines the smoothness of the ellipse) and calculate the position of each point on the ellipse.

3. **Set Vertex Positions**: Update the positions of the vertices in the geometry.

Here's the implementation of the `updateEllipse` function:

```javascript
const updateEllipse = function (geometry) {
    // Center of the ellipse
    let centerX = (startPoint.x + endPoint.x) / 2;
    let centerY = (startPoint.y + endPoint.y) / 2;
    let centerZ = (startPoint.z + endPoint.z) / 2;

    // Radii of the ellipse
    let radiusX = Math.abs(endPoint.x - startPoint.x) / 2;
    let radiusY = Math.abs(endPoint.y - startPoint.y) / 2;

    // Number of segments
    const segments = 64; // More segments make the ellipse smoother
    let angleIncrement = Math.PI * 2 / segments;

    // Create or update the array of vertices
    vertices = new Float32Array((segments + 1) * 3);

    // Calculate positions of vertices around the ellipse
    for (let i = 0; i <= segments; i++) {
        let angle = angleIncrement * i;
        let x = centerX + radiusX * Math.cos(angle);
        let y = centerY + radiusY * Math.sin(angle);
        let z = centerZ; // Ellipse is in 2D plane, so z is constant

        vertices[i * 3] = x;
        vertices[i * 3 + 1] = y;
        vertices[i * 3 + 2] = z;
    }

    // Update the geometry with the new vertices
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.attributes.position.needsUpdate = true;
};
```

This function should replace the placeholder for `updateEllipse` in the code I provided earlier. It calculates the ellipse by plotting points around its circumference based on the calculated center and radii. The number of segments determines the smoothness of the ellipse; a higher number of segments results in a smoother ellipse but requires more computation.

### you were right

No problem at all! Yes, the original `updateEllipse` function creates a new `Float32Array` for the vertices and sets it as the `position` attribute of the passed `geometry`. This is a correct approach, especially if the number of vertices might change between updates (like in the case of dynamically changing the number of segments).

The function calculates the positions of the vertices around the ellipse's perimeter, creates a new `Float32Array` for these vertices, and updates the geometry's `position` attribute with this array. After updating the vertices, it flags the attribute for an update with `geometry.attributes.position.needsUpdate = true`, which is necessary for Three.js to recognize and render the changes.

If you need further assistance or modifications, feel free to ask!

## Update Rectangle and Polygon

Certainly! The `updateRectangle` and `updatePolygon` functions are responsible for updating the vertices of the geometry for a rectangle and a polygon, respectively. Let's define these functions:

### `updateRectangle` Function

This function will update the vertices to form a rectangle. The rectangle is defined by two points: `startPoint` and `endPoint`. These points become opposite corners of the rectangle.

```javascript
const updateRectangle = function (geometry) {
    let positions = [
        startPoint.x, startPoint.y, startPoint.z,  // First corner
        endPoint.x, startPoint.y, startPoint.z,    // Second corner
        endPoint.x, endPoint.y, startPoint.z,      // Third corner
        startPoint.x, endPoint.y, startPoint.z     // Fourth corner
    ];

    // Close the rectangle by repeating the first point
    positions.push(startPoint.x, startPoint.y, startPoint.z);

    // Convert positions to a Float32Array
    let vertices = new Float32Array(positions);

    // Update the geometry
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.attributes.position.needsUpdate = true;
};
```

### `updatePolygon` Function

This function will update the vertices based on the array `points`, which contains the vertices of the polygon. The polygon is completed by connecting the last point back to the first point.

```javascript
const updatePolygon = function (geometry) {
    let positions = [];

    // Loop through each point in the points array
    for (let i = 0; i < points.length; i++) {
        positions.push(points[i].x, points[i].y, points[i].z);
    }

    // Close the polygon by connecting to the first point
    if (points.length > 0) {
        positions.push(points[0].x, points[0].y, points[0].z);
    }

    // Convert positions to a Float32Array
    let vertices = new Float32Array(positions);

    // Update the geometry
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.attributes.position.needsUpdate = true;
};
```

These functions should be used in your existing code to update the geometry of the respective shapes. They modify the `position` attribute of the passed `geometry` with the new set of vertices calculated based on the current state of `startPoint`, `endPoint`, and `points`.

<span style="color:blue;font-size:larger;">That didn't work. bar.js</span>

<br>

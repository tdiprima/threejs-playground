## Edit Polygon

<span style="color:blue;font-size:larger;">Can we allow further editing of the polygon by allowing the user to click a corner, or a point, and drag it to another location?</span>

Allowing users to edit a polygon by dragging its vertices to new locations is a great feature for enhancing interactivity and flexibility in your application. Implementing this functionality involves detecting a click near a vertex, enabling drag operations for that vertex, and updating the polygon's geometry based on the vertex's new position. Here's a high-level approach on how to achieve this in Three.js:

### Steps to Implement Vertex Editing

1. **Detect Clicks Near Vertices**: When the user clicks on the canvas, you need to determine if the click is near a vertex of the currently selected polygon. This can be done using raycasting to check for intersections with a small invisible sphere around each vertex or by calculating the distance between the click position and each vertex.

2. **Enable Dragging for a Selected Vertex**: Once a vertex is selected, you need to track mouse movements and update the vertex's position accordingly. This involves capturing `mousemove` events and recalculating the vertex's position based on the mouse's new location.

3. **Update the Polygon Geometry**: As the vertex is dragged, update the polygon's geometry to reflect the changes. This requires updating the positions in the geometry's `position` attribute and marking it for update.

4. **Finalize Vertex Position**: When the user releases the mouse button (`mouseup` event), finalize the vertex's new position and update the polygon geometry accordingly.

### Sample Code Outline

Below is a simplified code outline to help you get started with the implementation:

```javascript
let selectedVertexIndex = null;
let isVertexSelected = false;

function onMouseDown(event) {
    // Determine if the click is near a vertex
    let point = getMousePosition(event.clientX, event.clientY, canvas, camera);
    const nearestVertex = findNearestVertex(point);
    if (nearestVertex.distance <= someThresholdDistance) {
        isVertexSelected = true;
        selectedVertexIndex = nearestVertex.index;
        document.addEventListener('mousemove', onVertexDrag, false);
        document.addEventListener('mouseup', onVertexDragEnd, false);
    }
}

function onVertexDrag(event) {
    if (!isVertexSelected || selectedVertexIndex === null) return;
    let newPoint = getMousePosition(event.clientX, event.clientY, canvas, camera);
    // Update the selected vertex position
    points[selectedVertexIndex] = newPoint;
    updatePolygon(); // Update the polygon with the new vertex position
}

function onVertexDragEnd(event) {
    isVertexSelected = false;
    selectedVertexIndex = null;
    document.removeEventListener('mousemove', onVertexDrag, false);
    document.removeEventListener('mouseup', onVertexDragEnd, false);
}

function findNearestVertex(point) {
    // Implement logic to find the nearest vertex to the point
    // This should return the index of the nearest vertex and the distance
    let nearestIndex = -1;
    let nearestDistance = Infinity;
    points.forEach((vertex, index) => {
        let distance = calculateDistance(point, vertex); // Implement calculateDistance
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestIndex = index;
        }
    });
    return { index: nearestIndex, distance: nearestDistance };
}

// Ensure you have logic to calculate distance between two points
function calculateDistance(point1, point2) {
    // Simple 2D distance calculation or 3D if you're working in three dimensions
}
```

### Considerations

- **Raycasting for Vertex Selection**: If your vertices are not visually represented by objects (e.g., spheres or dots), you might want to use invisible spheres for raycasting to detect clicks near vertices.
- **Threshold Distance**: Define a sensible threshold distance for how close a click must be to a vertex to consider it selected. This might depend on your application's scale and the user's expected precision.
- **Mouse Position Conversion**: The function `getMousePosition` should correctly translate the mouse's screen position to the coordinate system of your Three.js scene.
- **Event Listeners**: This example adds and removes event listeners for dragging. Ensure these are appropriately managed to prevent memory leaks or unintended behavior.

This outline gives you a starting point. You may need to adjust details based on your application's specifics, such as whether you're working in 2D or 3D space and how you're managing the scene and rendering loop.

## Draggable Polygon Vertex Update

<span style="color:blue;font-size:larger;">Close, but it makes the polygon weird sometimes, and I can't create a 2nd polygon. Handle-less.</span>

To enable vertex updating when a user clicks and drags near a vertex, we'll need to modify your existing code to include functionality for detecting a click close to a vertex, initiating a drag operation to move the vertex, and updating the vertex position as the user drags it. Here's a step-by-step guide on how to achieve this:

1. **Detect Clicks Near Vertices**: Modify the `onMouseDown` function to check if the click was near any existing vertex. If it was, store the index of that vertex for updating.

2. **Implement Dragging**: Allow the user to drag the selected vertex. This will involve tracking mouse movements while the mouse button is pressed and updating the position of the selected vertex.

3. **Update Vertex Position**: During the drag operation, continuously update the position of the selected vertex in the `points` array and update the polygon display to reflect this change.

4. **Finalize the Update**: On mouse release (`onMouseUp`), finalize the position of the dragged vertex and update the polygon's geometry.

Here's how you can incorporate these steps into your code:

```javascript
export function polygon(scene, camera, renderer, controls) {
  // ...existing code...

  let draggingVertexIndex = null; // Index of the vertex being dragged

  function onMouseMove(event) {
    if (!isDrawing) return;

    // Dragging mode: if a vertex is being dragged, update its position
    if (mouseIsPressed && draggingVertexIndex !== null) {
      const point = getMousePosition(event.clientX, event.clientY, canvas, camera);
      points[draggingVertexIndex] = point; // Update the position of the dragged vertex
      updatePolygon();
    }
    // Drawing mode: update the last point position for new polygon drawing
    else if (mouseIsPressed && draggingVertexIndex === null && points.length > 0) {
      const point = getMousePosition(event.clientX, event.clientY, canvas, camera);
      points[points.length - 1] = point;
      updatePolygon();
    }
  }

  function onMouseDown(event) {
    if (!isDrawing) return;

    const point = getMousePosition(event.clientX, event.clientY, canvas, camera);
    // Check if the click is near an existing vertex for dragging
    const nearVertexIndex = findNearVertex(point, points);
    if (nearVertexIndex !== -1) {
      // Start dragging this vertex
      draggingVertexIndex = nearVertexIndex;
      mouseIsPressed = true;
    }
    // Start a new polygon or add a new vertex if not near an existing vertex
    else if (!mouseIsPressed) {
      mouseIsPressed = true;
      if (draggingVertexIndex === null) {
        points.push(point);
        if (!currentPolygon) {
          currentPolygon = createPolygon();
        }
      }
    }
  }

  function onMouseUp(event) {
    // Finalize dragging or adding a new vertex
    mouseIsPressed = false;
    if (draggingVertexIndex !== null) {
      // Finalize vertex position after dragging
      draggingVertexIndex = null;
    } else if (isDrawing) {
      // Add vertex on mouse up if not dragging
      updatePolygon();
    }
  }

  // Add a function to find a vertex near the click point
  function findNearVertex(point, vertices) {
    const threshold = 10; // Distance threshold to consider 'near'
    for (let i = 0; i < vertices.length; i++) {
      if (distanceBetween(point, vertices[i]) < threshold) {
        return i; // Return index of the near vertex
      }
    }
    return -1; // Return -1 if no vertex is near
  }

  // Calculate distance between two points (considering 3D space if necessary)
  function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) + Math.pow(point1.z - point2.z, 2));
  }

  // ...remaining existing code...
}
```

This updated code introduces the capability to click and drag a vertex to a new position. Here's a breakdown of the changes:

- **Dragging Vertex**: Added logic to track whether the user is dragging a vertex and which vertex is being dragged.
- **Vertex Position Update**: While dragging, continuously update the vertex's position in the `points` array and refresh the polygon display.
- **Finalize Drag**: Once the mouse button is released, finalize the position of the dragged vertex.

Make sure to adjust the `threshold` value in `findNearVertex` to suit your application's scale and sensitivity. This value determines how close a click must be to a vertex to start dragging it.

<br>

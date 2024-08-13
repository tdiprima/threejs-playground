## Original

```js
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  event.preventDefault();

  // Calculate the distance from the camera to a target point (e.g., the center of the scene)
  const distance = camera.position.distanceTo(scene.position);
  let size = calculateThreshold(distance, 3, 100); // Set size of edit handles based on zoom

  // Get the canvas element and its bounding rectangle
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  try {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(intersectableObjects);

    if (intersects.length > 0) {
      const selectedMesh = intersects[0].object;

      // Setup deletion button & edit handles
      setupDeletionButton(selectedMesh, addEditHandles(selectedMesh, size));
    }
  } catch (error) {
    console.error("Intersection error:", error);
  }
}
```

## Polygon Selection Improvement

To enable selecting the polygon by clicking inside it or near its edges, you can use the following approach:

1. **Raycasting Inside the Polygon:** Instead of just checking for intersections with the lines of the polygon, you can also check if the mouse click occurs inside the polygon. This can be done by using a method like `THREE.Shape.containsPoint` or by manually calculating if a point is inside the polygon using a 2D point-in-polygon algorithm.

2. **Raycasting Near the Edges:** Increase the tolerance for line selection by expanding the raycasting to consider a wider area around the line.

Here's how you can modify your code:

### Step 1: Modify the Raycaster to Check for Points Inside the Polygon
You'll need to define the polygons as shapes and check if the clicked point lies inside them. Here's how you can implement it:

<span style="color:lime;font-size:larger;">#2 expand raycasting worked better.</span>

```javascript
function onMouseClick(event) {
    event.preventDefault();

    // Calculate the distance from the camera to a target point (e.g., the center of the scene)
    const distance = camera.position.distanceTo(scene.position);
    let size = calculateThreshold(distance, 3, 100); // Set size of edit handles based on zoom

    // Get the canvas element and its bounding rectangle
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // First, check if the mouse intersects any line objects
    const intersects = raycaster.intersectObjects(intersectableObjects);

    if (intersects.length > 0) {
        const selectedMesh = intersects[0].object;
        setupDeletionButton(selectedMesh, addEditHandles(selectedMesh, size));
        return;
    }

    // If no line intersections, check if the point is inside any polygons
    for (let i = 0; i < intersectableObjects.length; i++) {
        const mesh = intersectableObjects[i];
        const geometry = mesh.geometry;
        
        // Convert the mouse position to a point in world space
        const point = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
        
        // Create a shape from the polygon vertices
        const vertices = geometry.attributes.position.array;
        const shape = new THREE.Shape();
        for (let j = 0; j < vertices.length; j += 3) {
            const x = vertices[j];
            const y = vertices[j + 1];
            if (j === 0) {
                shape.moveTo(x, y);
            } else {
                shape.lineTo(x, y);
            }
        }
        shape.lineTo(vertices[0], vertices[1]); // Close the shape

        if (shape.containsPoint(new THREE.Vector2(point.x, point.y))) {
            // Point is inside the polygon
            setupDeletionButton(mesh, addEditHandles(mesh, size));
            return;
        }
    }
}
```

### Step 2: Expand Raycasting Near the Edges
To increase the tolerance for line selection, you can modify the raycaster or create a bounding box around the line geometry and check for intersections within that box. Here's how you can increase the tolerance by expanding the bounding box:

```javascript
function expandBoundingBox(geometry, amount) {
    const box = new THREE.Box3().setFromObject(geometry);
    box.expandByScalar(amount);
    return box;
}

function onMouseClick(event) {
    event.preventDefault();

    // Calculate the distance from the camera to a target point (e.g., the center of the scene)
    const distance = camera.position.distanceTo(scene.position);
    let size = calculateThreshold(distance, 3, 100); // Set size of edit handles based on zoom

    // Get the canvas element and its bounding rectangle
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    const intersects = [];
    for (let i = 0; i < intersectableObjects.length; i++) {
        const mesh = intersectableObjects[i];
        const expandedBox = expandBoundingBox(mesh, 0.1); // Increase tolerance by 0.1
        if (raycaster.ray.intersectsBox(expandedBox)) {
            intersects.push(mesh);
        }
    }

    if (intersects.length > 0) {
        const selectedMesh = intersects[0];
        setupDeletionButton(selectedMesh, addEditHandles(selectedMesh, size));
        return;
    }

    // The rest of the polygon selection code remains the same
}
```

This code increases the chance of selecting the polygon either by clicking directly inside it or by clicking near its edges. Adjust the `expandBoundingBox` value and `containsPoint` logic to fit your application's needs.

<br>

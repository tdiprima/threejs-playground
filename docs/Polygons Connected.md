The issue you are experiencing where lines are being connected from one polygon to another is due to the fact that you are storing all the positions for all the polygons in a single array (`positions`). This array is being **continuously updated** (well, yeah...) as you draw, and all the polygons share this array as their attribute for position data.

To fix this issue, you need to create separate arrays for each polygon's position data. Here's how you can modify your code to achieve that:

1. Declare a new array to store the positions for each polygon:

    ```javascript
    let polygonPositions = [];
    ```

2. Modify the event listeners for mouse events to keep track of the current polygon being drawn:

```javascript
let currentPolygonPositions = []; // Declare a variable to store positions for the current polygon
let polygonPositions = []; // Declare an array to store positions for each polygon

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new BufferAttribute for each line
    let bufferGeometry = new THREE.BufferGeometry();
    line = new THREE.Line(bufferGeometry, lineMaterial);
    scene.add(line);

    currentPolygonPositions = []; // Start a new array for the current polygon's positions
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    // ...
    // Rest of your code

    if (intersects.length > 0) {
      // ...
      // Rest of your code

      currentPolygonPositions.push(point.x, point.y, point.z); // Store the position in the current polygon's array
      line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3)); // Use the current polygon's array for the line's position attribute
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    // Draw the final line
    line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
    line.geometry.computeBoundingSphere();

    console.log(`%cNum vertices:`, 'color: #997fff', currentPolygonPositions.length);
    console.log("positions", line.geometry.getAttribute("position").array);
    
    polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions in the polygonPositions array
    currentPolygonPositions = []; // Clear the current polygon's array
  }
}
```

<br>

By storing each polygon's positions in a separate array (`currentPolygonPositions`), you ensure that the lines are not connected between different polygons. The `polygonPositions` array will contain all the separate position arrays for each polygon, which you can use later for further processing if needed.

### Where do I declare the polygonPositions array?

You can declare the `polygonPositions` array right after the `currentPolygonPositions` declaration.

## Distance check

I apologize for not mentioning this before, but the connecting of the polygons only seems to happen if you try to draw them relatively close together.  I don't know why.  If you draw them further apart, they don't get connected.

Maybe it has something to do with the way three.js handles things?

I apologize for the oversight. The issue you described might be related to the way the Raycaster intersects objects and detects intersections. By default, the Raycaster may detect intersections with nearby objects, which could result in unintended connections between polygons.

To address this issue, you can introduce a threshold distance between the vertices of each polygon. If the distance between the current vertex and the last vertex of the polygon being drawn is below the threshold, you can skip adding it to the positions array. This will prevent unintended connections between polygons.

Here's an updated version of the code that incorporates the distance threshold:

```javascript
let currentPolygonPositions = []; // Declare a variable to store positions for the current polygon
let polygonPositions = []; // Declare an array to store positions for each polygon
const distanceThreshold = 0.1; // Adjust this value as needed

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new BufferAttribute for each line
    let bufferGeometry = new THREE.BufferGeometry();
    line = new THREE.Line(bufferGeometry, lineMaterial);
    scene.add(line);

    currentPolygonPositions = []; // Start a new array for the current polygon's positions
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    // ...
    // Rest of your code

    if (intersects.length > 0) {
      // ...
      // Rest of your code

      const lastVertex = new THREE.Vector3().fromArray(currentPolygonPositions.slice(-3));
      const currentVertex = new THREE.Vector3(point.x, point.y, point.z);
      const distance = lastVertex.distanceTo(currentVertex);

      if (distance > distanceThreshold) {
        currentPolygonPositions.push(point.x, point.y, point.z); // Store the position in the current polygon's array
        line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3)); // Use the current polygon's array for the line's position attribute
      }
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    // Draw the final line
    line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
    line.geometry.computeBoundingSphere();

    console.log(`%cNum vertices:`, 'color: #997fff', currentPolygonPositions.length);
    console.log("positions", line.geometry.getAttribute("position").array);
    
    polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions in the polygonPositions array
    currentPolygonPositions = []; // Clear the current polygon's array
  }
}
```

<br>

By adding the distance check between the last vertex and the current vertex (`distance > distanceThreshold`), we ensure that only vertices that are farther apart than the threshold value are added to the current polygon's position array. This should prevent unwanted connections between polygons when drawn close together.

Feel free to adjust the `distanceThreshold` value according to your specific requirements to achieve the desired effect.

<br>

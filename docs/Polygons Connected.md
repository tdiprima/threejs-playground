<span style="color:#0000dd;">I draw more than one polygon 🔶 on the image, it sometimes tries to connect a line from one polygon to the other.</span>

<span style="color:#003b76;">Pourquoi?</span> <span style="font-size:27px;">🇫🇷</span>  

<span style="color:#a71f36;">¿Por qué?</span> <span style="font-size:27px;">🇲🇽</span>

The issue you are experiencing where lines are being connected from one polygon to another is due to the fact that you are storing all the positions for all the polygons in a single array (`positions`). This array is being **continuously updated** <span style="color:#a71f36;">(Well, yeah...)</span> as you draw, and all the polygons share this array as their attribute for position data.

To fix this issue, you need to **create separate arrays** for each polygon's position data. Here's how you can modify your code to achieve that:

1. Declare a new array to store the positions for each polygon:

    ```javascript
    let polygonPositions = [];
    ```

2. Modify the event listeners for mouse events to keep track of the current polygon being drawn:

```javascript
let currentPolygonPositions = []; // Store positions for current polygon
let polygonPositions = []; // Store positions for each polygon

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new BufferAttribute for each line
    let bufferGeometry = new THREE.BufferGeometry();
    line = new THREE.Line(bufferGeometry, lineMaterial);
    scene.add(line);

    // Start a new array for the current polygon's positions
    currentPolygonPositions = [];
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    // ...
    // Rest of your code

    if (intersects.length > 0) {
      // ...
      // Rest of your code

      // Store the position in the current polygon's array
      currentPolygonPositions.push(point.x, point.y, point.z);

      // Use the current polygon's array for the line's position attribute
      line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3));
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    // Draw the final line
    line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
    line.geometry.computeBoundingSphere();

    // Store the current polygon's positions in the polygonPositions array
    polygonPositions.push(currentPolygonPositions);
    // Clear the current polygon's array
    currentPolygonPositions = [];
  }
}
```

<br>

By storing each polygon's positions in a separate array (`currentPolygonPositions`), you ensure that the lines are not connected between different polygons. The `polygonPositions` array will contain all the separate position arrays for each polygon, which you can use later for further processing if needed.

## Distance check

<span style="color:#0000dd;">I apologize for not mentioning this before, but the connecting of the polygons only seems to happen if you try to draw them relatively close together.  I don't know why.  If you draw them further apart, they (usually) don't get connected.</span>

<span style="color:#0000dd;">Maybe it has something to do with the way three.js handles things?</span>

I apologize for the oversight. The issue you described might be related to the way the `Raycaster` intersects objects and detects intersections.

By default, <mark>**the Raycaster may detect intersections with nearby objects,**</mark> which could result in unintended connections between polygons.

To address this issue, you can introduce a **threshold distance** between the vertices of each polygon.

If the distance between the current vertex and the last vertex of the polygon being drawn is below the threshold, you can skip adding it to the positions array. This will **prevent unintended connections** between polygons.

<span style="color:#a71f36;font-weight:bold;">Eh...</span>

### Distance threshold

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
    
    polygonPositions.push(currentPolygonPositions); // Store the current polygon's positions in the polygonPositions array
    currentPolygonPositions = []; // Clear the current polygon's array
  }
}
```

<br>

By adding the distance check between the last vertex and the current vertex (`distance > distanceThreshold`), we ensure that only vertices that are farther apart than the threshold value are added to the current polygon's position array. This should prevent unwanted connections between polygons when drawn close together.

Feel free to adjust the `distanceThreshold` value according to your specific requirements to achieve the desired effect.

## Nothing drawn

<span style="color:#0000dd;">No matter how I adjust the distanceThreshold, nothing gets drawn to the screen.  The condition "if (distance > distanceThreshold)" never succeeds.  It may, or may not, have anything to do with the fact that we're not handling the first polygon drawn; I'm not sure.</span>

Apologies for the confusion. I see the issue in your code now. The problem lies in the variable name mismatch. In your `onMouseMove` function, you're pushing the coordinates to `positions` array instead of `currentPolygonPositions`.

To fix this issue, update the line in `onMouseMove` function from:

```javascript
positions.push(point.x, point.y, point.z);
```

to:

```javascript
currentPolygonPositions.push(point.x, point.y, point.z);
```

<br>

You are correct. In order to maintain the initial positions array for raycasting, you should modify the line `positions.push(point.x, point.y, point.z);` inside the `onMouseMove` function to `currentPolygonPositions.push(point.x, point.y, point.z);`.

```javascript
let currentPolygonPositions = []; // Store positions for current polygon
let polygonPositions = []; // Store positions for each polygon
const distanceThreshold = 0.001; // 0.1

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new BufferAttribute for each line
    let bufferGeometry = new THREE.BufferGeometry();
    line = new THREE.Line(bufferGeometry, lineMaterial);
    scene.add(line);

    currentPolygonPositions = []; // Start a new array
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      let point = intersects[0].point;

      // Store the position in the current polygon's array
      currentPolygonPositions.push(point.x, point.y, point.z);

      let bufferGeometry = line.geometry;

      // DISTANCE CHECK
      const lastVertex = new THREE.Vector3().fromArray(currentPolygonPositions.slice(-3));
      const currentVertex = new THREE.Vector3(point.x, point.y, point.z);
      const distance = lastVertex.distanceTo(currentVertex);

      if (distance > distanceThreshold) {
        console.log("here");
        // Use the current polygon's array for the line's position attribute
        line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3));

        bufferGeometry.attributes.position.needsUpdate = true;
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

    // Store the current polygon's positions in the polygonPositions array
    polygonPositions.push(currentPolygonPositions);
    // Clear the current polygon's array
    currentPolygonPositions = [];
  }
}
```

<br>

Now, the positions will be correctly stored in the `currentPolygonPositions` array, and the distance check should work as expected.

<span style="color:green;font-weight:bold;font-size:larger;">Yeah, no.</span>

It still doesn't account for the first one.  Distance is zero.  So I did that, and... it still connects sometimes anyway.  Even if I set the threshold back to like 0.1 or something.

## I love it.

Even if you don't understand the issue, show confidence anyway.  It's what any guy would automatically do.  And that's how they run the world, even while being incompetent!

Apologies for the confusion. I understand the issue now. To handle the first drawn polygon and prevent connections between polygons, you can add an additional check in the `onMouseMove` function to determine if it's the first vertex being added to the current polygon.

```javascript
let currentPolygonPositions = []; // Store positions for current polygon
let polygonPositions = []; // Store positions for each polygon
const distanceThreshold = 0.1;

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;

    // Create a new BufferAttribute for each line
    let bufferGeometry = new THREE.BufferGeometry();
    line = new THREE.Line(bufferGeometry, lineMaterial);
    scene.add(line);

    currentPolygonPositions = []; // Start a new array
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      let point = intersects[0].point;

      // Check if it's the first vertex of the current polygon
      const isFirstVertex = currentPolygonPositions.length === 0;

      if (isFirstVertex) {
        currentPolygonPositions.push(point.x, point.y, point.z);
      } else {
        // DISTANCE CHECK
        const lastVertex = new THREE.Vector3().fromArray(currentPolygonPositions.slice(-3));
        const currentVertex = new THREE.Vector3(point.x, point.y, point.z);
        const distance = lastVertex.distanceTo(currentVertex);

        if (distance > distanceThreshold) {
          console.log("here");
          // Store the position in the current polygon's array
          currentPolygonPositions.push(point.x, point.y, point.z);
          // Use the current polygon's array for the line's position attribute
          line.geometry.setAttribute("position", new THREE.Float32BufferAttribute(currentPolygonPositions, 3));
        }
      }

      let bufferGeometry = line.geometry;
      bufferGeometry.attributes.position.needsUpdate = true;
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;

    // Draw the final line
    line.geometry.setDrawRange(0, currentPolygonPositions.length / 3);
    line.geometry.computeBoundingSphere();

    // Store the current polygon's positions in the polygonPositions array
    polygonPositions.push(currentPolygonPositions);
    // Clear the current polygon's array
    currentPolygonPositions = [];
  }
}
```

<br>

The code checks if it's the first vertex of the current polygon by comparing the length of `currentPolygonPositions` with zero. If it's the first vertex, it is directly added to the positions array without the distance check. For subsequent vertices, the distance check is performed as before.

Please give it a try, and let me know if the issue persists or if you have any further questions.

<br>

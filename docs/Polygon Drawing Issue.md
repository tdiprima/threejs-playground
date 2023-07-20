## Polygon Drawing Issue

<span style="color:#0000dd;">Allow the user to create a closed polygon annotation, either by clicking individual points (with double-click to end) or clicking and dragging.</span>

But it wasn't drawing anything.

All I had to do was change 2 lines of code in `updatePolygon()`.

```js
// Refer to the global variable
positions = new Float32Array(numPoints * 3);

// Add
polygon.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
```

## Global "positions" array

The issue in your code lies in the `updatePolygon()` function. Specifically, you have a local variable `positions` within the function that is shadowing the global `positions` array. <span style="color:#0000dd;">And I knew that. 🤦🏻‍♀️</span>

As a result, the changes you make to the local `positions` array inside the function do not affect the global `positions` array.

To fix this issue, you need to **remove the `let` keyword** from the `positions` variable declaration inside the `updatePolygon()` function. This way, you'll be modifying the global `positions` array instead of creating a new local variable.

With this change, the `positions` array in the `updatePolygon()` function will refer to the global `positions` array, and the polygon should be properly updated and drawn on the screen when you interact with the program.

## Typed Array

Apologies for the confusion in my previous response. You're correct, and I apologize for the incorrect information.

To resolve the issue, you should create a new `Float32BufferAttribute` with the `positions` array and set it as the position attribute of the polygon's geometry.

```javascript
// Usage of positions array
positions = new Float32Array(numPoints * 3);

// Float32
polygon.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
```

<br>

In the updated code, I've replaced `THREE.BufferAttribute` with `THREE.Float32BufferAttribute` when setting the position attribute of the polygon's geometry. Additionally, I've corrected the usage of the `positions` array.

**Now, the positions should be correctly updated and applied** to the polygon's geometry when you call `updatePolygon()`, resolving the error you encountered.

Thank you for catching the mistake, and I apologize for any confusion caused. Please try the updated code, and let me know if you have any further questions!

## Add Click and drag

To **support** drawing the polygon by clicking and dragging, you can modify the `onMouseDown`, `onMouseMove`, and `onMouseUp` event handlers.

Here's an updated version of those event handlers that will enable drawing the polygon by clicking and dragging:

```javascript
let isDrawing = false;
let isDragging = false; // ADD
let dragStartIndex; // ADD (usage not shown) :(

// addEventListener's...

function onMouseDown(event) {
  event.preventDefault();
  if (!isDrawing) {
    isDrawing = true;
    isDragging = true; // ADD
    let point = getMousePosition(event.clientX, event.clientY);
    points.push(point);
    updatePolygon();
  }
}

function onMouseMove(event) {
  event.preventDefault();
  // if (isDrawing) { ... well, no...
  if (isDragging) {
    let point = getMousePosition(event.clientX, event.clientY);
    points[points.length - 1] = point;
    updatePolygon();
  }
}

function onMouseUp(event) {
  event.preventDefault();
  // if (isDrawing) { ... ditto ...
  if (isDragging) {
    isDragging = false; // ADD
    isDrawing = false; // ADD
    let point = getMousePosition(event.clientX, event.clientY);
    points.push(point);
    updatePolygon();
  }
}

```

<br>

In the updated code, I **added the `isDragging` flag** to track whether the user is currently clicking and dragging to draw the polygon.

The `isDragging` flag is initially set to `false`, and when the `onMouseDown` event is triggered, it is set to `true`.

The `onMouseMove` event handler will **only update the last point** of the `points` array if `isDragging` is `true`.

The `onMouseUp` event handler will set both `isDragging` and `isDrawing` flags to `false` when the dragging is finished.

With these changes, you should be able to draw the polygon by clicking and dragging the mouse. The polygon will update in real-time as you move the mouse while dragging.

## Solution

<span style="color:#0000dd;">I could either work on it, or say the h3ll with it, because we're giving them a <span style="font-size:27px;">✏️</span> and they can freedraw with that!</span>

<br>

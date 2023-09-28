## Add Click and drag

<span style="color:#0000dd;">The assignment: Allow the user to create a closed polygon annotation, either by clicking individual points (with double-click to end) or clicking and dragging.</span>


To **support** drawing the polygon by clicking and dragging, you can modify the `onMouseDown`, `onMouseMove`, and `onMouseUp` event handlers.

<mark>**I think you should use three.js drag.**</mark>

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

In the updated code, I **added the `isDragging` flag** to track whether the user is currently clicking and dragging to draw the polygon.

The `isDragging` flag is initially set to `false`, and when the `onMouseDown` event is triggered, it is set to `true`.

The `onMouseMove` event handler will **only update the last point** of the `points` array if `isDragging` is `true`.

The `onMouseUp` event handler will set both `isDragging` and `isDrawing` flags to `false` when the dragging is finished.

With these changes, you should be able to draw the polygon by clicking and dragging the mouse. The polygon will update in real-time as you move the mouse while dragging.

## Solution

<span style="color:#0000dd;">I could either work on it, or say the h3ll with it, because we're giving them a <span style="font-size:27px;">✏️</span> and they can freedraw with that!</span>

<mark>**TODO:** Combine the rectangle, ellipse, and polygon functions together.  And fix "brush" (optional).</mark>

<br>

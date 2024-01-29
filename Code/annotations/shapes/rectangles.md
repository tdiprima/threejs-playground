## Multiple rectangles

<span style="color:blue;font-size:larger;">The problem is, the old rectangle disappears when a new one is drawn.</span>

The issue with your current implementation is that you are using a single `THREE.LineLoop` object (`rect`) to draw the rectangle, and every time you draw a new rectangle, you are updating the vertices of this same object. This is why the old rectangle disappears when a new one is drawn.

To allow multiple rectangles to be drawn and persist on the screen, you need to create a new `THREE.LineLoop` object for each rectangle instead of reusing the same one. Here's how you can modify your code to achieve this:

1. **Create a function to add a new rectangle**: This function will create a new `THREE.LineLoop` object for each rectangle and add it to the scene.

2. **Modify `onMouseUp` event handler**: Instead of updating the existing rectangle, you'll call the function to add a new rectangle to the scene.

Here is the modified code:

```javascript
// ... [Previous code remains the same]

// Function to add a new rectangle
function addRectangle(startPoint, endPoint) {
    let newGeometry = new THREE.BufferGeometry();
    let vertices = new Float32Array(12); // 4 vertices

    vertices[0] = startPoint.x;
    vertices[1] = startPoint.y;
    vertices[2] = startPoint.z;
    vertices[3] = endPoint.x;
    vertices[4] = startPoint.y;
    vertices[5] = startPoint.z;
    vertices[6] = endPoint.x;
    vertices[7] = endPoint.y;
    vertices[8] = startPoint.z;
    vertices[9] = startPoint.x;
    vertices[10] = endPoint.y;
    vertices[11] = startPoint.z;

    newGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    let newRect = new THREE.LineLoop(newGeometry, material);
    scene.add(newRect);
}

// Modify onMouseUp
function onMouseUp(event) {
    event.preventDefault();
    isDrawing = false;
    endPoint = getMousePosition(event.clientX, event.clientY);
    addRectangle(startPoint, endPoint);
}

// ... [Rest of the code remains the same]
```

With these changes, each time you draw a new rectangle, it creates a new `THREE.LineLoop` object and adds it to the scene, allowing all drawn rectangles to persist.

<br>

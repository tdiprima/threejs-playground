## Toggle Orbit Controls

<span style="color:blue;font-size:larger;">For Zephyr shape.js. Base: factory.html</span>

To control the OrbitControls based on the `isDrawing` state in your Three.js application, you can integrate the enabling and disabling of the controls directly into the event handlers of your shapes. This means modifying the `onMouseDown`, `onMouseMove`, and `onMouseUp` methods of your shape classes to toggle the state of OrbitControls.

However, your current class structure doesn't provide direct access to the OrbitControls instance from within the shape classes. To address this, you have a couple of options:

1. **Passing the OrbitControls Reference to Shape Classes**: Modify your shape classes to accept an additional parameter in their constructor for the OrbitControls reference. This way, each shape instance can directly control the OrbitControls.

2. **Callback Function**: Use a callback function that is triggered when the drawing state changes. This callback can then enable or disable the OrbitControls.

I'll illustrate the first option, as it's more straightforward:

1. Modify your shape class constructors to accept an additional parameter for the OrbitControls:

    ```javascript
    class Shape {
        constructor(mesh, controls) {
            this.mesh = mesh;
            this.controls = controls; // Add this line
            // ... rest of the code
        }
        // ... rest of the class
    }
    ```

    Make sure to pass this `controls` parameter down from the derived classes as well:

    ```javascript
    class Rectangle extends Shape {
        constructor(mesh, controls) {
            super(mesh, controls);
            // ... rest of the code
        }
        // ... rest of the class
    }

    // Similarly for Ellipse and Polygon classes
    ```

2. In the `onMouseDown`, `onMouseMove`, and `onMouseUp` methods, add the logic to enable or disable the OrbitControls:

    ```javascript
    onMouseDown(event) {
        this.isDrawing = true;
        this.controls.enabled = false; // Disable controls when drawing starts
        // ... rest of the code
    }

    onMouseMove(event) {
        if (!this.isDrawing) return;
        // ... rest of the code
    }

    onMouseUp(event) {
        this.isDrawing = false;
        this.controls.enabled = true; // Enable controls when drawing ends
        // ... rest of the code
    }
    ```

3. When creating shape instances, pass the OrbitControls reference:

    ```javascript
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    // ... rest of the setup code

    currentShape = factory.createShape("rectangle", controls);
    ```

    Ensure that your `ShapeFactory` class and its `createShape` method are also updated to accept and pass this `controls` parameter to the shape constructors.

This approach allows each shape to have control over the OrbitControls based on their internal state, enabling a more modular and encapsulated design.

## All code

Certainly! I'll integrate the changes into your existing code. Here's the complete modified version, incorporating the OrbitControls enabling and disabling logic within the shape classes:

```javascript
class Shape {
    constructor(mesh, controls) {
        this.mesh = mesh;
        this.controls = controls;
        this.isDrawing = false;
        this.startPoint = new THREE.Vector2(0, 0);
        this.endPoint = new THREE.Vector2(0, 0);
        this.points = [];
    }

    onMouseDown(event) {
        this.isDrawing = true;
        this.controls.enabled = false;
    }
    onMouseMove(event) {}
    onMouseUp(event) {
        this.isDrawing = false;
        this.controls.enabled = true;
    }
    onDoubleClick(event) {}
    update() {}
}

// ... Rectangle, Ellipse, Polygon classes with the same modifications

class ShapeFactory {
    constructor(mesh, controls) {
        this.mesh = mesh;
        this.controls = controls;
    }

    createShape(type) {
        switch (type) {
            case "rectangle":
                return new Rectangle(this.mesh, this.controls);
            case "ellipse":
                return new Ellipse(this.mesh, this.controls);
            case "polygon":
                return new Polygon(this.mesh, this.controls);
            default:
                throw new Error("Invalid shape type");
        }
    }
}

// Your three.js setup code
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
let geometry = new THREE.BufferGeometry();
let mesh = new THREE.LineLoop(geometry, material);
scene.add(mesh);

let controls = new THREE.OrbitControls(camera, renderer.domElement);
let factory = new ShapeFactory(mesh, controls);
let currentShape = null;

// ... Event listeners and getMousePosition function

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
```

In this revised code:

- Each shape class constructor now accepts an additional `controls` parameter.
- The `onMouseDown` and `onMouseUp` methods in the `Shape` class (and its subclasses) handle enabling and disabling of the OrbitControls.
- The `ShapeFactory` class also accepts the OrbitControls instance and passes it to the shapes it creates.

This setup ensures that when you start drawing a shape (`isDrawing = true`), the OrbitControls are disabled, and they are re-enabled once you finish drawing (`isDrawing = false`). This change should provide a smoother and more intuitive interaction experience in your application.

<br>

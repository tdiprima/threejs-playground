## Right-click to Pan

<span style="color:#0000dd;font-size:larger;">Saw it in 3d-force-graph:</span>

<span style="color:#59acf3;">orbit: 'Left-click: rotate, Mouse-wheel/middle-click: zoom, Right-click: pan'</span>

Using `OrbitControls` in Three.js, you can configure the mouse buttons that trigger different actions (rotate, zoom, pan).

<mark>**By default:**</mark> the left mouse button is set to rotate, the right button to pan, and the middle button (or scroll wheel) to zoom.

However, if this default configuration isn't working as you desire, you can manually set it up. Below is an example of how you can set the right mouse button to pan:

Firstly, make sure you have `OrbitControls.js` imported in your project. You can import it from the `three` package if you are using modules:

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

Or include it with a script tag from a CDN if you are not using modules:

```html
<script type="text/javascript" src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
```

Then, you need to instantiate and configure the `OrbitControls`:

```javascript
const controls = new OrbitControls(camera, renderer.domElement);

// Set the mouse buttons
controls.mouseButtons = {
  LEFT: THREE.MOUSE.RIGHT, // setting the LEFT action to the right mouse button
  MIDDLE: THREE.MOUSE.MIDDLE,
  RIGHT: THREE.MOUSE.LEFT // setting the RIGHT action (pan) to the left mouse button
};

// You may also need to update controls during the animation or when resizing
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  renderer.render(scene, camera);
}
```

With this configuration, your left mouse button will trigger the action initially assigned to the right mouse button (pan), and vice versa. Adjust the `mouseButtons` property according to your needs. Ensure you have the correct mouse button constants (which might vary depending on the Three.js version).

For the code to work correctly, also ensure you are using a version of `OrbitControls` that supports the `mouseButtons` property. If you're using an older version, consider updating Three.js and `OrbitControls` to the latest version available.

If you notice that the panning is still not working as expected, also check if there is no other code or HTML element interfering with the mouse events on your canvas.

<br>

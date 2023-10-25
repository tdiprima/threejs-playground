## Create Three.js Scale Bar

<span style="color:#0000dd;">Build off the pseudocode.  Create a scale bar in a three.js scene.</span>

A scale bar is usually used to give a visual indication of the size of objects in the scene.

To calculate the scale bar's position in the viewport, update text labels, and fill in the `calculateScale` function, you can follow these steps:

1. **Calculate Scale Bar Position in the Viewport**:
   - You can position the scale bar at a fixed position relative to the camera so that it stays in the same place in the viewport regardless of where you move in the scene.

2. **Update Text Labels**:
   - You can use the `THREE.Sprite` with `THREE.TextTexture` or `THREE.CSS2DObject` to create labels for your scale bar. You would update these labels in the `update` function based on the scale of the scale bar.

3. **Calculate Scale Function**:
   - The `calculateScale` function can calculate the scale based on the camera's distance from the origin or another point of reference in your scene. This depends on how you want the scale to behave.

Here's an example of how you can do this:

```javascript
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create scale bar mesh
let scaleBarGeometry = new THREE.PlaneGeometry(1, 0.1);
let scaleBarMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
let scaleBar = new THREE.Mesh(scaleBarGeometry, scaleBarMaterial);
scaleBar.position.set(-2, -2, 0);  // Set initial position of the scale bar
scene.add(scaleBar);

// Create a label for the scale bar
let labelDiv = document.createElement('div');
labelDiv.className = 'label';
labelDiv.textContent = 'Scale: ';
labelDiv.style.marginTop = '-1em';
let label = new THREE.CSS2DObject(labelDiv);
label.position.set(0, 0.1, 0);  // Set position of label above the scale bar
scaleBar.add(label);

let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

function calculateScale(zoom) {
  // This function should return a scale value based on the camera's zoom
  // Here's a simple example that inversely scales the bar with the camera's zoom
  return 1 / zoom;
}

// Update scale bar position
function update() {
  // Update scale bar position relative to the camera
  // Calculate position in the viewport, perhaps using vector projection
  let vector = new THREE.Vector3(-0.95, -0.95, -1);
  vector.unproject(camera);
  scaleBar.position.copy(vector);

  // Update scale bar size
  // Calculate size based on camera zoom
  let scale = calculateScale(camera.zoom);
  scaleBar.scale.set(scale, 1, 1);

  // Update text labels
  labelDiv.textContent = `Scale: ${(1 / scale).toFixed(2)}`;
}

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

animate();
```

In this example, the `calculateScale` function inversely scales the bar with the camera's zoom, and the `update` function updates the scale bar's position relative to the camera and updates the text label with the current scale.

Please make sure you have included the required three.js modules (such as `CSS2DRenderer`) in your project to use the `CSS2DObject`. You may need to adjust paths and module names based on your project setup.

## CSS 2D Object

The `THREE.CSS2DObject` is part of the examples in the three.js library and is not included in the main three.js build. You need to include it separately in your project. You can find it in the `examples/jsm/renderers/CSS2DRenderer.js` file in the three.js repository.

To use it, you first need to import it in your project.

```js
import { CSS2DRenderer, CSS2DObject } from 'CSS2DRenderer.js';
```

You should also create a `CSS2DRenderer` instance to render the label.

```js
let labelRenderer = new CSS2DRenderer();
// Etc.
```

Make sure to update the label renderer in your animation loop.

```javascript
labelRenderer.render(scene, camera);
```

You should be able to use `THREE.CSS2DObject` to create labels in your three.js scene.

## Let's go

<span style="color:#0000dd;">What I see on the screen is a big white rectangle on the bottom of the screen.  I'm assuming that's the "Scale bar", though in practicality it should be much smaller.  I'm thinking either: A) The text color needs to be set to black, or B) Something else is wrong, and that's why there's a big white rectangle instead of text.</span>

It sounds like the scale bar might be too large or too close to the camera, and the text might not be displaying correctly. Here are some steps to troubleshoot and resolve these issues:

### 1. Adjust Scale Bar Size and Position

Ensure that the scale bar is appropriately sized and positioned. You can start by setting explicit values and then adjust as necessary.

```javascript
scaleBar.scale.set(0.1, 0.1, 0.1);  // Adjust scale as necessary
scaleBar.position.set(-2, -2, 0);  // Adjust position as necessary
```

### 2. Set Text Color

Ensure that the text color is set to a contrasting color so it's visible against the background. You can set the color using CSS:

```css
.label {
  color: black;
  font-family: Arial, sans-serif;
}
```

Include this CSS either in a `<style>` tag in your HTML or in an external CSS file.

### 3. Ensure Text is Visible

Ensure that the text is being rendered and is visible. You may want to check the following:

- Is the text being added to the scene?
- Is the `CSS2DRenderer` rendering the label correctly?

You can test this by adding a border to the label div:

```css
.label {
  border: 1px solid black;
}
```

This will help you see if the text label is being rendered at all.

### 4. Check Console for Errors

Open the browser’s Developer Tools and check the Console tab for any errors or warnings that might give more information on what’s going wrong.

### 5. Update the Animation Loop

Make sure the `CSS2DRenderer` is being updated in the animation loop:

```javascript
function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);  // Ensure this line is present
}
```

After making these changes, you should be able to see the scale bar and text label correctly. Adjust the positions, scales, and styles as necessary to achieve the desired appearance.

## Still no text

<span style="color:#0000dd;">I still don't see any text.</span>

Let's address both issues:

### 1. Text Label Not Visible

Given your code, the CSS2DObject should work. However, you might need to ensure that your CSS styles are actually being applied. You can add a `<style>` tag directly in your HTML to make sure that the styles are present.

<span style="color:yellow;">Been there, done that.</span>

### 2. Using the Calculated Scale

<span style="color:yellow;">I did use it.</span>

```javascript
function update() {
  let scale = calculateScale(camera.zoom);
  scaleBar.scale.set(scale, 1, 1);
  labelDiv.textContent = 'Scale: ' + (1 / scale).toFixed(2);
}
```

This will adjust the scale bar's size based on the camera's zoom level, and it will also update the label text to reflect the current scale.

After making these changes, you should see the text label (if the styles are applied correctly), and the scale bar should adjust its size based on the camera's zoom level.

If the text label is still not visible, there might be additional issues with how the `CSS2DRenderer` is set up or how the styles are being applied.

Ensure that the `CSS2DRenderer`'s DOM element is correctly positioned and sized to cover your viewport.

## Use a sprite, then.

Using `THREE.Sprite` for the label can be a good alternative since it's a part of the main three.js library and might be easier to work with in this context. Below is the modified version of your program that uses a `THREE.Sprite` for the label:

First, you need to create a texture for the sprite using a canvas. The text will be drawn on the canvas, and the canvas will be used as a texture for the sprite.

In [this code](sprite-me.html):

1. A `createTextTexture` function is added, which creates a canvas, draws text on it, and then creates a texture from this canvas.

2. A `THREE.Sprite` is used for the label, and its material’s map is set to the texture created by `createTextTexture`.

3. In the `update` function, the scale is calculated, applied to the scale bar, and also used to update the label’s text.

This approach should work and display the label as a sprite in your three.js scene. Make sure that the styling and positioning of the text on the canvas suits your needs. Adjust the `createTextTexture` function, `context.font`, and `context.fillText` parameters as necessary.

<span style="color:yellow;">This was the problem:</span>

````javascript
function createTextTexture(text) {
  context.fillStyle = "black";
}
````

<span style="color:yellow;">Now to figure out the sizing and orbit controls.</span>

<br>

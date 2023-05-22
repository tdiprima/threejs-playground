## Synchronize Zoom Between Scenes

This is what made the images display like a vertical line:

```js
let ASPECT = window.innerWidth / 2;
let RENDER_WIDTH = window.innerWidth / 2;
```

If you're gonna do it to one dimension, do it to the other. Duh.

### Image Aspect

```js
let imageAspect1 = texture1.image.width / texture1.image.height;
let geometry1 = new THREE.PlaneGeometry(2 * imageAspect1, 2);

let imageAspect2 = texture2.image.width / texture2.image.height;
let geometry2 = new THREE.PlaneGeometry(2 * imageAspect2, 2);
```

<br>

<span style="color:#0000dd;">I have a three.js script where I display 2 images, each in their own scene, with their own camera and orbit controls.  So I can zoom in and out of each one, independently.  Now, if I wanted to keep the 2 images in their own scene, but when I zoom in on one, it tells the other image's camera and orbit controls to zoom in and out the same way, how can I do that?</span>

To **synchronize the zooming behavior** between two separate scenes in three.js, you can achieve this by creating a **communication mechanism** between the two scenes.

One approach is to use a shared event system where one scene emits an event when its zoom level changes, and the other scene listens for that event and adjusts its own zoom level accordingly.

### Synchronization between two scenes:

```javascript
// huntress.html
// Create the first scene
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer1 = new THREE.WebGLRenderer();
// ... Set up renderer, controls, and other necessary configurations for scene1

// Create the second scene
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer2 = new THREE.WebGLRenderer();
// ... Set up renderer, controls, and other necessary configurations for scene2

// Create event system
const eventDispatcher = new THREE.EventDispatcher();

// Listen for zoom event on scene1
const onScene1Zoom = (event) => {
  // Adjust the zoom level of camera2 in scene2
  camera2.zoom = event.zoom;
  camera2.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene1zoom', onScene1Zoom);

// Listen for zoom event on scene2
const onScene2Zoom = (event) => {
  // Adjust the zoom level of camera1 in scene1
  camera1.zoom = event.zoom;
  camera1.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene2zoom', onScene2Zoom);

// Update function for rendering the scenes
function update() {
  // Render scene1
  renderer1.render(scene1, camera1);

  // Render scene2
  renderer2.render(scene2, camera2);

  // Call the update function recursively for smooth animation
  requestAnimationFrame(update);
}

// Start the rendering loop
update();
```

<br>

In the above code, we have two scenes (`scene1` and `scene2`) with their respective cameras (`camera1` and `camera2`). Each scene has its own renderer, controls, and other necessary configurations that you can set up according to your requirements.

We create an event system using `THREE.EventDispatcher` to facilitate communication between the two scenes. The `eventDispatcher` will handle the events emitted by one scene and listened to by the other.

In this example, when the zoom level changes in `scene1`, it emits a 'scene1zoom' event, which triggers the `onScene1Zoom` function. Inside `onScene1Zoom`, we adjust the zoom level of `camera2` in `scene2` accordingly.

Similarly, when the zoom level changes in `scene2`, it emits a 'scene2zoom' event, which triggers the `onScene2Zoom` function. Inside `onScene2Zoom`, we adjust the zoom level of `camera1` in `scene1` accordingly.

To make this work, you'll need to capture the zoom events in each scene's controls and emit the corresponding event. The specific implementation will depend on the controls library you are using for zooming in and out.

Remember to modify this code to suit your specific use case and integrate it with your existing setup for each scene.

## Ayúdame.

Well, the controls I'm using to zoom is simply the three.js OrbitControls.  So in the update() method, I'm just doing:

```js
controls1.update();
renderer1.render(scene1, camera1);
controls2.update();
renderer2.render(scene2, camera2);
```

But when I zoom in on one image, the other image doesn't move.  You mentioned that I'll need to capture the zoom events in each scene's controls and emit the corresponding event.  How do I make this work?

To synchronize the zooming behavior using `OrbitControls`, you can modify the existing `OrbitControls` class to emit a custom event whenever the zoom level changes. Here's an example implementation that demonstrates this:

```javascript
// Extend the OrbitControls class to emit zoom events
class CustomOrbitControls extends THREE.OrbitControls {
  constructor(camera, domElement) {
    super(camera, domElement);
    this.zoomEvent = { type: 'zoom', zoom: this.object.zoom };
  }

  update() {
    const zoomChanged = this.zoomEvent.zoom !== this.object.zoom;

    super.update();

    if (zoomChanged) {
      this.zoomEvent.zoom = this.object.zoom;
      this.dispatchEvent(this.zoomEvent);
    }
  }
}

// Create the first scene
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer1 = new THREE.WebGLRenderer();
// ... Set up renderer, controls, and other necessary configurations for scene1

// Create the second scene
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer2 = new THREE.WebGLRenderer();
// ... Set up renderer, controls, and other necessary configurations for scene2

// Create event system
const eventDispatcher = new THREE.EventDispatcher();

// Create the custom controls for scene1
const controls1 = new CustomOrbitControls(camera1, renderer1.domElement);
controls1.addEventListener('zoom', (event) => {
  eventDispatcher.dispatchEvent({ type: 'scene1zoom', zoom: event.zoom });
});

// Create the custom controls for scene2
const controls2 = new CustomOrbitControls(camera2, renderer2.domElement);
controls2.addEventListener('zoom', (event) => {
  eventDispatcher.dispatchEvent({ type: 'scene2zoom', zoom: event.zoom });
});

// Listen for zoom event on scene1
const onScene1Zoom = (event) => {
  // Adjust the zoom level of camera2 in scene2
  camera2.zoom = event.zoom;
  camera2.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene1zoom', onScene1Zoom);

// Listen for zoom event on scene2
const onScene2Zoom = (event) => {
  // Adjust the zoom level of camera1 in scene1
  camera1.zoom = event.zoom;
  camera1.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene2zoom', onScene2Zoom);

// Update function for rendering the scenes
function update() {
  controls1.update();
  renderer1.render(scene1, camera1);

  controls2.update();
  renderer2.render(scene2, camera2);

  requestAnimationFrame(update);
}

// Start the rendering loop
update();
```

<br>

In the above code, we create a custom class `CustomOrbitControls` by extending the `THREE.OrbitControls` class. This custom class emits a `zoom` event whenever the zoom level changes. The `zoom` event includes the `zoom` value, which represents the current zoom level of the controls.

In the `update()` method of `CustomOrbitControls`, we check if the zoom level has changed since the last update. If it has, we update the `zoomEvent` object and dispatch the event using `dispatchEvent`.

In the scene setup section, we create an instance of `CustomOrbitControls` for each scene (`controls1` for `scene1` and `controls2` for `scene2`). We add event listeners to these controls for the `zoom` event and dispatch a custom event (`scene1zoom`...

## Bien.

<span style="color:#0000dd;">Earlier, you mentioned that my specific implementation will depend on the controls library I'm using for zooming in and out.  Can you recommend such a plugin or library?  Is there one that allows panning in three.js as well as zooming?</span>

Certainly! One popular library that provides both zooming and panning functionalities for three.js is `three-orbitcontrols`. It is a modified version of `OrbitControls` with added panning support. You can find the library on GitHub at the following link: [three-orbitcontrols](https://github.com/mattdesl/three-orbit-controls).

To use `three-orbitcontrols` in your project, you can follow these steps:

1. Download the `OrbitControls.js` file from the GitHub repository or use a package manager like npm to install it:

   ```shell
   npm install three-orbitcontrols
   ```

2. Include the `OrbitControls.js` file in your HTML file or import it into your JavaScript file if you're using a module bundler:

   ```javascript
   import { OrbitControls } from 'three-orbitcontrols';
   ```

3. Create instances of `OrbitControls` for each scene and configure them:

   ```javascript
   // Create the first scene
   const scene1 = new THREE.Scene();
   const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   const renderer1 = new THREE.WebGLRenderer();
   // ... Set up renderer and other necessary configurations for scene1

   // Create the second scene
   const scene2 = new THREE.Scene();
   const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   const renderer2 = new THREE.WebGLRenderer();
   // ... Set up renderer and other necessary configurations for scene2

   // Create the OrbitControls instances for each scene
   const controls1 = new OrbitControls(camera1, renderer1.domElement);
   controls1.enablePan = true; // Enable panning
   // ... Additional configuration for controls1

   const controls2 = new OrbitControls(camera2, renderer2.domElement);
   controls2.enablePan = true; // Enable panning
   // ... Additional configuration for controls2
   ```

   You can customize the controls by modifying their properties. In the example above, we enable panning by setting `enablePan` to `true`. You can explore other properties and methods available in `OrbitControls` for more advanced customization.

4. Update the controls in the rendering loop:

   ```javascript
   function update() {
     controls1.update();
     renderer1.render(scene1, camera1);

     controls2.update();
     renderer2.render(scene2, camera2);

     requestAnimationFrame(update);
   }

   // Start the rendering loop
   update();
   ```

With `three-orbitcontrols`, you'll have zooming and panning functionality available for each scene, and you can synchronize the zoom behavior using the approach mentioned earlier in this conversation.

Remember to add appropriate event listeners to the controls to emit custom events and handle them to synchronize the zoom behavior between scenes.

## Que mierda

<span style="color:#0000dd;">The CustomOrbitControls update() method does not seem to be firing.  And the zoom event on the controls1 and controls2 CustomOrbitControls are not firing.</span>

Apologies for the confusion. It seems there was an oversight in the previous code. To make the custom `CustomOrbitControls` class work correctly, we need to inherit from `EventDispatcher` and dispatch events appropriately. Here's an updated version of the code:

```javascript
// Extend the OrbitControls class to emit zoom events
class CustomOrbitControls extends THREE.EventDispatcher {
  constructor(camera, domElement) {
    super();
    this.object = camera;
    this.domElement = domElement;
    this.zoomEvent = { type: 'zoom', zoom: this.object.zoom };

    // ... Add your existing OrbitControls code here

    // Add an event listener for the 'change' event
    this.addEventListener('change', this.update.bind(this));
  }

  update() {
    const zoomChanged = this.zoomEvent.zoom !== this.object.zoom;

    // ... Add your existing OrbitControls update code here

    if (zoomChanged) {
      this.zoomEvent.zoom = this.object.zoom;
      this.dispatchEvent(this.zoomEvent);
    }
  }
}

// Rest of the code remains the same
```

<br>

In the updated code, we modify the `CustomOrbitControls` class to inherit from `THREE.EventDispatcher`, which provides the event dispatching functionality. We also add an event listener for the `'change'` event, which triggers the `update` method when the controls change.

Make sure to replace the previous definition of `CustomOrbitControls` in your code with this updated version. The `update` method should now fire correctly, and the `zoom` events on `controls1` and `controls2` should be emitted as expected.

## ¡Ay Caramba!

<span style="color:#0000dd;">Now it doesn't work at all.  I can't zoom in or out.  Could you give a complete example?</span>

Apologies for the confusion earlier. Here's a complete example that demonstrates how to synchronize the zooming behavior between two scenes using `OrbitControls` in three.js:

```javascript
// maneja.html
// Create the first scene
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer1 = new THREE.WebGLRenderer();
// ... Set up renderer, camera, and other necessary configurations for scene1

// Create the second scene
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer2 = new THREE.WebGLRenderer();
// ... Set up renderer, camera, and other necessary configurations for scene2

// Create the OrbitControls instances for each scene
const controls1 = new THREE.OrbitControls(camera1, renderer1.domElement);
controls1.addEventListener('change', onControlsChange1);

const controls2 = new THREE.OrbitControls(camera2, renderer2.domElement);
controls2.addEventListener('change', onControlsChange2);

// Event handler for changes in controls1
function onControlsChange1() {
  camera2.copy(camera1);
  camera2.updateProjectionMatrix();
}

// Event handler for changes in controls2
function onControlsChange2() {
  camera1.copy(camera2);
  camera1.updateProjectionMatrix();
}

// Update function for rendering the scenes
function update() {
  controls1.update();
  renderer1.render(scene1, camera1);

  controls2.update();
  renderer2.render(scene2, camera2);

  requestAnimationFrame(update);
}

// Start the rendering loop
update();
```

<br>

In this example, we create two separate scenes (`scene1` and `scene2`) with their respective cameras (`camera1` and `camera2`). Each scene has its own renderer (`renderer1` and `renderer2`) and `OrbitControls` instance (`controls1` and `controls2`).

We add event listeners to both `controls1` and `controls2` for the `'change'` event, which fires whenever there is a change in the controls' state (such as zooming or panning).

Inside the event handlers (`onControlsChange1` and `onControlsChange2`), we synchronize the camera zoom level between the two scenes. When there is a change in `controls1`, we update `camera2` to match `camera1` by copying its properties and updating the projection matrix. Similarly, when there is a change in `controls2`, we update `camera1` to match `camera2`.

The `update` function is responsible for rendering the scenes. It updates both `controls1` and `controls2`, renders the scenes using their respective cameras and renderers, and recursively calls itself for smooth animation.

Please note that this example assumes you have already set up the necessary configuration for the scenes, cameras, and renderers (not shown in the code). Make sure to replace the placeholder comments (`// ... Set up renderer, camera, and other necessary configurations for scene1/scene2`) with your actual setup code for each scene.

<br>

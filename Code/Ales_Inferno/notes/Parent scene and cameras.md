## Parent scene and cameras

<span style="color:#0000dd;">I have a three.js script that creates 4 scenes and cameras. It creates a parent scene and adds the scenes to it.  Then it creates a target object to control the camera.  But then, we create OrbitControls for each scene.  Can you please explain why we need a parent scene?</span>

Sure! I'll explain it in a simple way.

Imagine you have a big box that contains four smaller boxes inside it. The big box is like the parent scene, and the smaller boxes are the individual scenes. The parent scene holds everything together and helps organize the smaller scenes.

Now, **why do we need this parent scene?** Well, think of it as a way to manage and control the smaller scenes more easily. It allows us to treat all the scenes as a single entity and perform certain actions on them collectively.

For example, let's say you want to move or rotate all the smaller scenes at once. Instead of having to manipulate each individual scene separately, you can just manipulate the parent scene, and all the smaller scenes will move or rotate accordingly. It simplifies the process and makes it more efficient.

In addition to the parent scene, we also have cameras to view each individual scene. Think of cameras as your eyes that let you see what's happening inside each scene. But there's a catch! We want to control the cameras in an easy and consistent way. That's where OrbitControls come into play.

OrbitControls is a tool that helps us move and interact with the cameras. It allows us to rotate the camera around a target object (like a point of interest) and zoom in or out. By attaching OrbitControls to each camera, we can navigate and explore each scene more easily.

So, to sum it up, the parent scene **helps organize and manage** multiple scenes together, while cameras and OrbitControls allow us to view and interact with each scene effectively.

## Thinking...

<span style="color:#0000dd;">But essentially, isn't this like adding 4 objects to a scene and having one camera and one OrbitControls to move them?  Or - does having the 4 scenes, 4 cameras, and one parent scene give me flexibility.  For example, I don't want to zoom in and out of the entire thing, as with 1 scene.  I want the 4 objects to be stationary, and we zoom in and out of the scene, but all the other scenes zoom in and out too.  Is that right?</span>

Yes, you're correct! Having the four scenes, four cameras, and one parent scene gives you flexibility and allows you to have **individual control over each scene** while also having the option to **control them collectively.**

In your example, if you want the four objects to remain **stationary** and zoom in and out of the entire scene, you can achieve that with the **parent scene setup.** By attaching OrbitControls to the parent scene's camera, you can control the zooming in and out of the entire scene, including all the individual scenes within it.

This means that when you zoom in or out, all four scenes will appear to zoom in or out together because they are part of the parent scene. It provides a consistent zooming experience across all the scenes, maintaining their relative positions and scales.

However, it's important to note that although the objects within the scenes may appear to zoom in and out together, you can still manipulate each individual scene separately if needed. You have the flexibility to modify or interact with each scene independently, such as moving objects within a specific scene or applying unique effects.

So, by having the parent scene, multiple scenes, multiple cameras, and OrbitControls, you gain the ability to **control** the entire scene as a whole while retaining the flexibility to manipulate each scene individually when necessary.

## Example

<span style="color:#0000dd;">Can you give me a code example of being able to zoom in and out of all 4 scenes together and also separately?  Do I toggle a switch?  How do I do this?</span>

Certainly! To achieve the desired functionality of being able to zoom in and out of all four scenes together or separately, you can use a **combination** of **toggling** and **controlling the cameras.**

```html
<button id="zoom-toggle">Zoom Toggle</button>
```

```javascript
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

// Create a parent scene
const parentScene = new THREE.Scene();

// Create individual scenes and cameras
const scene1 = new THREE.Scene();
scene1.background = new THREE.Color("#ff0088");
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 1, 1000);
camera1.position.z = 5;

const scene2 = new THREE.Scene();
scene2.background = new THREE.Color("#880088");
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 1, 1000);
camera2.position.z = 5;

const scene3 = new THREE.Scene();
scene3.background = new THREE.Color("#00ffff");
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 1, 1000);
camera3.position.z = 5;

const scene4 = new THREE.Scene();
scene4.background = new THREE.Color("#0000ff");
const camera4 = new THREE.PerspectiveCamera(75, window.innerWidth / innerHeight, 1, 1000);
camera4.position.z = 5;

// Add scenes to the parent scene
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// Create meshes
const arr = [scene1, scene2, scene3, scene4];
for (let i = 0; i < arr.length; i++) {
  let material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let cube = new THREE.Mesh(geometry, material);
  arr[i].add(cube);
}

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create OrbitControls for each camera
const controls1 = new OrbitControls(camera1, renderer.domElement);
const controls2 = new OrbitControls(camera2, renderer.domElement);
const controls3 = new OrbitControls(camera3, renderer.domElement);
const controls4 = new OrbitControls(camera4, renderer.domElement);

// Toggle variable to switch between collective and individual zooming
let collectiveZoom = true;

// Function to handle zooming behavior
function handleZoom(event) {
  if (collectiveZoom) {
    // Zoom all cameras collectively
    camera1.zoom += event.deltaY * 0.001;
    camera2.zoom += event.deltaY * 0.001;
    camera3.zoom += event.deltaY * 0.001;
    camera4.zoom += event.deltaY * 0.001;
  } else {
    // Zoom each camera separately
    controls1.zoom(event);
    controls2.zoom(event);
    controls3.zoom(event);
    controls4.zoom(event);
  }
}

// Event listener for mouse wheel zooming
document.addEventListener("wheel", handleZoom);

// Function to toggle collective and individual zooming
function toggleZoomMode() {
  collectiveZoom = !collectiveZoom;
}

// Example usage: Press a button to toggle zooming mode
const zoomToggleButton = document.getElementById("zoom-toggle");
zoomToggleButton.addEventListener("click", toggleZoomMode);

(function animLoop() {
  requestAnimationFrame(animLoop);

  controls1.update();
  controls2.update();
  controls3.update();
  controls4.update();

  renderer.render(scene1, camera1);
  renderer.render(scene2, camera2);
  renderer.render(scene3, camera3);
  renderer.render(scene4, camera4);
})();
```

<br>

In this example, we start with the **default behavior of collective zooming.** When you scroll the mouse wheel, the `handleZoom` function is triggered. If `collectiveZoom` is set to `true`, it adjusts the `zoom` property of all the cameras equally, effectively zooming in or out of all four scenes together.

However, if `collectiveZoom` is set to `false`, it calls the `zoom` function on each individual `OrbitControls` instance, allowing you to zoom each scene separately.

To **toggle** between collective and individual zooming, you can use a button (in this case, with the id `"zoom-toggle"`). When the button is clicked, the `toggleZoomMode` function is called, which flips the value of `collectiveZoom`, changing the zooming behavior.

## 1 Renderer

<span style="color:#0000dd;">Can you explain why, in your example, we are using 1 renderer (as opposed to 4 renderers).  Because we have one parent scene?</span>

Yes, in the example provided, we are using a single renderer instead of four renderers because we have **one parent scene** that contains all the individual scenes.

The renderer in three.js is responsible for rendering the scenes and their respective cameras onto the screen or a specific rendering target, such as a WebGL canvas. It handles the process of **converting the 3D scene data into a 2D image** that can be displayed.

In this case, since all four scenes are part of the parent scene, **they share the same renderer.** The parent scene represents the overall scene that encompasses the individual scenes within it. When we render the parent scene using the shared renderer, it automatically takes care of rendering all the child scenes as well.

Using a single renderer has several advantages:

1. **Performance:** Using multiple renderers can be computationally expensive, as each renderer requires its own set of resources and computations. By using a single renderer, we can optimize performance and reduce overhead.

2. **Consistency:** Having a shared renderer ensures that all scenes are rendered together using the same rendering settings, such as lights, shaders, or post-processing effects. This helps maintain a consistent visual appearance across all scenes.

3. **Simplified management:** With a single renderer, you only need to handle one instance for rendering. It simplifies the management and organization of the rendering process, making it easier to set up and maintain.

That said, there might be scenarios where you'd want to use separate renderers, such as when you need different rendering configurations or want to render scenes independently. However, in the context of your requirement, where the four scenes are closely related and need to be rendered together or separately, a single renderer tied to the parent scene provides a **straightforward and efficient solution.**

## Camera?

<span style="color:#0000dd;">OK.  In your example, when I call "renderer.render(...)" which camera do I put as the 2nd argument?</span>

In the example provided, when calling `renderer.render(...)`, you would typically pass the camera associated with the view you want to render as the second argument.

Since you have four individual scenes and cameras in this setup, you have the flexibility to choose which camera you want to use for rendering at any given moment. The choice depends on your specific requirements and desired view.

For example, if you want to render the parent scene and view the entire composition of all four scenes together, you can pass any of the four cameras associated with the scenes as the second argument. It could be `camera1`, `camera2`, `camera3`, or `camera4`.

Here's an example of rendering the parent scene using `camera1`:

```javascript
renderer.render(parentScene, camera1);
```

<br>

This will render the parent scene from the perspective of `camera1`, resulting in the combined view of all the scenes.

Alternatively, if you want to render an individual scene, you can pass the corresponding camera associated with that scene. For instance, to render `scene3` from the perspective of `camera3`, you would do:

```javascript
renderer.render(scene3, camera3);
```

<br>

In summary, when calling `renderer.render(...)`, you can choose any camera associated with the desired scene or composition you want to render, depending on the view you want to achieve.

## Parent Camera?

<span style="color:#0000dd;">That being said... should we have created a parentCamera, or no?</span>

In the example provided, a `parentCamera` was not explicitly created because the focus was on rendering individual scenes with their respective cameras and controlling them separately or collectively.

However, if you have a specific use case where you want to create a parent camera that encompasses the view of all four scenes, you can certainly do so. Creating a `parentCamera` can be useful if you want to have a unified camera control to manipulate the view of the entire composition.

To create a `parentCamera`, you can use one of the available camera types in three.js, such as `PerspectiveCamera` or `OrthographicCamera`, and set it up accordingly. The position, field of view, aspect ratio, and other properties can be adjusted to encompass the desired view of the four scenes.

Here's an example of creating a `parentCamera` using `PerspectiveCamera`:

```javascript
const parentCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
parentCamera.position.set(x, y, z);
// Adjust other camera properties as needed
```

<br>

With a `parentCamera` in place, you can use it to render the parent scene and have control over the collective view of all four scenes. When calling `renderer.render(...)`, you would pass the `parentScene` and the `parentCamera` as arguments.

```javascript
renderer.render(parentScene, parentCamera);
```

<br>

This way, the `parentCamera` will determine the view and perspective of the combined scenes.

Creating a `parentCamera` provides you with the ability to have a unified control over the overall composition. It allows you to manipulate the camera position, rotation, and other properties to affect the view of all four scenes simultaneously.

## Black Screen

If you set a color for each scene but are seeing a black screen, there might be a few reasons for this:

Check that you have proper **lighting** in your scene. If the scenes are not properly lit, they may appear black. You can add light sources like `THREE.AmbientLight`, `THREE.DirectionalLight`, or `THREE.PointLight` to illuminate the scenes. Experiment with different types of lights and their positions to achieve the desired lighting effect.

Confirm that the **camera is positioned** correctly to see the objects in the scene. If the camera is not placed properly, it may be looking in the wrong direction or away from the objects. Adjust the camera's position and direction to ensure that it is focused on the objects in each scene.

## No objects on screen

The **cube geometry** and **mesh** are being added to multiple scenes. Currently, you're adding the same cube to `scene1`, `scene2`, `scene3`, and `scene4`. However, <mark>**a single mesh instance can only be added to one scene at a time.**</mark>

Also, make sure the cameras are positioned.

You need to create separate cube instances for each scene to display them correctly.

```javascript
let geometry1 = new THREE.BoxGeometry(1, 1, 1);
let cube1 = new THREE.Mesh(geometry1, material);
scene1.add(cube1);

let geometry2 = new THREE.BoxGeometry(1, 1, 1);
let cube2 = new THREE.Mesh(geometry2, material);
scene2.add(cube2);

let geometry3 = new THREE.BoxGeometry(1, 1, 1);
let cube3 = new THREE.Mesh(geometry3, material);
scene3.add(cube3);

let geometry4 = new THREE.BoxGeometry(1, 1, 1);
let cube4 = new THREE.Mesh(geometry4, material);
scene4.add(cube4);
```

<br>

## I'm still not seeing cubes on the screen, and I'm still getting that error.

1) Ya gotta set the position of each scene and camera!

```js
camera.position.z = 5;
```

2) Remember to call the `controls.update()` function in the animation loop, right before `render()`:

```javascript
controls1.update();
controls2.update();
controls3.update();
controls4.update();
```

<br>

3) For zooming using `OrbitControls`, you need to call [God knows what].

Now, the `whatever` method of `OrbitControls` is used to zoom out **when the toggle is not active.**

After applying these changes, your code should look like this:

```javascript
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const parentScene = new THREE.Scene();
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 1000;

const scene1 = new THREE.Scene();
scene1.background = new THREE.Color("#ff0088");
const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera1.position.z = 5;

const scene2 = new THREE.Scene();
scene2.background = new THREE.Color("#880088");
const camera2 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera2.position.z = 5;

const scene3 = new THREE.Scene();
scene3.background = new THREE.Color("#00ffff");
const camera3 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera3.position.z = 5;

const scene4 = new THREE.Scene();
scene4.background = new THREE.Color("#0000ff");
const camera4 = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera4.position.z = 5;

parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

let geometry1 = new THREE.BoxGeometry(1, 1, 1);
let cube1 = new THREE.Mesh(geometry1, material);
scene1.add(cube1);

let geometry2 = new THREE.BoxGeometry(1, 1, 1);
let cube2 = new THREE.Mesh(geometry2, material);
scene2.add(cube2);

let geometry3 = new THREE.BoxGeometry(1, 1, 1);
let cube3 = new THREE.Mesh(geometry3, material);
scene3.add(cube3);

let geometry4 = new THREE.BoxGeometry(1, 1, 1);
let cube4 = new THREE.Mesh(geometry4, material);
scene4.add(cube4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls1 = new OrbitControls(camera1, renderer.domElement);
const controls2 = new OrbitControls(camera2, renderer.domElement);
const controls3 = new OrbitControls(camera3, renderer.domElement);
const controls4 = new OrbitControls(camera4, renderer.domElement);

let collectiveZoom = true;

function handleZoom(event) {
  if (collectiveZoom) {
    camera1.zoom += event.deltaY * 0.001;
    camera2.zoom += event.deltaY * 0.001;
    camera3.zoom += event.deltaY * 0.001;
    camera4.zoom += event.deltaY * 0.001;
  } else {
    // TODO: This is just plain wrong.
    controls1.zoomOut(event.deltaY);
    controls2.zoomOut(event.deltaY);
    controls3.zoomOut(event.deltaY);
    controls4.zoomOut(event.deltaY);
  }
}

document.addEventListener("wheel", handleZoom);

function toggleZoomMode() {
  collectiveZoom = !collectiveZoom;
}

const zoomToggleButton = document.getElementById("zoom-toggle");
zoomToggleButton.addEventListener("click", toggleZoomMode);

function render() {
  renderer.render(scene1, camera1);
  renderer.render(scene2, camera2);
  renderer.render(scene3, camera3);
  renderer.render(scene4, camera4);
}

(function animLoop() {
  requestAnimationFrame(animLoop);
  controls1.update();
  controls2.update();
  controls3.update();
  controls4.update();
  render();
})();
```

<br>

[Three.js OrbitControls.js - invoking zoom in/out with button - controls.dollyOut() is not a function](https://stackoverflow.com/questions/39856907/three-js-orbitcontrols-js-invoking-zoom-in-out-with-button-controls-dollyout)

[OrbitControls: Added public methods to pan, rotate and dolly camera](https://github.com/mrdoob/three.js/pull/9005/files)

By using the `dollyOut` method, you can achieve the zooming effect for **each individual scene** when the **toggle is not active.**

I tried this, but it didn't like whichever "super". But the IDE liked it, so.

```js
class CustomOrbitControls extends OrbitControls {
  constructor(camera, domElement) {
    super(camera, domElement);
    this.dollyIn = function (zoomScale) {
      super.dollyIn(zoomScale);
      super.scope.update();
    };

    this.dollyOut = function (zoomScale) {
      super.dollyOut(zoomScale);
      super.scope.update();
    };
  }
}

const controls1 = new CustomOrbitControls(camera1, renderer.domElement);
const controls2 = new CustomOrbitControls(camera2, renderer.domElement);
const controls3 = new CustomOrbitControls(camera3, renderer.domElement);
const controls4 = new CustomOrbitControls(camera4, renderer.domElement);
```

## 4th scene

<span style="color:#0000dd;">OK!  I think that helped.  I see what the problem is now.  Now, it's only rendering the 4th scene.  Do we have to position the cubes?  Or position the scenes within the parent?  Or something?  In order to see all 4 scenes.</span>

Great! I'm glad that helped. Now, regarding the issue where only the 4th scene is rendering, the problem lies in the **positioning of the cameras.**

By default, the cameras are positioned at the same coordinates **(0, 0, 0)** in the parent scene. Therefore, when rendering each scene with its respective camera, they all **render from the same position**, resulting in only the last scene being visible.

To address this, you need to **position the cameras and the scenes** within the parent scene so that they are not overlapping. You can modify the positions of the cameras and scenes to achieve the desired arrangement.

Update the **camera positions:**

```javascript
camera1.position.set(0, 0, 5); // Move camera1 along the z-axis
camera2.position.set(0, 0, -5); // Move camera2 along the negative z-axis
camera3.position.set(5, 0, 0); // Move camera3 along the x-axis
camera4.position.set(-5, 0, 0); // Move camera4 along the negative x-axis
```

<br>

Adjust the **positions of the scenes** within the parent scene.

```javascript
scene1.position.set(0, 0, 5); // Move scene1 along the z-axis
scene2.position.set(0, 0, -5); // Move scene2 along the negative z-axis
scene3.position.set(5, 0, 0); // Move scene3 along the x-axis
scene4.position.set(-5, 0, 0); // Move scene4 along the negative x-axis
```

<br>

## The scissor section

```js
renderer.setViewport(0, 0, window.innerWidth / 2, window.innerHeight);
```

<br>
<span style="color:#0000dd;">I asked him to spell this out because something's not quite right in Denmark.</span>

This line sets the viewport for the first scene and camera. The **viewport** defines the portion of the **renderer's output canvas** (the window where the graphics are displayed) that the scene will occupy.

In this case, we're setting the viewport to start from the **leftmost side (0)** of the canvas, **at the top (0)** of the canvas.

And have a **width** equal to half (`window.innerWidth / 2`) of the canvas's total width. The **height** is set to match the full height (`window.innerHeight`) of the canvas.

<span style="color:#0000dd;">And that's why it's messed up.</span>

```js
renderer.setViewport(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
```

This line sets the viewport for the second scene and camera. Similar to the previous line, we're setting the viewport to start from the **middle of the canvas** horizontally (`window.innerWidth / 2`), **at the top (0)** of the canvas, and have a width equal to half of the canvas's total width. The height is set to match the full height of the canvas.

```js
renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
```

This line sets the viewport for the third scene and camera. Here, we're setting the viewport to cover the entire canvas.

<span style="color:#0000dd;">¿Por qué? ¿Cuán estúpido puedes llegar a ser?</span>

The viewport starts at the **leftmost side (0)** of the canvas, at the **top (0)** of the canvas, and has a width equal to the full width (`window.innerWidth`) of the canvas. The height is set to match the full height of the canvas.

```js
renderer.setViewport(window.innerWidth / 2, window.innerHeight / 2, window.innerWidth / 2, window.innerHeight / 2);
```

This line sets the viewport for the fourth scene and camera. We're placing the viewport in the **bottom-right** quadrant of the canvas.

The viewport starts from the **middle** of the canvas **horizontally** (`window.innerWidth / 2`) and the middle of the canvas **vertically** (`window.innerHeight / 2`). The width and height are both set to half of the canvas's total width and height, respectively. <span style="color:#0000dd;">Finally correct!</span>

By setting different viewports for each scene and camera, we can ensure that each scene is rendered in its designated area of the canvas. This allows us to display multiple scenes simultaneously within the same window.

## Conclusion

I ended up doing my own fixes.

## Multiple OrbitControls Affect Cameras

Based on the code snippet you provided, it seems like you are using separate instances of OrbitControls (`controls1`, `controls2`, etc.) for each camera. The issue you are facing is that when you try to individually control a single camera's OrbitControls, all the cameras' controls are being affected.

To resolve this issue, you need to disable the controls for the cameras that you don't want to be affected when you are in individual mode. Here's how you can modify your code:

```javascript
function handleZoom(event) {
  if (collectiveZoom) {
    console.log("collective");
    // Zoom all cameras collectively
    camera1.zoom += event.deltaY * 0.001;
    camera2.zoom += event.deltaY * 0.001;
    camera3.zoom += event.deltaY * 0.001;
    camera4.zoom += event.deltaY * 0.001;
  } else {
    console.log("individual");
    if (camera1Active) {
      controls1.dollyOut(event.deltaY);
      controls1.dollyIn(event.deltaX);
    } else if (camera2Active) {
      controls2.dollyOut(event.deltaY);
      controls2.dollyIn(event.deltaX);
    } else if (camera3Active) {
      controls3.dollyOut(event.deltaY);
      controls3.dollyIn(event.deltaX);
    } else if (camera4Active) {
      controls4.dollyOut(event.deltaY);
      controls4.dollyIn(event.deltaX);
    }
  }
}
```

In the above code, I assume that you have some variables (`camera1Active`, `camera2Active`, etc.) that determine which camera's controls are active at a given time. You need to set the appropriate variable to `true` before calling `handleZoom()` to indicate which camera's controls should be affected.

Make sure to replace `camera1Active`, `camera2Active`, etc. with the actual variables or logic that determines the active camera.

<span style="color:#0000dd;">Right, that makes sense.  I ran the code, as is, with only camera1Active set to true.  But still - all 4 cameras move the same, regardless of whether I'm in individual mode or not.  Is it because I have a parent scene?</span>

The issue might be related to how you're handling the camera controls in your code. Instead of using separate instances of OrbitControls for each camera, you can try using a single instance of OrbitControls and assign it to the active camera dynamically.

<br>

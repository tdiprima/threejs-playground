## Parent scene and cameras

<span style="color:#0000dd;">I have a three.js script that creates 4 scenes and cameras. It creates a parent scene and adds the scenes to it.  Then it creates a target object to control the camera.  But then, we create OrbitControls for each scene.  Can you please explain why we need a parent scene?</span>

Sure! I'll explain it in a simple way.

Imagine you have a big box that contains four smaller boxes inside it. The big box is like the parent scene, and the smaller boxes are the individual scenes. The parent scene holds everything together and helps organize the smaller scenes.

Now, why do we need this parent scene? Well, think of it as a way to manage and control the smaller scenes more easily. It allows us to treat all the scenes as a single entity and perform certain actions on them collectively.

For example, let's say you want to move or rotate all the smaller scenes at once. Instead of having to manipulate each individual scene separately, you can just manipulate the parent scene, and all the smaller scenes will move or rotate accordingly. It simplifies the process and makes it more efficient.

In addition to the parent scene, we also have cameras to view each individual scene. Think of cameras as your eyes that let you see what's happening inside each scene. But there's a catch! We want to control the cameras in an easy and consistent way. That's where OrbitControls come into play.

OrbitControls is a tool that helps us move and interact with the cameras. It allows us to rotate the camera around a target object (like a point of interest) and zoom in or out. By attaching OrbitControls to each camera, we can navigate and explore each scene more easily.

So, to sum it up, the parent scene helps organize and manage multiple scenes together, while cameras and OrbitControls allow us to view and interact with each scene effectively.

## Thinking...

<span style="color:#0000dd;">But essentially, isn't this like adding 4 objects to a scene and having one camera and one OrbitControls to move them?  Or - does having the 4 scenes, 4 cameras, and one parent scene give me flexibility.  For example, I don't want to zoom in and out of the entire thing, as with 1 scene.  I want the 4 objects to be stationary, and we zoom in and out of the scene, but all the other scenes zoom in and out too.  Is that right?</span>

Yes, you're correct! Having the four scenes, four cameras, and one parent scene gives you flexibility and allows you to have individual control over each scene while also having the option to control them collectively.

In your example, if you want the four objects to remain stationary and zoom in and out of the entire scene, you can achieve that with the parent scene setup. By attaching OrbitControls to the parent scene's camera, you can control the zooming in and out of the entire scene, including all the individual scenes within it.

This means that when you zoom in or out, all four scenes will appear to zoom in or out together because they are part of the parent scene. It provides a consistent zooming experience across all the scenes, maintaining their relative positions and scales.

However, it's important to note that although the objects within the scenes may appear to zoom in and out together, you can still manipulate each individual scene separately if needed. You have the flexibility to modify or interact with each scene independently, such as moving objects within a specific scene or applying unique effects.

So, by having the parent scene, multiple scenes, multiple cameras, and OrbitControls, you gain the ability to control the entire scene as a whole while retaining the flexibility to manipulate each scene individually when necessary.

## Example

<span style="color:#0000dd;">Can you give me a code example of being able to zoom in and out of all 4 scenes together and also separately?  Do I toggle a switch?  How do I do this?</span>

Certainly! To achieve the desired functionality of being able to zoom in and out of all four scenes together or separately, you can use a combination of toggling and controlling the cameras. Here's a simplified code example using three.js:

```javascript
// Create a parent scene
const parentScene = new THREE.Scene();

// Create individual scenes and cameras
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(/* camera parameters */);
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(/* camera parameters */);
const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(/* camera parameters */);
const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(/* camera parameters */);

// Add scenes to the parent scene
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// Create OrbitControls for each camera
const controls1 = new THREE.OrbitControls(camera1, renderer.domElement);
const controls2 = new THREE.OrbitControls(camera2, renderer.domElement);
const controls3 = new THREE.OrbitControls(camera3, renderer.domElement);
const controls4 = new THREE.OrbitControls(camera4, renderer.domElement);

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
```

<br>

In this example, we start with the default behavior of collective zooming. When you scroll the mouse wheel, the `handleZoom` function is triggered. If `collectiveZoom` is set to `true`, it adjusts the `zoom` property of all the cameras equally, effectively zooming in or out of all four scenes together.

However, if `collectiveZoom` is set to `false`, it calls the `zoom` function on each individual `OrbitControls` instance, allowing you to zoom each scene separately.

To toggle between collective and individual zooming, you can use a button (in this case, with the id `"zoom-toggle"`). When the button is clicked, the `toggleZoomMode` function is called, which flips the value of `collectiveZoom`, changing the zooming behavior.

You can customize this example further to suit your specific needs, such as adding buttons or UI elements for individual scene controls or modifying the zooming behavior.

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

## Dos.

<span style="color:#0000dd;">I have 2 questions: 1) When I click the "zoom-toggle" button, and then try to zoom in, it says "controls1.zoom is not a function." 2) I set a color for each scene.  But all I'm seeing is a black screen.  Why?</span>

1) Regarding the error "controls1.zoom is not a function," it seems like there might be an issue with how the `controls1` variable is assigned. Please make sure that you have properly instantiated the `OrbitControls` for `camera1` and assigned it to `controls1`. Double-check that the `OrbitControls` script is included in your HTML file and loaded before your JavaScript code.

Here's an example of how the `controls1` variable should be assigned:

```javascript
const controls1 = new THREE.OrbitControls(camera1, renderer.domElement);
```

<br>

Make sure you have a similar line for each `OrbitControls` instance corresponding to the respective camera.

<span style="color:red;">What about the Camera?  Ohh...</span>

```js
const camera1 = new THREE.PerspectiveCamera(/* camera parameters */);

// So then:
const fov = 45; // Camera frustum vertical field of view.
const aspect = window.innerWidth / window.innerHeight; // Camera frustum aspect ratio.
const near = 1; // Camera frustum near plane.
const far = 1000; // Camera frustum far plane.

const camera1 = new THREE.PerspectiveCamera(fov, aspect, near, far);
```

<br>

2) If you set a color for each scene but are seeing a black screen, there might be a few reasons for this:

- Check that you have proper lighting in your scene. If the scenes are not properly lit, they may appear black. You can add light sources like `THREE.AmbientLight`, `THREE.DirectionalLight`, or `THREE.PointLight` to illuminate the scenes. Experiment with different types of lights and their positions to achieve the desired lighting effect.

- Verify that the materials applied to the objects in your scenes have the correct colors. Ensure that you have set the `color` property of the materials correctly. For example, you can create a basic material with a specific color like this:

  ```javascript
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
  ```

  Apply this material to the objects in each scene to ensure that the colors are visible.

- Confirm that the camera is positioned correctly to see the objects in the scene. If the camera is not placed properly, it may be looking in the wrong direction or away from the objects. Adjust the camera's position and direction to ensure that it is focused on the objects in each scene.

By addressing these potential issues, you should be able to resolve the problem of seeing a black screen and ensure that the colors in each scene are displayed correctly.

<br>


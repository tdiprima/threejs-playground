## Zooming in on a Corner

<span style="color:#0000dd;">What if I wanted to zoom into a corner, into a region of interest?  Can I hover the mouse over the corner and zoom in and out?</span>

By default, the OrbitControls in Three.js is designed to zoom in and out **based on the center of the scene.**

However, you can achieve the effect of zooming into a specific region or corner of the scene by modifying the controls' behavior.

You can **adjust the target of the controls** to focus on the desired region.

The target represents the point in the scene that the camera is looking at.

By changing the target, you can make the camera orbit around a specific point.

```javascript
// Create OrbitControls and attach them to the camera
let controls = new THREE.OrbitControls(camera, renderer.domElement);

// Set the initial target of the controls to the center of the scene
controls.target.set(0, 0, 0);

// Add an event listener to detect mouse hover on the region of interest, and update the controls' target accordingly
yourRegionOfInterest.addEventListener('mousemove', (event) => {
  // Convert the mouse coordinates to normalized device coordinates (NDC)
  let mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use a raycaster to determine the 3D position of the mouse in the scene
  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Find the intersection point of the ray with your region of interest
  let intersects = raycaster.intersectObject(yourRegionOfInterest, true);

  if (intersects.length > 0) {
    // Set the controls' target to the intersection point
    controls.target.copy(intersects[0].point);
  }
});
```

In this example, we set the initial target of the controls to the center of the scene.

Then, when the mouse hovers over the region of interest, we update the controls' target to the intersection point of the ray from the camera with the region.

This causes the camera to orbit around the region of interest when zooming in and out.

<mark>Close!  The mouse movement "pushes" the image away, though.</mark>

Note that `yourRegionOfInterest` is an example variable representing the object or area in your scene that you want to zoom into.

## Zoom to Any Corner

To achieve the desired behavior of zooming into the corner of the image that the mouse is hovering over, you can modify the code as follows:

1. Add a listener for the `wheel` event on the renderer's DOM element.
2. Calculate the normalized device coordinates (NDC) of the mouse position within the renderer.
3. Calculate the world position corresponding to the NDC coordinates.
4. Update the camera's position to zoom towards the calculated world position.

```javascript
// zoom1.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let imgSrc = "/images/happy.JPG";
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let control = new OrbitControls(camera, renderer.domElement);

let planeGeom = new THREE.PlaneGeometry(3, 3);
let mesh;
let tex = new THREE.TextureLoader().load(imgSrc, (tex) => {
  tex.needsUpdate = true;
  mesh.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
});
let material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
mesh = new THREE.Mesh(planeGeom, material);
scene.add(mesh);

// Calculate the world position from normalized device coordinates
function getWorldPosition(clientX, clientY) {
  let mouse = new THREE.Vector2();
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObject(mesh);
  if (intersects.length > 0) {
    return intersects[0].point;
  }

  return null;
}

// Update the camera's position to zoom towards the given world position
function zoomToPosition(position) {
  if (position) {
    let zoomFactor = 0.1; // Adjust this value to control the zoom speed
    let currentPosition = camera.position.clone();
    let targetPosition = position.clone();
    currentPosition.lerp(targetPosition, zoomFactor);
    camera.position.copy(currentPosition);
  }
}

// Listen for the wheel event and zoom towards the mouse position
renderer.domElement.addEventListener("wheel", (event) => {
  let mousePosition = new THREE.Vector2(event.clientX, event.clientY);
  let worldPosition = getWorldPosition(mousePosition.x, mousePosition.y);
  zoomToPosition(worldPosition);
});

(function animate() {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
})();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);
```

<br>

When you scroll the mouse wheel, the camera will zoom towards the corner of the image that the mouse is hovering over.

Adjust the `zoomFactor` value in the `zoomToPosition` function to control the speed of the zoom.

## Flipping issue

<span style="color:#0000dd;">It flipped the image on its side, and now I can't see anything.</span>

It seems that the image is flipped because we're calculating the **world position** based on the **intersection point** with the plane, but we didn't take into account the orientation of the plane geometry.

We need to calculate the world position based on the UV coordinates of the mouse position on the plane geometry.

```javascript
// zoom1.js - Calculate the world position from UV coordinates
function getWorldPosition(u, v) {
  let planeNormal = new THREE.Vector3(0, 0, 1);
  let planePoint = new THREE.Vector3(0, 0, 0);
  let raycaster = new THREE.Raycaster();

  let origin = new THREE.Vector3(u, v, -1).unproject(camera);
  let direction = origin.clone().sub(camera.position).normalize();

  raycaster.set(origin, direction);
  let intersects = raycaster.intersectObject(mesh); // todo: shouldn't intersects be global?

  if (intersects.length > 0) {
    let intersectionPoint = intersects[0].point;
    let distance = intersectionPoint.distanceTo(planePoint);
    let directionVector = new THREE.Vector3().subVectors(intersectionPoint, camera.position).normalize();
    return camera.position.clone().addScaledVector(directionVector, distance);
  }

  return null;
}

// Listen for the wheel event and zoom towards the mouse position
renderer.domElement.addEventListener("wheel", (event) => {
  let mousePosition = new THREE.Vector2(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
  // etc.
});
```

## GSAP?

### SketchFab-like zooming/flying capability to the annotations

Can someone help me understand the ability to fly on annotations.
What method/function should I use to achieve zoom/fly ability on annotation click.
When I click on an annotation view it should take me to that annotation view.

Please suggest method.

Thanks for solving in post 2 by Mugen87.
You can achieve a similar effect by animating the camera with GSAP.
Check out this simple demo that demonstrates this approach: https://jsfiddle.net/a6qzkf4b/

The relevant code part is:

```javascript
// define focus
pointcontrols.target.set(0, 0, 0);
// animate camera position
gsap.to(camera.position, {
  duration: 2,
  x: 0,
  y: 10,
  z: 20,
  onUpdate: function() {
    controls.update();
  }
});
```

Indicates that you define the new position of the camera and call the control's `update()` method.

When starting the animation, you must also set the control's new focus.

## FocusPoint?

**"three.js-focus-point"** can facilitate zooming into a specific region or point of interest.
This plugin allows you to set a focus point for the camera, and the zooming and panning operations will revolve around that point.

```html
<script src="https://threejs.org/build/three.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three.js-focus-point/dist/three.js-focus-point.min.js"></script>
```

```javascript
// Create FocusPointControls and attach them to the camera
let controls = new THREE.FocusPointControls(camera, renderer.domElement);

// Set the initial focus point of the controls
controls.focusPoint.set(x, y, z); // Replace x, y, z with the coordinates of your desired focus point

// Optionally, you can customize the controls' behavior and sensitivity:
controls.rotateSpeed = 1.0; // Adjust the rotation speed
controls.zoomSpeed = 1.2; // Adjust the zoom speed
controls.panSpeed = 0.8; // Adjust the panning speed

// Update the controls in your animation/render loop:
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
```

With the "three.js-focus-point" plugin, the **camera will orbit around the focus point** when zooming in and out, providing the effect of zooming into a specific region or corner of the scene.

Repository: [https://github.com/loonghao/three.js-focus-point](https://github.com/loonghao/three.js-focus-point)

**Wayback Machine has not archived that URL.**

Remember to include the necessary scripts and adapt the code according to your specific project setup.

## npm?

```sh
npm install three.js-focus-point
```

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FocusPoint } from 'three.js-focus-point';

let imgSrc = '/images/happy.JPG';
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let control = new OrbitControls(camera, renderer.domElement);

let planeGeom = new THREE.PlaneGeometry(3, 3);
let mesh;
let tex = new THREE.TextureLoader().load(imgSrc, tex => {
  tex.needsUpdate = true;
  mesh.scale.set(1.0, tex.image.height / tex.image.width, 1.0);

  // Create and attach the FocusPoint instance to the mesh
  let focusPoint = new FocusPoint(mesh);
  focusPoint.enableZoom = true;

  // Update the focus point whenever the mouse moves over the mesh
  renderer.domElement.addEventListener('mousemove', event => {
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    let y = -(event.clientY / window.innerHeight) * 2 + 1;
    focusPoint.update(x, y);
  });
});

let material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
mesh = new THREE.Mesh(planeGeom, material);
scene.add(mesh);

(function animate() {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
})();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);
```

We have imported the "FocusPoint" class from the "three.js-focus-point" plugin.
We create an instance of `FocusPoint` and attach it to the `mesh` representing your image. The `enableZoom` property is set to `true`, allowing zooming with the mouse wheel.
The focus point is updated whenever the mouse moves over the image by listening to the `mousemove` event on the renderer's DOM element.
Now you should be able to zoom into any corner of the image by moving your mouse over it. Adjust the camera's position using the OrbitControls as before.

## No plugin

<mark>**Here's an alternative solution that doesn't rely on an external plugin:**</mark>

```javascript
// zoom2.js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let imgSrc = "/images/happy.JPG";
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let control = new OrbitControls(camera, renderer.domElement);

let planeGeom = new THREE.PlaneGeometry(3, 3);
let mesh;
let tex = new THREE.TextureLoader().load(imgSrc, (tex) => {
  tex.needsUpdate = true;
  mesh.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
  updateZoom(tex.image.width, tex.image.height);
});
let material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
mesh = new THREE.Mesh(planeGeom, material);
scene.add(mesh);

// Calculate the normalized device coordinates (NDC) from mouse coordinates
function getNormalizedDeviceCoordinates(clientX, clientY) {
  let x = (clientX / window.innerWidth) * 2 - 1;
  let y = -(clientY / window.innerHeight) * 2 + 1;
  return { x, y };
}

// Calculate the world position from NDC coordinates
function getWorldPositionFromNDC(x, y) {
  let vector = new THREE.Vector3(x, y, 0.5);
  vector.unproject(camera);
  let direction = vector.sub(camera.position).normalize();
  let distance = -camera.position.z / direction.z;
  return camera.position.clone().add(direction.multiplyScalar(distance));
}

// Update the camera's position to zoom towards the given world position
function zoomToPosition(position) {
  if (position) {
    let zoomFactor = 0.1; // Adjust this value to control the zoom speed
    let currentPosition = camera.position.clone();
    let targetPosition = position.clone();
    currentPosition.lerp(targetPosition, zoomFactor);
    camera.position.copy(currentPosition);
  }
}

// Update the zoom behavior when the image size changes
function updateZoom(imageWidth, imageHeight) {
  let aspect = imageWidth / imageHeight;
  let fovY = THREE.MathUtils.degToRad(camera.fov);
  let planeHeight = Math.tan(fovY / 2) * Math.abs(camera.position.z) * 2;
  let planeWidth = planeHeight * aspect;
  planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeight);
  mesh.geometry = planeGeom;
}

// Listen for the wheel event and zoom towards the mouse position
renderer.domElement.addEventListener("wheel", (event) => {
  let mousePosition = getNormalizedDeviceCoordinates(event.clientX, event.clientY);
  let worldPosition = getWorldPositionFromNDC(mousePosition.x, mousePosition.y);
  zoomToPosition(worldPosition);
});

(function animate() {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
})();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);
```

This alternative solution uses the mouse coordinates to calculate the normalized device coordinates (NDC) and then converts them to the world position. The `getNormalizedDeviceCoordinates` function takes the client coordinates of the mouse event and returns the corresponding NDC values.

The `getWorldPositionFromNDC` function converts the NDC values to world position by unprojecting the vector and calculating the intersection with a plane at `z = 0`.

The `zoomToPosition` function updates the camera's position to zoom towards the given world position.

The `updateZoom` function is called when the image size changes, and it updates the plane geometry to match the aspect ratio of the image.

With these modifications, you should be able to zoom into any corner of the image by moving the mouse over it and using the mouse wheel to zoom in and out.

<br>
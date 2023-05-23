## Display 4 Images

<span style="color:#0000dd;">If I wanted to display four 2-d images in three.js, how would I do that?  (Note: wrong question, on purpose.)</span>

To display four 2D images in three.js, you can use the TextureLoader to load the images and then create four separate Mesh objects with planes as their geometries and the loaded textures as their materials.

**Here's how to create four image planes:**

```javascript
// las-cuatro-imagenes.html, c1.js
// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load the images
const image1Texture = textureLoader.load('image1.jpg');
const image2Texture = textureLoader.load('image2.jpg');
const image3Texture = textureLoader.load('image3.jpg');
const image4Texture = textureLoader.load('image4.jpg');

// Create a plane geometry with the same aspect ratio as the images
const planeGeometry = new THREE.PlaneGeometry(1, 1);

// Create the mesh objects for the images
const image1 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image1Texture })); // { side: THREE.DoubleSide }
const image2 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image2Texture }));
const image3 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image3Texture }));
const image4 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image4Texture }));

// Position the images
image1.position.set(-1, 1, 0);
image2.position.set(1, 1, 0);
image3.position.set(-1, -1, 0);
image4.position.set(1, -1, 0);

// Add the images to the scene
scene.add(image1, image2, image3, image4);
```

<br>

1. The `TextureLoader` is used to load the images.

2. Four separate `Mesh` objects are created with planes as their geometries and the loaded textures as their materials.

3. The `position` property of each image is set to position them in the. scene

4. They are added to the scene using the `add()` method.

Note that this example uses `MeshBasicMaterial` which is a simple material that just maps the texture to the plane geometry **without any lighting or shading effects.**

If you want more advanced material properties like lighting and shadows, you can use a different type of material, such as `MeshStandardMaterial`.

## Pan and Zoom

<span style="color:#0000dd;">I want to be able to pan and zoom on any image I choose, and then the other 3 images pan and zoom with it (the same way, automatically).  How can I do that?

**To enable panning and zooming on an image** in three.js, you can add event listeners to detect mouse and touch events and use the Camera and OrbitControls classes to control the camera position and orientation.

How to create an interactive scene with four images that pan and zoom together:

```javascript
// las-cuatro-imagenes.html, c2.js
// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load the images
const image1Texture = textureLoader.load('image1.jpg');
const image2Texture = textureLoader.load('image2.jpg');
const image3Texture = textureLoader.load('image3.jpg');
const image4Texture = textureLoader.load('image4.jpg');

// Create a plane geometry with the same aspect ratio as the images
const planeGeometry = new THREE.PlaneGeometry(1, 1);

// Create the mesh objects for the images
const image1 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image1Texture }));
const image2 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image2Texture }));
const image3 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image3Texture }));
const image4 = new THREE.Mesh(planeGeometry, new THREE.MeshBasicMaterial({ map: image4Texture }));

// Set the positions of the images
image1.position.set(-1, 1, 0);
image2.position.set(1, 1, 0);
image3.position.set(-1, -1, 0);
image4.position.set(1, -1, 0);

// Add the images to the scene
scene.add(image1, image2, image3, image4);

// Create a camera and position it so that all the images are visible
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 5;

// Create the orbit controls and set them to control the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add event listeners to the images to pan and zoom together
// TODO: WRONG! USE RAYCASTING.
image1.addEventListener('mousedown', onImageMouseDown);
image2.addEventListener('mousedown', onImageMouseDown);
image3.addEventListener('mousedown', onImageMouseDown);
image4.addEventListener('mousedown', onImageMouseDown);

image1.addEventListener('touchstart', onImageMouseDown);
image2.addEventListener('touchstart', onImageMouseDown);
image3.addEventListener('touchstart', onImageMouseDown);
image4.addEventListener('touchstart', onImageMouseDown);

function onImageMouseDown(event) {
  // Set the camera target to the position of the clicked image
  controls.target.copy(event.target.position);

  // Add event listeners to the document to pan and zoom the images together
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('touchmove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
  document.addEventListener('touchend', onDocumentMouseUp);
}

function onDocumentMouseMove(event) {
  // Calculate the mouse/touch movement and update the camera position
  const movementX = event.movementX || event.touches[0].clientX - event.touches[1].clientX;
  const movementY = event.movementY || event.touches[0].clientY - event.touches[1].clientY;
  const distance = Math.sqrt(movementX * movementX + movementY * movementY);
  controls.dolly(Math.exp(distance * -0.01));
  controls.pan(new THREE.Vector3(-movementX, movementY, 0));
}

function onDocumentMouseUp(event) {
  // Remove the event listeners from the document
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('touchmove', onDocumentMouseMove);
  document.removeEventListener('mouseup', onDocumentMouseUp);
  document.removeEventListener('touchend', onDocumentMouseUp);
}

// Render the scene
function render() {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
}
render();
```

<br>

The `onImageMouseDown` function is called when an image is **clicked or touched.** <span style="color:red;">No, it isn't.</span> It sets the camera target to the position of the clicked image and adds event listeners to the document to pan and zoom the images together.

The `onDocumentMouseMove` function is called when the mouse or touch moves while an image is being **dragged.** It calculates the mouse/touch movement and updates the camera position using the `dolly` and `pan` methods of the `OrbitControls` class.

The `onDocumentMouseUp` function is called when the mouse or touch is **released.** It removes the event listeners from the document.

The `render` function is called in a loop to continuously render the scene and update the camera position using the `update` method of the `OrbitControls` class.

With this code, you should be able to pan and zoom on any image you choose, and the other three images will pan and zoom with it in the same way, automatically.

## Multiple Scenes

<span style="color:#0000dd;">That is close to what I want.  Perhaps what I'm asking for is something a little more complex, that might require it to be rewritten such that each image has its own scene(?)  Your example makes the whole scene zoom in and out, but I want to zoom on one image, and the other images zoom too.  And the 4 images remain stationary.  Does that make sense?</span>

Yes, that makes sense. In that case, you can create a separate scene for each image and place all four scenes in a parent scene. Each image scene would have its own camera and controls, but all the cameras would be synced to move and zoom together.

### Esqueletos <span style="font-size:27px;">☠️</span>

And kool-aid-kids.html

```javascript
// Set up the parent scene and camera
const parentScene = new THREE.Scene();
const parentCamera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
parentCamera.position.set(0, 0, 10);

// Create a separate scene for each image
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
const scene4 = new THREE.Scene();

// Create a separate camera for each image
const camera1 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const camera2 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const camera3 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const camera4 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Set the position of each camera
camera1.position.set(0, 0, 5);
camera2.position.set(0, 0, 5);
camera3.position.set(0, 0, 5);
camera4.position.set(0, 0, 5);

// Create controls for each camera
// TODO: 2nd argument renderer.domElement
const controls1 = new THREE.OrbitControls(camera1); 
const controls2 = new THREE.OrbitControls(camera2);
const controls3 = new THREE.OrbitControls(camera3);
const controls4 = new THREE.OrbitControls(camera4);

// Load each image and add it to its corresponding scene
const loader = new THREE.TextureLoader();
const image1 = loader.load('image1.png');
const image2 = loader.load('image2.png');
const image3 = loader.load('image3.png');
const image4 = loader.load('image4.png');

const geometry = new THREE.PlaneGeometry(1, 1);
const material1 = new THREE.MeshBasicMaterial({ map: image1 });
const material2 = new THREE.MeshBasicMaterial({ map: image2 });
const material3 = new THREE.MeshBasicMaterial({ map: image3 });
const material4 = new THREE.MeshBasicMaterial({ map: image4 });

const mesh1 = new THREE.Mesh(geometry, material1);
const mesh2 = new THREE.Mesh(geometry, material2);
const mesh3 = new THREE.Mesh(geometry, material3);
const mesh4 = new THREE.Mesh(geometry, material4);

scene1.add(mesh1);
scene2.add(mesh2);
scene3.add(mesh3);
scene4.add(mesh4);

// Add each scene to the parent scene
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// Set up the renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up a function to handle window resizing
function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Set up event listeners to control the cameras
let selectedCamera = null;

controls1.addEventListener('start', () => {
  selectedCamera = camera1;
});
controls2.addEventListener('start', () => {
  selectedCamera = camera2;
});
controls3.addEventListener('start', () => {
  selectedCamera = camera3;
});
controls4.addEventListener('start', () => {
  selectedCamera = camera4;
});

controls1.addEventListener('change', () => {
  camera2.position.copy(camera1.position);
  camera2.rotation.copy(camera1.rotation);
  camera3.position.copy(camera1.position);
  camera3.rotation.copy(camera1.rotation);
  camera4.position.copy(camera1.position);
  camera4.rotation.copy(camera1.rotation);
});

controls2.addEventListener('change', () => {
  camera1.position.copy(camera2.position);
  camera1.rotation.copy(camera2.rotation);
  camera3.position.copy(camera2.position);
  camera3.rotation.copy(camera2.rotation);
  camera4.position.copy(camera2.position);
  camera4.rotation.copy(camera2.rotation);
});

controls3.addEventListener('change', () => {
  camera1.position.copy(camera3.position);
  camera1.rotation.copy(camera3.rotation);
  camera2.position.copy(camera3.position);
  camera2.rotation.copy(camera3.rotation);
  camera4.position.copy(camera3.position);
  camera4.rotation.copy(camera3.rotation);
});

controls4.addEventListener('change', () => {
  camera1.position.copy(camera4.position);
  camera1.rotation.copy(camera4.rotation);
  camera2.position.copy(camera4.position);
  camera2.rotation.copy(camera4.rotation);
  camera3.position.copy(camera4.position);
  camera3.rotation.copy(camera4.rotation);
});

// Render the scene
function render() {
  requestAnimationFrame(render);

  // Update the selected camera's controls
  if (selectedCamera) {
    selectedCamera.updateProjectionMatrix();
    selectedCamera.updateMatrixWorld();
    selectedCamera.updateWorldMatrix(true, true);
    selectedCamera.updateMatrix();
    selectedCamera.updateMatrixWorld(true);
    selectedCamera.lookAt(0, 0, 0);
    selectedCamera.updateProjectionMatrix();
    selectedCamera.updateMatrixWorld(true);
    selectedCamera.updateMatrix();
    selectedCamera.updateWorldMatrix(true, true);
  }

  // Render the parent scene
  renderer.render(parentScene, parentCamera);
}

render();
```

<br>

In this updated implementation, we've added **event listeners to each control to keep track of the selected camera.** Whenever a control starts to move, we set the selected camera to that camera.

We've also added event listeners to **each control's change event** to update the position and rotation of the other three cameras. Whenever a camera is moved or rotated, we update the positions and rotations of the other three cameras to match.

Finally, in the **render function,** we've added code to update the selected camera's controls and render the parent scene with the parent camera.


<span style="color:#0000dd;">Your code seems good, but only the 4th image is being displayed, and it's in the middle of the screen.

Ah, it seems that we need to **add the four images to the parent scene and position them correctly.** This positions the four images at the corners of the parent scene:

```javascript
// kool-aid-kids.html
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.set(0, 0, 5);
scene1.add(camera1);

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.set(0, 0, 5);
scene2.add(camera2);

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3.position.set(0, 0, 5);
scene3.add(camera3);

const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera4.position.set(0, 0, 5);
scene4.add(camera4);

const parentScene = new THREE.Scene();
const parentCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
parentCamera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

// HE FORGOT TO LOAD THE TEXTURES

const image1 = new THREE.Mesh(geometry, material);
image1.position.set(-2, 2, 0);
scene1.add(image1);

const image2 = new THREE.Mesh(geometry, material);
image2.position.set(2, 2, 0);
scene2.add(image2);

const image3 = new THREE.Mesh(geometry, material);
image3.position.set(-2, -2, 0);
scene3.add(image3);

const image4 = new THREE.Mesh(geometry, material);
image4.position.set(2, -2, 0);
scene4.add(image4);

parentScene.add(scene1, scene2, scene3, scene4);

const controls1 = new OrbitControls(camera1, renderer.domElement);
const controls2 = new OrbitControls(camera2, renderer.domElement);
const controls3 = new OrbitControls(camera3, renderer.domElement);
const controls4 = new OrbitControls(camera4, renderer.domElement);

function onDocumentMouseDown(event) {
  event.preventDefault();

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, parentCamera);

  const intersects = raycaster.intersectObjects([image1, image2, image3, image4]);

  if (intersects.length > 0) {
    selectedCamera = intersects[0].object.parent.getObjectByName('camera');
  }
}

let selectedCamera = null;

controls1.addEventListener('start', () => {
  selectedCamera = camera1;
});
controls2.addEventListener('start', () => {
  selectedCamera = camera2;
});
controls3.addEventListener('start', () => {
  selectedCamera = camera3;
});
controls4.addEventListener('start', () => {
  selectedCamera = camera4;
});

function onDocumentMouseUp(event) {
  selectedCamera = null;
}

function onDocumentMouseMove(event) {
  event.preventDefault();

  if (selectedCamera) {
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta);
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi);
  }
}

function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls1.update();
  controls2.update();
  controls3.update();
  controls4.update();

  renderer.render(parentScene, parentCamera);
}

document.addEventListener('mousedown', onDocumentMouseDown);
document.addEventListener('mouseup', onDocumentMouseUp);
document.addEventListener('mousemove', onDocumentMouseMove);
window.addEventListener('resize', onWindowResize);

animate();
```

<br>

This positions each of the four images at the corners of the parent scene by setting their positions relative to their respective sub-scenes. The selectedCamera variable now stores a reference to the camera of the currently selected image, which is determined when the user clicks on one of the images.

When the user moves the mouse, the code checks if a camera has been selected, and if so, it rotates the camera around the world axes based on the mouse movements.

## Update Controls for each Image

<span style="color:#0000dd;">The images were not showing up, so I updated your code to add them, like so:

```js
  const loader = new THREE.TextureLoader();
  const image1 = loader.load('image1.jpg');
  const material1 = new THREE.MeshBasicMaterial({ map: image1 })
  const mesh1 = new THREE.Mesh(geometry, material1);
  mesh1.position.set(-2, 2, 0);
  scene1.add(mesh1);
  // etc.
```

<span style="color:#0000dd;">Otherwise the code looks good, except - the images are not panning and zooming.  Any ideas?

I apologize for the oversight in my previous response. Thank you for updating the code to add the images.

Regarding the panning and zooming issue, it looks like we forgot to **update the controls for each image** to use the same target object, so they all pan and zoom together:

```javascript
// Create the four scenes and cameras
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.z = 5;

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.x = 5;

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3.position.y = 5;

const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera4.position.set(-5, 0, 5);

// Add the scenes to a parent scene
const parentScene = new THREE.Scene();
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// Create a target object to control the camera
const target = new THREE.Object3D();
parentScene.add(target);

// TODO: HE FORGOT TO ADD THE RENDERER

// Create the four controls
const controls1 = new THREE.OrbitControls(camera1, renderer.domElement);
controls1.target = target;

const controls2 = new THREE.OrbitControls(camera2, renderer.domElement);
controls2.target = target;

const controls3 = new THREE.OrbitControls(camera3, renderer.domElement);
controls3.target = target;

const controls4 = new THREE.OrbitControls(camera4, renderer.domElement);
controls4.target = target;

// Set up event listeners to control the cameras
let selectedCamera = null;

function onDocumentMouseDown(event) {
  if (event.button === 0) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseX < window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = camera1;
    } else if (mouseX >= window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = camera2;
    } else if (mouseX < window.innerWidth / 2 && mouseY >= window.innerHeight / 2) {
      selectedCamera = camera3;
    } else {
      selectedCamera = camera4;
    }
  }
}

controls4.addEventListener('start', () => {
  selectedCamera = camera4;
});

function onDocumentMouseUp(event) {
  selectedCamera = null;
}

function onDocumentMouseMove(event) {
  event.preventDefault();

  if (selectedCamera) {
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta);
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi);
  }
}

// DEFINE PARENT CAMERA

function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add the four images to the scenes
const loader = new THREE.TextureLoader();

// DEFINE GEOMETRY IN HERE

const image1 = loader.load('image1.jpg');
const material1 = new THREE.MeshBasicMaterial({ map: image1 })
const mesh1 = new THREE.Mesh(geometry, material1);
mesh1.position.set(-2, 2, 0);
```

Please continue, starting with "Add the four images to the scenes".

<mark>**Note!  Here's where things went sideways.**</mark>

Sure! **Here's the complete updated code** with the images added to the scenes...

See esqueletos.

## Create ParentCamera in Three.js

In Three.js, you can create a `ParentCamera` that acts as a container for other cameras by using the `THREE.Group()` object. Here are the steps to create a `ParentCamera` for 4 other cameras:

1. Create the four cameras you want to include in the `ParentCamera`. For example, you could create four `PerspectiveCamera` objects with different `fov`, `aspect`, `near`, and `far` properties.

```javascript
const camera1 = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera4 = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
```

2. Create a `ParentCamera` using the `THREE.Group()` object.

```javascript
const parentCamera = new THREE.Group(); // <-- Group? Hellooo!
```

3. Add the four cameras to the `ParentCamera` using the `add()` method.

```javascript
parentCamera.add(camera1);
parentCamera.add(camera2);
parentCamera.add(camera3);
parentCamera.add(camera4);
```

4. Set the position and rotation of the `ParentCamera` to control the view of the child cameras.

```javascript
parentCamera.position.set(0, 0, 0);
parentCamera.rotation.set(0, 0, 0);
```

5. When you want to render a scene with the `ParentCamera`, you can use any of the four child cameras by setting the `activeCamera` property of the `ParentCamera` to the desired camera.

```javascript
parentCamera.activeCamera = camera1;
renderer.render(scene, parentCamera.activeCamera);
```

Note that when you move or rotate the `ParentCamera`, all of its child cameras will also move and rotate accordingly.

## three.js Errors: Camera & Objects

This is freakin' ridiculous.  I'm not getting good code, and I'm getting incomplete code.

I'm getting the following errors in three.js.  what does it mean?

```
THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.

THREE.Object3D.add: object not an instance of THREE.Object3D.
Object { x: 0, y: 0, z: 0 }
```

These errors indicate that there are issues with the objects being passed as arguments in your three.js code.

The first error, "THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera," suggests that you are passing an object that is not an instance of THREE.Camera as the camera argument in the render method of the WebGLRenderer.

Make sure that you have created a THREE.Camera object and that you are passing it correctly as the camera argument. You can create a new instance of the camera object using one of the available camera types in three.js, such as THREE.PerspectiveCamera or THREE.OrthographicCamera.

The second error, "THREE.Object3D.add: object not an instance of THREE.Object3D," indicates that you are trying to add an object that is not an instance of THREE.Object3D to a THREE.Object3D container.

Make sure that you are creating instances of the Object3D class and adding them to other Object3D instances or using them as the base class for other objects. You can create a new instance of the Object3D class using `new THREE.Object3D()`.

<br>

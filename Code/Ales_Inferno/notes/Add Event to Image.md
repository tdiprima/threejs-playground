## Raycaster

OK.  How about using a raycaster instead of a click event?

<mark>**You are a genius, Tam-tam. :)**</mark>

Using a raycaster can provide more flexibility and precision when dealing with mouse interactions in a 3D scene.

Here's how to use a raycaster to handle mouse clicks on the image:

```js
// el bugueo, b2.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a TextureLoader instance
const textureLoader = new THREE.TextureLoader();

// Create a global raycaster
const raycaster = new THREE.Raycaster();

// Create a list to store objects for raycasting
const clickableObjects = [];

// Load the image texture
textureLoader.load('image1.jpg', function (texture) {
  // Create a PlaneGeometry with the desired size
  const geometry = new THREE.PlaneGeometry(1, 1);

  // Create a MeshBasicMaterial with the loaded texture
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create a mesh using the geometry and material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(1.0, texture.image.height / texture.image.width, 1.0);
  mesh.userData.interactive = true;

  // Add the mesh to the scene
  scene.add(mesh);

  // Add the mesh to the list of clickable objects
  clickableObjects.push(mesh);
});

// Event listener for mouse clicks
function onDocumentMouseDown(event) {
  // Calculate the mouse position in normalized device coordinates (-1 to +1)
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Raycast against the list of clickable objects
  const intersects = raycaster.intersectObjects(clickableObjects);

  // Check if any objects were intersected
  if (intersects.length > 0) {
    console.log('Image clicked!');
  }
}

// Attach the mouse down event listener to the document
document.addEventListener('mousedown', onDocumentMouseDown);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

<br>

In this example, we create a `raycaster` object that will be used to perform raycasting against the **clickable objects** in the scene. We also define a `clickableObjects` array to store the objects that should respond to mouse clicks.

The `onDocumentMouseDown` function is called when a mouse click occurs. It calculates the **mouse position** in **normalized device coordinates,** updates the `raycaster` with the mouse position and camera, and then performs the raycast against the `clickableObjects` array. If any objects are intersected by the raycast, it logs a message to the console.

If you have multiple clickable objects, add them to the `clickableObjects` array using `clickableObjects.push(object)`.

With these modifications, the **raycaster will handle the mouse click event** and trigger the desired behavior when the image or any other clickable object is clicked in the scene.

## Resources

[working example](https://codesandbox.io/s/basic-threejs-example-with-re-use-dsrvn)

[straight outta three.js](https://threejs.org/docs/index.html?q=ray#api/en/core/Raycaster)

[How do i add click event to a mesh?](https://discourse.threejs.org/t/how-do-i-add-click-event-to-a-mesh/43837/2)

[THREE.Interactive](https://github.com/markuslerner/THREE.Interactive)

## Don't use event listeners. But &ndash;

Confirm that the event listener is **added after the image has loaded:** The TextureLoader in Three.js loads the image asynchronously. It's important to ensure that the event listener is added only after the image has finished loading. You can achieve this by adding the event listener inside the `onLoad` callback of the TextureLoader.

Verify that the **image is interactive:** By default, Three.js meshes are not interactive, so you need to enable interactivity to receive mouse events. To make the image interactive, you can set the `mesh`'s `userData` property to include the `interactive` flag.

By setting `interactive` to `true`, you **enable the mesh to receive mouse events.**

Check if **any other element is capturing** the event: If there are other elements on top of the image that are intercepting the mouse event, the event may not reach the image. You can try setting the CSS property `pointer-events: none;` on those elements to allow the event to propagate to the image.

```css
/* Example CSS */
.overlay-element {
  pointer-events: none;
}
```

This will ensure that the image can receive the mouse event even if there are other elements on top of it.

Using click or mousedown didn't work.

What if I put `event.preventDefault();` at the top of the event listener?

```js
// el bugueo, b1.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Click event listener function
function onImageClick() {
  console.log('Hello');
}

// Mousedown event listener function
function onImageMouseDown() {
  console.log('Hello');
}

// Create a TextureLoader instance
const textureLoader = new THREE.TextureLoader();

// Load the image texture
textureLoader.load('image1.jpg', function (texture) {
  // Create a PlaneGeometry with the desired size
  const geometry = new THREE.PlaneGeometry(1, 1);

  // Create a MeshBasicMaterial with the loaded texture
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create a mesh using the geometry and material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(1.0, texture.image.height / texture.image.width, 1.0);
  mesh.userData.interactive = true;

  // Add the mesh to the scene
  scene.add(mesh);

  // Add the 'mousedown' event listener after the image has loaded
  mesh.addEventListener('mousedown', onImageMouseDown);

  // Add the 'click' event listener after the image has loaded
  mesh.addEventListener('click', onImageClick);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

<br>

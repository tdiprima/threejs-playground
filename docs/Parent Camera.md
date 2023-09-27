## Parent Camera

In what cases would we want a parent camera (PerspectiveCamera)?
<!--pan_and_zoom-2.html-->
Ales\_Inferno/set\_pan\_zoom\_others.html

<span style="color:#0000dd;">If we had multiple cubes, instead of coding the rotation for each stupid one (although we could just easily do that in a loop), we rotate the parent.  That's the idea.</span>

## Example

Code example demonstrating **camera movement coordination** using a parent camera.

(He gave me an *object* instead of a *camera*, but ok.)

```javascript
// Set up the scene, renderer, and camera
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a parent object to group the camera and other objects
let parentObject = new THREE.Object3D();
scene.add(parentObject);

// Create the camera and add it as a child of the parent object
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
parentObject.add(camera);

// Create a cube to demonstrate movement coordination
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let cube = new THREE.Mesh(geometry, material);
parentObject.add(cube);

// Set the initial position of the parent object and camera
parentObject.position.z = 5;
camera.position.z = 2;

let time = Date.now();

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the parent object
  parentObject.rotation.y += 0.01;

  // Update the rotation of the parent object based on elapsed time
  const time = performance.now() * 0.001; // Convert time to seconds
  parentObject.rotation.y += time;

  // Time
  const currentTime = Date.now();
  const deltaTime = currentTime - time;

  // Update objects
  cube.rotation.y += 0.01 * deltaTime;

  // Render the scene with the updated camera
  renderer.render(scene, camera);
}

animate();
```

<br>

In this example, we create a parent object (`parentObject`) and add both the camera and a cube as children of that object. By rotating the parent object, the camera and the cube will move together in a coordinated manner. The `animate()` function is called in a loop to continuously update the rotation and render the scene with the updated camera.

## Why Parent

A parent camera, such as a `PerspectiveCamera`, can be useful in several cases:

1. **Camera movement coordination**: If you have multiple objects in your scene that need to move together or maintain a consistent relative position, you can group them under a parent object with a `PerspectiveCamera`. This allows you to control the movement and rotation of the parent object, and all the children, including the camera, will move accordingly.

2. **Camera animation**: When you want to animate the camera movement in a coordinated way with other objects or elements in the scene, using a parent camera can simplify the animation process. By animating the position, rotation, or other properties of the parent object, you can achieve complex camera movements while maintaining control over the animation.

3. **Camera rigging**: In some cases, you may want to create more advanced camera setups, such as a camera rig with multiple perspectives or viewports. A parent camera can act as the main camera rig, and you can have multiple child cameras that represent different viewpoints or perspectives within the scene. This allows you to switch between different cameras or create split-screen effects easily.

4. **Hierarchical transformations**: If you have a hierarchical scene structure with nested objects, applying transformations to a parent camera will propagate those transformations to all the child objects, including the camera. This can be useful when you want the camera to follow or be influenced by the transformations of other objects.

These are just a few examples of when a parent camera in Three.js can be beneficial. The specific use cases may vary depending on the requirements of your project and the desired behavior of the camera within the scene.

<br>

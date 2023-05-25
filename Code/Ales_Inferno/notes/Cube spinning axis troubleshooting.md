## Cube spinning on weird axis

<span style="color:#0000dd;">I must have a positioning wrong or something...?  (Yes.)</span>

If your cube is spinning on a strange axis when using OrbitControls in Three.js, there could be a few reasons for this behavior. Here are some common issues to consider:

1. **Check the rotation of your cube:** Ensure that the initial rotation of your cube is set correctly. If the cube is already rotated when it's added to the scene, it may appear to spin on an unexpected axis when using OrbitControls.

2. **Verify the camera position:** The behavior of OrbitControls depends on the camera's position relative to the scene. Make sure that the camera is positioned correctly to focus on the cube. If the camera is not aligned properly, it can result in strange rotation axes.

3. **Axis misalignment:** Confirm that the axes of your scene, cube, and camera are aligned correctly. Three.js uses a right-handed coordinate system, where the X-axis points to the right, the Y-axis points up, and the Z-axis points towards the viewer. If your axes are misaligned, it can cause unexpected rotation behavior.

4. **Incorrect use of OrbitControls:** Ensure that you're using the OrbitControls class correctly. Make sure you've added the controls to your renderer, and you're updating the controls in the animation loop. Double-check the parameters you pass to the OrbitControls constructor, such as the camera and the DOM element.

Here's an example setup for adding a cube with OrbitControls:

```javascript
// Create a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a cube to the scene
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the cube
cube.position.set(0, 0, 0);

// Add OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Set camera position
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
```

## Do this

```js
cube.position.set(0, 0, 0);

// As opposed to:
// meshes[0].position.set(-1, 1, 0);
// meshes[1].position.set(1, 1, 0);
// meshes[2].position.set(-1, -1, 0);
// meshes[3].position.set(1, -1, 0);
```

<br>

<mark>**By the way,**</mark> if you get some stupid thing that says THREE isn't mapped to anything, just close the browser and start again.

<br>

## Zooming in on a Corner

I have a question about how three.js orbit controls zooms in and out.  It seems like the camera is fixed in the center.  But what if I wanted to zoom into a corner, into a region of interest?  Can I hover the mouse over the corner and zoom in and out?

By default, the OrbitControls in Three.js is designed to zoom in and out based on the center of the scene. However, you can achieve the effect of zooming into a specific region or corner of the scene by modifying the controls' behavior.

To accomplish this, you can adjust the target of the controls to focus on the desired region. The target represents the point in the scene that the camera is looking at. By changing the target, you can make the camera orbit around a specific point.

Here's an example of how you can achieve this:

```javascript
// Assuming you have already created a WebGLRenderer, a PerspectiveCamera, and a Scene

// Create OrbitControls and attach them to the camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Set the initial target of the controls to the center of the scene
controls.target.set(0, 0, 0);

// Add an event listener to detect mouse hover on the region of interest
// and update the controls' target accordingly
yourRegionOfInterest.addEventListener('mousemove', (event) => {
  // Convert the mouse coordinates to normalized device coordinates (NDC)
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use a raycaster to determine the 3D position of the mouse in the scene
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  // Find the intersection point of the ray with your region of interest
  const intersects = raycaster.intersectObject(yourRegionOfInterest, true);
  
  if (intersects.length > 0) {
    // Set the controls' target to the intersection point
    controls.target.copy(intersects[0].point);
  }
});
```

<br>

In this example, we set the initial target of the controls to the center of the scene. Then, when the mouse hovers over the region of interest, we update the controls' target to the intersection point of the ray from the camera with the region. This causes the camera to orbit around the region of interest when zooming in and out.

Note that `yourRegionOfInterest` is an example variable representing the object or area in your scene that you want to zoom into. You need to replace it with the actual object or area that corresponds to your region of interest.

Feel free to adapt this example to suit your specific needs or integrate it into your existing code.

## Plugin

Yes, there is a plugin for Three.js called "three.js-focus-point" that can facilitate zooming into a specific region or point of interest. This plugin allows you to set a focus point for the camera, and the zooming and panning operations will revolve around that point.

Here's how you can use the "three.js-focus-point" plugin:

1. First, include the necessary JavaScript files in your HTML:

    ```html
    <script src="https://threejs.org/build/three.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three.js-focus-point/dist/three.js-focus-point.min.js"></script>
    ```

2. Create your WebGLRenderer, PerspectiveCamera, and Scene as usual.

3. Initialize the FocusPointControls and attach them to your camera:

    ```javascript
    // Create FocusPointControls and attach them to the camera
    const controls = new THREE.FocusPointControls(camera, renderer.domElement);
    ```

4. Set the initial focus point of the controls:

    ```javascript
    // Set the initial focus point
    controls.focusPoint.set(x, y, z); // Replace x, y, z with the coordinates of your desired focus point
```

5. Optionally, you can customize the controls' behavior and sensitivity:

    ```javascript
    controls.rotateSpeed = 1.0; // Adjust the rotation speed
    controls.zoomSpeed = 1.2; // Adjust the zoom speed
    controls.panSpeed = 0.8; // Adjust the panning speed
    ```

6. Update the controls in your animation/render loop:

    ```javascript
    function animate() {
      requestAnimationFrame(animate);

      // Update the controls
      controls.update();

      // Render the scene
      renderer.render(scene, camera);
    }
    ```

<br>

With the "three.js-focus-point" plugin, the camera will orbit around the focus point when zooming in and out, providing the effect of zooming into a specific region or corner of the scene.

You can find more information about the "three.js-focus-point" plugin, including additional options and usage examples, in the official repository: [https://github.com/loonghao/three.js-focus-point](https://github.com/loonghao/three.js-focus-point)

Remember to include the necessary scripts and adapt the code according to your specific project setup.


## Postprocessing plugin

[postprocessing](https://github.com/pmndrs/postprocessing)

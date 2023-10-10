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

<mark>**Close!  The mouse movement "pushes" the image away, though.**</mark>

Note that `yourRegionOfInterest` is an example variable representing the object or area in your scene that you want to zoom into.

<br>

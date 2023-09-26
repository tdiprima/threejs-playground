## Cube spinning on weird axis

<span style="color:#0000dd;">I must have a positioning wrong or something...?  (Yes.)</span>

If your cube is spinning on a strange axis when using OrbitControls in Three.js, there could be a few reasons for this behavior. Here are some common issues to consider:

1. **Check the rotation of your cube:** Ensure that the initial rotation of your cube is set correctly. If the cube is already rotated when it's added to the scene, it may appear to spin on an unexpected axis when using OrbitControls.

2. **Verify the camera position:** The behavior of OrbitControls depends on the camera's position relative to the scene. Make sure that the camera is positioned correctly to focus on the cube. If the camera is not aligned properly, it can result in strange rotation axes.

3. **Axis misalignment:** Confirm that the axes of your scene, cube, and camera are aligned correctly. Three.js uses a right-handed coordinate system, where the <span style="color:red;">X-axis</span> points to the right, the <span style="color:lime;">Y-axis</span> points up, and the <span style="color:blue;">Z-axis</span> points towards the viewer. If your axes are misaligned, it can cause unexpected rotation behavior.

4. **Incorrect use of OrbitControls:** Ensure that you're using the OrbitControls class correctly. Make sure you've added the controls to your renderer, and you're updating the controls in the animation loop. Double-check the parameters you pass to the OrbitControls constructor, such as the camera and the DOM element.

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

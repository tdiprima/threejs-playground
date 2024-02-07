## Free-draw with Tube

I see what's causing the confusion in your Three.js code regarding drawing on an image using a `TubeBufferGeometry`. The issue arises because `TubeBufferGeometry` does not have a `setFromPoints` method, which is why you're seeing `tubeGeometry` as undefined when you try to use this method. This method is generally associated with simpler geometries like `BufferGeometry` for lines, not for tube geometries.

To draw a tube along the points collected from mouse movements, you should create a new tube geometry whenever the points array is updated. However, creating a new geometry for every mouse move event is not efficient. Instead, you should update the curve the tube geometry follows and then recreate the tube geometry when the drawing is finished or at certain intervals.

Here's a revised approach to achieve the drawing effect:

1. Collect points while the mouse is down.
2. Update a `CatmullRomCurve3` with the new points as the drawing continues.
3. Only when the drawing action ends (on mouse up), use the collected points to create a new `TubeBufferGeometry` and replace the old one in the mesh.

Here's a simplified version of how you might adjust your event handlers and drawing logic:

<span style="color:#59acf3;font-size:larger;">tubular.html</span>

This approach creates the `TubeBufferGeometry` only after you finish drawing, which should be more efficient and avoid the issue with `tubeGeometry` being undefined. It ensures that your drawing is responsive and that the tube geometry accurately represents the path drawn by the user.

<hr>

<span style="color:blue;font-size:larger;">"Uncaught TypeError: can't access property "x", t is undefined".</span>

Any time you get some stupid error like that, it means you're doing it wrong.  Try to figure it out.  And use the unminified JavaScript source for a better error.

<span style="color:blue;font-size:larger;">"LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values."</span>

Means!  That you needed to use a flat array, but you used something like:

```js
// Create an array of Vector3 points for your line
let points = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 1, 1),
  // Add more points as needed
];

// Flat!
let vertices = [1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 1];
```

<br>

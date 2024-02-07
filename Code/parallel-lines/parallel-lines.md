# 💯

<span style="color:#0000dd;">A Line only comes with a thickness of 1.  The property linewidth does not work with Line.  On the other hand, the linewidth property works with Line2, but I can't raycast with it.</span>

`Line2`, `TubeGeometry`, and `LineSegments2` give you a thicker line.

It could be that the `blahblah2` stuff doesn't raycast.

## Import

```js
import { LineMaterial } from 'three/examples/lines/LineMaterial.js';
import { LineSegments2 } from 'three/examples/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/lines/LineSegmentsGeometry.js';
```

## LineSegments2

<a href="parallel-lines/line-thickness/myLineSegments.js">myLineSegments.js</a>

```js
let vertices = [-1, 0, 0, 1, 0, 0];

let geometry = new LineSegmentsGeometry().setPositions(vertices);

let material = new LineMaterial({ linewidth: 5, color: 0xff0000 });

let line = new LineSegments2(geometry, material);

scene.add(line);
```

## Resolution

The `LineMaterial` expects the resolution of the material to be set explicitly, which affects how the lines are rendered.

To fix the problem, you need to set the resolution property of the `LineMaterial` to the width and height of the renderer.

```js
// In the animation function
let material = new LineMaterial({ linewidth: 5, color: 0xff0000 });
material.resolution.set(window.innerWidth, window.innerHeight); // Add this line
```

## Error: Computed radius is NaN

<span style="color:#0000dd;">"LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values."</span>

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

So this won't work:

```js
// Create a Float32Array with the vertices
let positions = new Float32Array(vertices);

// Create a BufferAttribute with the positions
let positionAttribute = new THREE.BufferAttribute(positions, 3);

// Create a LineSegmentsGeometry and set the positions attribute
let geometry = new LineSegmentsGeometry();
geometry.setAttribute('position', positionAttribute);
```

Ya gotta do a flat array.

*(parallel.js uses the Float32Array, but doesn't use a BufferAttribute.  lines_fat_raycasting.js uses THREE.Float32BufferAttribute.)*

```js
// 1st and last (heh?)
let geometry = new LineSegmentsGeometry().setPositions([-2, 0, 0, 2, 0, 0]);
```

Buddy said: The `LineSegmentsGeometry` is not meant to be used directly with custom positions for each line segment. Instead, it is typically used with a BufferAttribute that contains a list of vertices representing the line segments.

## Vertices

Then we had a whole big discussion (commit #6195fdf) about array conversion and why if I pass in:

```js
let vertices = [2, 0, 0, 2, 0, 0, 0, 0, -2, 0, 0, 2];
```

It ends up being:

```js
console.log(position.array);
[-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0]
```

Need correct vertex positions in the vertices array. The positions should be in the format of `[x1, y1, z1, x2, y2, z2, ...]`. In your code, you have `[1, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 1]`, which represents two separate line segments.

To fix the problem and display a single line segment, update the vertices array to the correct format. For example, to create a line segment from (-1, 0, 0) to (1, 0, 0), modify the `vertices` array as follows:

```javascript
let vertices = [-1, 0, 0, 1, 0, 0];
```

*Allegedly.*

<br>

<!-- #barracuda -->

### Problem:

A `Line` only comes with a thickness of 1.  The property `linewidth` does not work with `Line`.  On the other hand, the `linewidth` property works with `Line2`, but I can't raycast against it.

## TL;DR

### Line2 and Tubular work; LineSegments does not work.

"Work" meaning &ndash; You get your line thickness.  The raycasting thing has yet to be seen.

## LineSegments

You can achieve a thicker line and still perform raycasting by using the `LineSegments` geometry instead of the `Line` geometry.

<span style="color:red;">False! No thicker line.</span>

The `LineSegments` geometry allows you to define individual line segments with different endpoints, which can be used to create a line with a custom thickness:

```javascript
// line-thickness.html, parallel()
import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';

// todo: understand when to use Vector3, and when to use flat array
let points = [-1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, -1, 0, 0];

let positions = new Float32Array(points.length);
for (let i = 0; i < points.length; i++) {
  positions[i] = points[i];
}

// Create a LineSegments geometry
let geometry = new LineSegmentsGeometry().setPositions(positions);
console.log(positions);

// Create a material for the line
let material = new LineMaterial({
  linewidth: 5, // Set the desired line thickness
  color: 0xffff00, // Set the line color
});

// Create the LineSegments object
let line = new THREE.LineSegments(geometry, material);

// Add the line to the scene
scene.add(line);
```

By using `LineSegments`, you can set a custom `linewidth` in the material and still be able to perform raycasting against it.

## Error: Computed radius is NaN

Got an error using:

```js
// Create an array of Vector3 points for your line
let points = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 1, 1),
  // Add more points as needed
];
```

Fixed in above code. (Well, I still get the error, but at least the line draws.)

Error was:

"LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values."

I then changed the points to `THREE.Vector3(-2, 0, 0), THREE.Vector3(2, 0, 0)` but that did not fix it.

<span style="color:red;">Right!  Cuz I needed a flat array.  I also added the conversion to Float32Array.</span>

**Buddy said:** The `LineSegmentsGeometry` is not meant to be used directly with custom positions for each line segment. Instead, it is typically used with a BufferAttribute that contains a list of vertices representing the line segments.

## TubeBufferGeometry

[I use TubeGeometry to create a Thick line between two points](https://stackoverflow.com/questions/11638883/thickness-of-lines-using-three-linebasicmaterial)

To create a thicker line and still be able to perform raycasting, you can use a different approach by creating a **tube-like geometry** using `TubeBufferGeometry`.

```javascript
// line-thickness.html, tubular()
// Create a custom curve for the line
let curve = new THREE.LineCurve3(
  new THREE.Vector3(-2, 0, 0), // Start point
  new THREE.Vector3(2, 0, 0) // End point
);

// Create a tube geometry with the custom curve
let segments = 20;
let thickness = 0.5;
let radiusSegments = 8;
let tubeGeometry = new THREE.TubeBufferGeometry(curve, segments, thickness, radiusSegments);

// Create a material for the tube
let material = new THREE.MeshBasicMaterial({
  color: 0xffff00
});

// Create the mesh using the tube geometry and material
let tubeMesh = new THREE.Mesh(tubeGeometry, material);

// Add the tube mesh to the scene
scene.add(tubeMesh);
```

<br>

* The `segments` parameter determines the number of segments along the curve.

* The `thickness` parameter controls the thickness of the tube.

* The `radiusSegments` parameter defines the smoothness of the tube surface.

Using this approach, you can create a thicker line-like object that can be raycasted against in three.js.

## Can we go back to LineSegmentsGeometry? 🤦🏻‍♀️

Show me an example of `LineSegmentsGeometry` used with a `BufferAttribute` containing a list of vertices representing the line segments.

Certainly! Here's an example of how you can use `LineSegmentsGeometry` with a `BufferAttribute` to define custom line segments:

```javascript
// line-thickness.html, lineSegments()
import * as THREE from 'three';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';

// Define your custom line segments as an array of vertices
let vertices = [
  -2, 0, 0, // Start point of first segment
  2, 0, 0, // End point of first segment
  0, 0, -2, // Start point of second segment
  0, 0, 2, // End point of second segment
  // Add more vertices for additional segments
];

/* NOPE! Ya don't do it like this.
// Create a Float32Array with the vertices
let positions = new Float32Array(vertices);

// Create a BufferAttribute with the positions
let positionAttribute = new THREE.BufferAttribute(positions, 3);

// Create a LineSegmentsGeometry and set the positions attribute
let geometry = new LineSegmentsGeometry();
geometry.setAttribute('position', positionAttribute);
*/

// YEP!
let geometry = new LineSegmentsGeometry().setPositions(vertices);
// OR - 1st and last
// let geometry = new LineSegmentsGeometry().setPositions([-2, 0, 0, 2, 0, 0]);

// Create a material for the line
let material = new LineMaterial({
  linewidth: 5, // <- did not work
  color: 0xffff00 // Set the line color
});

// Create the LineSegments object
let line = new THREE.LineSegments(geometry, material);

// Add the line to the scene
scene.add(line);
```

<br>
In this example, you define the line segments by specifying the start and end points as vertices in the vertices array.

Each point is represented by three consecutive values (x, y, z). You can add more vertices to define additional line segments.

The positions array is then used to create a `BufferAttribute`, which is set as the position attribute of the `LineSegmentsGeometry`.

Finally, you create a `LineMaterial` with the desired `linewidth` and color, and apply it to the `LineSegments` object.

## Array Conversion

I have an array with 12 elements: `let vertices = [2, 0, 0, 2, 0, 0, 0, 0, -2, 0, 0, 2];`, and I pass it to `setPositions` function like this: `let geometry = new LineSegmentsGeometry().setPositions(vertices);`.  When I print the value of `geometry.attributes.position.array`, the length of the array is 24.  Apparently three.js is doing something to the array I pass it in order to make it work.

Yes, in Three.js, the `setPositions` method of `LineSegmentsGeometry` expects the vertices array to be in a specific format. Instead of providing a flat array of coordinates, it expects the vertices to be represented as pairs of consecutive elements in the array.

In your case, the `vertices` array has 12 elements, but each pair of elements represents a single vertex. So, in total, you have 6 vertices (12 / 2 = 6).

The `setPositions` method takes this into account and converts the flat array representation into the appropriate format for the internal position attribute. It duplicates the values for each vertex, resulting in a longer array. In your case, since you have 6 vertices, the resulting array has a length of 24 (6 vertices * 4 coordinates per vertex = 24).

### Here's how the conversion works:

- Original `vertices` array: `[2, 0, 0, 2, 0, 0, 0, 0, -2, 0, 0, 2]`
- Converted `position.array`: `[2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, -2, 0, 0, -2, 0, 0, -2, 0, 0, 2]`

As you can see, each vertex's coordinates are duplicated four times in the resulting array.

This conversion is necessary because `LineSegmentsGeometry` treats each pair of consecutive elements as the coordinates of a single vertex. The extra duplication is required to create the necessary buffers for efficient rendering and manipulation of the geometry within Three.js.

<br>

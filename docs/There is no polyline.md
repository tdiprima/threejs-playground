## Polyline

What the hell is it, anyway?

A polyline is just a way of drawing shapes using only straight lines and connecting the dots.

## Do we have one in three.js?

Nope! There is no built-in class specifically named "Polyline" like in Fabric.js.

But we're programmers, and we can make one.

To create a polyline-like shape, you can use the `THREE.Line` or `THREE.LineSegments` classes along with a suitable geometry. 

```javascript
// Create an array of points defining your polyline vertices
var points = [
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(0, -1, 0)
];

// Create a geometry and set its vertices
var geometry = new THREE.BufferGeometry().setFromPoints(points);

// Create a material for the line
var material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Create a line object using the geometry and material
var line = new THREE.Line(geometry, material);

// Add the line to the scene
scene.add(line);
```

### So we got points and lines

In this example, the `points` array represents the vertices of the polyline. 

The `THREE.Line` class is used to create a line object using the geometry and material.

If you want to create a polyline with separate line segments, you can use the `THREE.LineSegments` class instead of `THREE.Line`.

The difference is that `THREE.Line` connects the vertices with a continuous line, while `THREE.LineSegments` treats each pair of vertices as separate line segments.

<br>

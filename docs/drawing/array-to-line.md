Let's say `points` is an <mark>**array of objects**</mark> with x, y, and z coordinates representing the points in 3D space.

And we want to draw a line, using those points.

### Let's say we're working with REV 124.

```js
// Step 1: Create a THREE.Geometry object
let geometry = new THREE.Geometry();

// Step 2: Add the points to the geometry
for (let i = 0; i < points.length; i++) {
  let point = points[i];
  geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
}
```

<br>
If `points` was an <mark>**array of numbers**</mark>, you'd do this instead:

```js
// Step 2: Add the points to the geometry
for (let i = 0; i < points.length; i += 3) {
  geometry.vertices.push(new THREE.Vector3(points[i], points[i + 1], points[i + 2]));
}
```

<br>
Of course, you may be wondering why don't we just assign the vertices directly, instead of rolling through this array nonsense? (In the 1st example.)

I'm not 100% sure, but I think we can do

```js
geometry.vertices = positions;
```

Or something after the `for` loop (where we would've built the `positions` array).

### Create a line

```js
// Step 3: Create a THREE.Line object using the geometry and a material
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

let line = new THREE.Line(geometry, material);
scene.add(line);
```

### What if we're using REV 143?

Assuming our `points` array is a **flat array of numbers.**

```js
// Step 1: Create a THREE.BufferGeometry object
let geometry = new THREE.BufferGeometry();

// Step 2: Convert the array of points to a Float32Array
let positions = new Float32Array(points.length);
for (let i = 0; i < points.length; i++) {
  positions[i] = points[i];
}

// Step 3: Create a THREE.BufferAttribute with the positions
let positionAttribute = new THREE.BufferAttribute(positions, 3);
geometry.setAttribute('position', positionAttribute);

// Step 4: Create a THREE.Line* object using the geometry and a material
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// LineSegments makes it come out too dotty
// let line = new THREE.LineSegments(geometry, material);

let line = new THREE.Line(geometry, material);
scene.add(line);
```

## myLine2

What's this `setIndex`, and how does `scale` work?


```js
let g = new THREE.BufferGeometry().setFromPoints([{"x":0.5,"y":0.5},{"x":-0.5,"y":0.5},{"x":-0.5,"y":-0.5},{"x":0.5,"y":-0.5}]);
g.setIndex([0, 1, 2, 3, 0]);
g.scale(w, h, 1);
```

<br>

1. We create a new object called `g` using the **`BufferGeometry`** class. This object is used to store and manipulate geometric data for rendering.

2. The **`setFromPoints`** method is called on the `BufferGeometry` object `g`. This method takes an array of points as input and creates a shape or geometry using those points.

3. The **`setIndex`** method is called on the `g` object. This method is used to define the order in which the vertices should be connected to form triangles or other shapes.

  The argument `[0, 1, 2, 3, 0]` passed to setIndex is an array that represents the indices of the vertices.  Note: The first number, 0, represents the index of the first vertex.  The fifth number, 0, represents the index of the first vertex **again.**

4. The **`scale`** method is called on the `g` object with three arguments: `w`, `h`, and `1`. This method is used to scale the geometry along the `x`, `y`, and `z` axes. Here, it scales the geometry by a factor of 11 along the x and y axes, and keeps the z-axis scaling as 1.

## Question...

We `setIndex` and set `scale`, and then we convert `g` to non-indexed.

1) Did we do `setIndex` and set `scale` for nothing?

2) I've never seen any code do `toNonIndexed()`; why is it being done here?

First of all, notice the array is `Vector2`; not `Vector3`.

```js
points = [{"x":0.5,"y":0.5},{"x":-0.5,"y":0.5},{"x":-0.5,"y":-0.5},{"x":0.5,"y":-0.5}]
```

<br>
So we coulda done:

```js
points.map(p => {
  return new THREE.Vector3(p[0], p[1], 0); // <- and zero
});
// ...
// And then not use the unindexed array
let geo = new LineGeometry().setPositions(g.getAttribute('position').array);
```

<br>

And I have a feelin... that this is because we're doin a **`Line2`.**

But I digress...

In the provided code, the `setIndex` and `scale` methods are called on the `g` object **before converting** it to non-indexed format. 

Did it do anything?  Meh.  Probably.

The **`toNonIndexed`** thing could be a fluke or a fudge for the [x, y] instead of [x, y, z].

Or &ndash; it could be that the Line2 expects it.  I don't know.

<mark>**This may or may not be the key to fixing free-draw with Line2.**</mark>

Anyway, the `toNonIndexed` method is used to convert the geometry `g` to a non-indexed format, and then the positions of the vertices are extracted (`unindexed.getAttribute('position').array`) to create a new `LineGeometry` object (`geo`) for further usage.

### Entire code

```js
// Three.js is used for creating 3D graphics in a web browser.import * as THREE from "three";import { Line2 } from "three/addons/lines/Line2.js";import { LineGeometry } from "three/addons/lines/LineGeometry.js";import { LineMaterial } from "three/addons/lines/LineMaterial.js";let scene = new THREE.Scene();let camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);let renderer = new THREE.WebGLRenderer();renderer.setClearColor(new THREE.Color(0x041122));renderer.setSize(825, 600);document.body.appendChild(renderer.domElement);function QuadGeometry(w, h) {  // 4 vertices  let pts = [    [0.5, 0.5],    [-0.5, 0.5],    [-0.5, -0.5],    [0.5, -0.5]  ];  console.log("%cbefore", "color: deeppink", pts);  let points = pts.map(p => {    // For each one of them, create a vector2, out of a and b.    return new THREE.Vector2(p[0], p[1]);  });  console.log("%cafter", "color: #ccff00;", points);  // This object is used to store and manipulate geometric data for rendering.  let g = new THREE.BufferGeometry();  // Create a shape or geometry using these points.  g.setFromPoints(points);  // "setIndex" defines the order in which the vertices should be connected to form shapes.  // It starts with vertex 0, then connects it to vertex 1, then to vertex 2, then to vertex 3, and finally back to vertex 0 to complete the shape.  g.setIndex([0, 1, 2, 3, 0]);  // "scale" scales the geometry along the x, y, and z axes  // It scales the geometry by a factor of 11 along the x and y axes and keeps the z-axis scaling as 1.  g.scale(w, h, 1);  // "g" has my 12-element array (because it added the "z" to each vertex)  // And it has the "index" that I specified  // "unindexed" is a 15-element array (because it duplicated the first one)  // And we're stripping the "index" part  let unindexed = g.toNonIndexed();  let pp = unindexed.getAttribute('position').array;  console.log("%cpoints", "color: #997fff;", pp);  // RETURN GEOMETRY  return new LineGeometry().setPositions(pp);}let g = QuadGeometry(11, 11);let m = new LineMaterial({  color: "yellow",  linewidth: 5});let quad = new Line2(g, m);scene.add(quad);// default camera poscamera.position.z = 100;// renders the scenelet render = function() {  requestAnimationFrame(render);  renderer.render(scene, camera);  m.resolution.set(window.innerWidth, window.innerHeight); // resolution of the viewport};render();
```

<br>

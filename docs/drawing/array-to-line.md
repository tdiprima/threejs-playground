Let's say `points` is an **array of objects** with x, y, and z coordinates representing the points in 3D space.

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
If `points` was an **array of numbers**, you'd do this instead:

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

Anyhoo...

```js
// Step 3: Create a THREE.Line object using the geometry and a material
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

let line = new THREE.Line(geometry, material);
scene.add(line);
```

### What if we're using REV 143?

Assuming our `points` array is a flat array of numbers.

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

<br>

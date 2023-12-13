## BufferGeometry Setup

[How to create a simple dynamically expanding rectangle geometry](https://discourse.threejs.org/t/how-to-create-a-simple-dynamically-expanding-rectangle-geometry/)

[BufferGeometry](https://threejs.org/docs/index.html#api/en/core/BufferGeometry)

[How to update things &mdash; BufferGeometry](https://threejs.org/docs/index.html#manual/en/introduction/How-to-update-things)

[Collection of Examples](https://hofk.de/main/discourse.threejs/)

```js
let geometry = new THREE.BufferGeometry();
let vertices = new Float32Array(12);
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
```

This snippet of code is part of a three.js setup.

1. **Creating a Buffer Geometry**:

   ```javascript
   let geometry = new THREE.BufferGeometry();
   ```

   This line initializes a new `BufferGeometry` object. In three.js, `BufferGeometry` is a class that allows for efficient representation of a 3D object. It's an alternative to `Geometry`, providing more direct control over the memory and is generally more efficient.

2. **Defining Vertices Array**:

   ```javascript
   let vertices = new Float32Array(12);
   ```

   Here, a typed array (`Float32Array`) is created with space for 12 floating-point numbers. This array is intended to store vertex data for the geometry. In 3D graphics, vertices are points in 3D space, and this array will hold the coordinates (x, y, z) for these points. The size `12` suggests that there are 4 vertices being defined (since each vertex has 3 coordinates and 4 vertices * 3 coordinates/vertex = 12).

3. **Setting the Geometry's Position Attribute**:

   ```javascript
   geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
   ```

   In this line, the `position` attribute of the `geometry` is set using the `vertices` array. The `position` attribute is a fundamental attribute in three.js geometries that stores the coordinates of each vertex. The `BufferAttribute` is used to pass the vertices array to the geometry. The second argument `3` in `new THREE.BufferAttribute(vertices, 3)` indicates that each vertex is composed of 3 values (x, y, z coordinates).

Overall, this code sets up the basic structure for a 3D object by defining its geometry and the vertices that compose it. However, as is, the vertices array is empty (filled with zeros), so this would represent a geometry at the origin without any actual shape. You would typically populate the `vertices` array with actual coordinates to define the shape of the object.

<br>

## Get Line Coordinates

`THREE.Line` in three.js represents a line in a 3D space, and it is composed of a `geometry` and a `material`. The `geometry` holds the vertices or points that make up the line, and you can access these points to retrieve the x, y, and z coordinates.

Below is a step-by-step guide to accessing the x, y, and z coordinates of each point in a `THREE.Line` object:

1. **Create or Access the Line**: Create a `THREE.Line` object or access an existing one in your scene.

    ```javascript
    // Creating a new line
    var geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 0, 0)
    ]);
    var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    var line = new THREE.Line(geometry, material);
    scene.add(line);
    ```

2. **Access the Geometry and Coordinates**: Retrieve the `geometry` from the line and then access its vertices or points. If you're using `BufferGeometry`, you'll need to access the `position` attribute and extract the coordinates from there.

    ```javascript
    // Access the geometry and retrieve the position attribute
    var positions = line.geometry.attributes.position.array;

    // Loop through the position attribute array, and extract x, y, and z coordinates
    for (let i = 0; i < positions.length; i += 3) {
        var x = positions[i];
        var y = positions[i + 1];
        var z = positions[i + 2];

        // Now you have individual x, y, z coordinates
        console.log(x, y, z);
    }
    ```

### Things to Note:
- The example assumes you are using `BufferGeometry`. If you are using another type of geometry, the method of accessing vertices may be different.
- The index `i` in the loop increments by `3` because each vertex's x, y, and z coordinates are stored consecutively in the `position` attribute array in `BufferGeometry`.
- Ensure that the line’s geometry has the `position` attribute with coordinates before attempting to access them, as attempting to access undefined properties will result in errors.

### Reference:
For the most accurate and up-to-date information, refer to the official [three.js documentation](https://threejs.org/docs/). Since three.js is actively developed, the API can change, so always check the version you are using against the corresponding documentation.

<br>

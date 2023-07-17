## Create array using every 3rd element from existing array

To create a new array using every third element from an existing array in JavaScript, you can use a loop or a higher-order array method like `filter()` or `reduce()`. Here's an example using both approaches:

1. Using a loop:

    ```javascript
    let originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let newArray = [];

    for (let i = 2; i < originalArray.length; i += 3) {
      newArray.push(originalArray[i]);
    }

    console.log(newArray); // Output: [3, 6, 9]
    ```

2. Using the `filter()` method:

    ```javascript
    let originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let newArray = originalArray.filter((_, index) => (index + 1) % 3 === 0);

    console.log(newArray); // Output: [3, 6, 9]
    ```

3. Using the `reduce()` method:

    ```javascript
    let originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let newArray = originalArray.reduce((acc, current, index) => {
      if ((index + 1) % 3 === 0) {
        acc.push(current);
      }
      return acc;
    }, []);

    console.log(newArray); // Output: [3, 6, 9]
    ```

In all of these examples, the `originalArray` contains elements `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`, and the `newArray` is created by selecting every third element (`[3, 6, 9]`).

## Assign vertices array

<span style="color:#0000dd;">If I create a new THREE.Geometry(), can I set the geometry.vertices simply by assigning an array to it?</span>

No, you cannot directly assign an array to `geometry.vertices` in three.js to set the vertices of a `THREE.Geometry` object.

In earlier versions of three.js, you could assign an array to `geometry.vertices` directly, but as of three.js version 0.125.0 and later, `THREE.Geometry` has been deprecated in favor of `THREE.BufferGeometry`.

To set the vertices of a `THREE.BufferGeometry` object, you need to work with typed arrays and buffers. Here's an example of how you can create a `THREE.BufferGeometry` and set the vertices using an array:

```javascript
let geometry = new THREE.BufferGeometry();
let vertices = [
  0, 0, 0, // Vertex 1
  1, 0, 0, // Vertex 2
  0, 1, 0  // Vertex 3
];
let positionAttribute = new THREE.Float32BufferAttribute(vertices, 3);

geometry.setAttribute('position', positionAttribute);
```

<br>

The `vertices` array contains the vertex positions for three vertices. Each vertex is represented by three consecutive values (x, y, z). The `positionAttribute` is created using a `Float32BufferAttribute`, which expects the array of vertices and the number of values per vertex (in this case, 3).

Finally, you assign the `positionAttribute` to the `position` attribute of the `geometry` using `geometry.setAttribute('position', positionAttribute)`.

Note that using `THREE.BufferGeometry` is the recommended approach for improved performance and compatibility with modern WebGL-based rendering.

### Sigh.  Whatever rev I want, he gives me the opposite.

<span style="color:#0000dd;">Thank you.  I needed to know that.  But let's say I'm using three.js revision 124.  Can I directly assign an array to geometry.vertices?</span>

Yes, if you are using three.js revision 124 or an earlier version, you can directly assign an array to `geometry.vertices` to set the vertices of a `THREE.Geometry` object. 

Here's an example of how you can create a `THREE.Geometry` object and set the vertices using an array:

```javascript
let geometry = new THREE.Geometry();
let vertices = [
  new THREE.Vector3(0, 0, 0), // Vertex 1
  new THREE.Vector3(1, 0, 0), // Vertex 2
  new THREE.Vector3(0, 1, 0)  // Vertex 3
];

geometry.vertices = vertices;
```

<br>

In this example, the `vertices` array contains instances of `THREE.Vector3`, representing the vertex positions for three vertices. Each `THREE.Vector3` object represents a vertex in 3D space with x, y, and z coordinates.

By assigning the `vertices` array to `geometry.vertices`, you set the vertices of the `THREE.Geometry` object directly.

Please note that if you're using a more recent version of three.js (0.125.0 or later), it is recommended to use `THREE.BufferGeometry` and work with buffers and typed arrays for improved performance.

## Push and unshift

<span style="color:#0000dd;">array.push() adds an element to the end of an array.  What if I wanted to add an element to the beginning?</span>

To add an element to the beginning of an array in JavaScript, you can use the `Array.unshift()` method. The `unshift()` method modifies the original array by adding one or more elements to the beginning and shifting the existing elements to higher indexes. Here's an example:

```javascript
let array = [2, 3, 4, 5];
array.unshift(1); // Add element 1 to the beginning of the array

console.log(array); // Output: [1, 2, 3, 4, 5]
```

The `unshift()` method is used to add the element `1` to the beginning of the `array`. After calling `unshift()`, the modified `array` will contain `[1, 2, 3, 4, 5]`, with all elements shifted to higher indexes.

It's important to note that `unshift()` modifies the original array and returns the new length of the array after adding the element(s).

## Convert this

<span style="color:#0000dd;">Could you please convert this three.js revision 124 code to revision 143?</span>

```js
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let radius = 5;
  let segments = 64;
  let geometry = new THREE.Geometry();
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  for (let i = 0; i <= segments; i++) {
    let theta = (i / segments) * Math.PI * 2;
    let x = radius * Math.cos(theta);
    let y = radius * Math.sin(theta);
    geometry.vertices.push(new THREE.Vector3(x, y, 0));
  }

  let circle = new THREE.Line(geometry, material);
  scene.add(circle);

  camera.position.z = 10;

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  (function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  })();
```

<br>
Certainly! Here's the revised code for three.js revision 143:

```javascript
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let radius = 5;
let segments = 64;
let geometry = new THREE.BufferGeometry();
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

let positions = [];
for (let i = 0; i <= segments; i++) {
  let theta = (i / segments) * Math.PI * 2;
  let x = radius * Math.cos(theta);
  let y = radius * Math.sin(theta);
  positions.push(x, y, 0);
}
let positionAttribute = new THREE.Float32BufferAttribute(positions, 3);
geometry.setAttribute('position', positionAttribute);

let circle = new THREE.Line(geometry, material);
scene.add(circle);

camera.position.z = 10;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```

<br>
The major changes are:

1. Replacing `THREE.Geometry` with `THREE.BufferGeometry`: Instead of using `THREE.Geometry`, we now use `THREE.BufferGeometry` to represent the geometry.

2. Using `BufferAttribute` to set vertex positions: Instead of pushing vertices to the `geometry.vertices` array, we create a flat array called `positions` and use it to create a `Float32BufferAttribute` for the `position` attribute of the `geometry`.

3. Replacing the IIFE (Immediately Invoked Function Expression) with a named function: Instead of using an IIFE for the animation loop, we define a named function `animate()` and call it inside the `requestAnimationFrame()` callback.

These changes align the code with the recommended practices for three.js version 0.143.0 and later.

## Reduce array

<span style="color:#0000dd;">Thank you.  Now, if I wanted to reduce "positions" to a new array, keeping every 3rd set of (x, y, z), how would I do that?</span>

To reduce the `positions` array and create a new array that contains every third set of (x, y, z) coordinates, you can use various approaches in JavaScript. Here's an example using the `filter()` method:

```javascript
let reducedPositions = positions.filter((_, index) => index % 3 === 0);
```

<br>

In this code snippet, the `filter()` method is used on the `positions` array. The filtering function takes the current element (`_`) and its index as arguments. The filtering condition `index % 3 === 0` checks if the index is divisible by 3 (i.e., every third element) and returns `true` if it is.

The `filter()` method creates a new array, `reducedPositions`, containing only the elements from `positions` that satisfy the filtering condition.

After executing this code, `reducedPositions` will contain every third set of (x, y, z) coordinates from the original `positions` array.

**Note:** If you need to perform any modifications on the `reducedPositions` array (such as adding it to a `THREE.BufferGeometry`), remember to convert it into a `Float32Array` or `Float64Array` before assigning it. You can use `new Float32Array(reducedPositions)` or `new Float64Array(reducedPositions)` to achieve that.

## Ummm... no.

<span style="color:#0000dd;">Right. I'm creating a Float32BufferAttribute to create a new mesh with reducedPositions.  However,  I don't think that positions.filter((_, index) => index % 3 === 0) will work.  I mean &ndash; yes, I want index % 3 === 0), but I need to retain index and index+1 and index+2, right?

You are correct. If you want to retain the elements at `index`, `index + 1`, and `index + 2` when reducing the `positions` array, you need to modify the filtering condition accordingly. Here's an updated code snippet:

```javascript
let reducedPositions = positions.filter((_, index) => index % 3 === 0 || index % 3 === 1 || index % 3 === 2);
```

<br>

The filtering condition checks if the index modulo 3 is equal to 0, 1, or 2. This condition ensures that every set of three consecutive elements (x, y, z) is retained in the `reducedPositions` array.

After executing this code, `reducedPositions` will contain every third set of (x, y, z) coordinates, preserving the elements at `index`, `index + 1`, and `index + 2` in the original `positions` array.

Remember to convert `reducedPositions` into a `Float32Array` before using it with a `Float32BufferAttribute`:

```javascript
let reducedPositionAttribute = new THREE.Float32BufferAttribute(reducedPositions, 3);
```

<br>

Now you can use `reducedPositionAttribute` to create a new mesh or assign it to the `position` attribute of a `THREE.BufferGeometry`.

### And again, no. ❌

<br>


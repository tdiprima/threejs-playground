## Create array using every 3rd element from existing array

<MARK>**TL;DR:**</MARK> Nothing worked.  I'd probably have to convert it to sets of 3 first.  Then pick every 3rd.  Then flatten. My _points0.reduce() didn't work, either.  Nor did decimatePoints(points, distance).  I don't get it. 💢

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

<br>
<span style="color:#ff00cc;">For some reason, when I use any of them on an actual points array, I get an empty array.</span>

To reduce the `positions` array and create a new array that contains every third set of (x, y, z) coordinates, you can use various approaches in JavaScript. Here's an example using the `filter()` method:

```javascript
let reducedPositions = positions.filter((_, index) => index % 3 === 0);
```

Which is wrong, so we tried again...

<span style="color:#ff00cc;">In this case, I just end up with the same array (obviously):</span>

You are correct. If you want to retain the elements at `index`, `index + 1`, and `index + 2` when reducing the `positions` array, you need to modify the filtering condition accordingly.

```javascript
let reducedPositions = positions.filter((_, index) => index % 3 === 0 || index % 3 === 1 || index % 3 === 2);
```

### Note

If you need to perform any modifications on the reducedPositions array (such as adding it to a THREE.BufferGeometry), remember to convert it into a Float32Array or Float64Array before assigning it. You can use `new Float32Array(reducedPositions)` or `new Float64Array(reducedPositions)` to achieve that.

Remember to convert reducedPositions into a Float32Array before using it with a Float32BufferAttribute:

```javascript
let reducedPositionAttribute = new THREE.Float32BufferAttribute(reducedPositions, 3);
```

Now you can use reducedPositionAttribute to create a new mesh or assign it to the position attribute of a THREE.BufferGeometry.

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

<br>

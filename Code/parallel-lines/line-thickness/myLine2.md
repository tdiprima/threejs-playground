## myLine2

What's this `setIndex`, and how does `scale` work?

```js
let g = new THREE.BufferGeometry().setFromPoints([{"x":0.5,"y":0.5},{"x":-0.5,"y":0.5},{"x":-0.5,"y":-0.5},{"x":0.5,"y":-0.5}]);
g.setIndex([0, 1, 2, 3, 0]);
g.scale(w, h, 1);
```

1. We create a new object called `g` using the `BufferGeometry` class. This object is used to store and manipulate geometric data for rendering.

2. The `setFromPoints` method is called on the `BufferGeometry` object `g`. This method takes an array of points as input and creates a shape or geometry using those points.

3. The `setIndex` method is called on the `g` object. This method is used to define the order in which the vertices should be connected to form triangles or other shapes.

  The argument `[0, 1, 2, 3, 0]` passed to setIndex is an array that represents the indices of the vertices.  Note: The first number, 0, represents the index of the first vertex.  The fifth number, 0, represents the index of the first vertex again.

4. The `scale` method is called on the `g` object with three arguments: `w`, `h`, and `1`. This method is used to scale the geometry along the `x`, `y`, and `z` axes. Here, it scales the geometry by a factor of 11 along the x and y axes, and keeps the z-axis scaling as 1.

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

And I have a feelin... that this is because we're doin a `Line2`.

But I digress...

In the provided code, the `setIndex` and `scale` methods are called on the `g` object before converting it to non-indexed format. 

Did it do anything?  Meh.  Probably.

The `toNonIndexed` thing could be a fluke or a fudge for the [x, y] instead of [x, y, z].

Or &ndash; it could be that the Line2 expects it.  I don't know.

<mark>This may or may not be the key to fixing free-draw with Line2.</mark>

Anyway, the `toNonIndexed` method is used to convert the geometry `g` to a non-indexed format, and then the positions of the vertices are extracted (`unindexed.getAttribute('position').array`) to create a new `LineGeometry` object (`geo`) for further usage.

### Entire code

<a href="">parallel-lines/line-thickness/myLine2.js</a>

<br>


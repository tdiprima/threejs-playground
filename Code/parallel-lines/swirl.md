## Spiral

```javascript
per = i / (len - 1);
radian = Math.PI * 2 * rotationCount * per;
radius = maxRadius * per;
```

<br>
First, it's important to know that the code is creating a 3D spiral. Think of the spiral as a coiled spring. The code does not actually "bend" a line; instead, it calculates and places points along the path of a spiral, creating the appearance of a bent or coiled line when these points are connected.

Now, let's break down those two lines of code:

### 1. Radian Calculation:

```javascript
radian = Math.PI * 2 * rotationCount * per;
```

- `Math.PI * 2` represents a full circle in radians (360 degrees).

- `rotationCount` is the number of full rotations or coils the spiral will have.

- `per` is a fractional value that goes from 0 to 1, representing the progress along the spiral.

As `per` increases from 0 to 1, `radian` will increase proportionally, covering `rotationCount` number of full circles (or 360-degree rotations). Each calculated `radian` value will represent the angle at which a point is positioned around the central axis of the spiral.

### 2. Radius Calculation:

```javascript
radius = maxRadius * per;
```

- `maxRadius` is the maximum distance a point can have from the center of the spiral.

- `per`, again, is the fractional progress along the spiral.

`radius` starts small (close to zero) and increases linearly as `per` increases, meaning that points start close to the spiral's center and gradually move outwards. It determines how "wide" the spiral will be at each point.

### Visualizing the Spiral:

Imagine a flat circle. As you place points along the edge of this circle using the `radian` value, you're determining their angular position. Now, instead of laying these points flat, you gradually increase their distance from the center (with `radius`) and elevate them (with the y-coordinate, based on the loop index `i`). This process creates a coiled effect, transforming a circle into a spiral. When you connect these points with a line, it looks like a bent or coiled line forming a spiral shape.

In simple terms, the `radian` determines the angle around the circle, the `radius` determines how far out from the center each point is, and the loop index `i` gradually increases the height, resulting in a spiral.

<hr>

By manipulating `radian` and `radius` in this way, the code generates points that are evenly distributed along a spiral path. The **`cos` and `sin`** functions are then used to calculate the X and Z coordinates of each point based on `radian` and `radius`, creating a spiral pattern when plotted in 3D space.

In summary, the combination of using `radian` and `radius` in the calculations within the while loop, along with the trigonometric functions, creates the spiral effect in the resulting points.


## Let's look at the whole thing

```js
// parallel-lines/js/swirl.js, create-points helper
while (i < len) {
  per = i / (len - 1);
  radian = Math.PI * 2 * rotationCount * per;
  radius = maxRadius * per;
  v = new THREE.Vector3();
  v.x = Math.cos(radian) * radius;
  v.z = Math.sin(radian) * radius;
  v.y = i * yDelta;
  points.push(v);
  i += 1;
}
// Returns a 1D array of { x: 0, y: 0, z: 0 } objects
return points;
```

The `per` variable in this context is a normalized value ranging from 0 to 1 that represents the relative position of the current point along the length of the spiral.

You might interpret it as a "percentage" in casual terms, but more precisely, it's a "fraction of completion" or "proportional value" along the length of the spiral. 

Here's how it works:

- When `i` is 0 (the starting point of the loop), `per` will be `0 / (len - 1)` which is `0`.

- As `i` increases, `per` linearly increases.

- When `i` is `len - 1` (the endpoint of the loop), `per` will be `(len - 1) / (len - 1)` which is `1`.

This `per` value is then used to calculate the `radian` and `radius` values, which are crucial for determining the position of each point in the spiral.

The `radian` value is responsible for the angular position of the point.

The `radius` value determines the distance of the point from the center of the spiral.

Since `per` changes linearly from `0` to `1`, the computed `radian` and `radius` values will effectively trace a spiral from the center outwards.

If you think about `per` as representing the "percentage of completion" along the spiral (with `0%` at the start and `100%` at the end), it may be easier to understand its role in the code. But, to be mathematically precise, it's a normalized value or fraction, not a percentage in the sense of a number between 0 and 100.

<br>

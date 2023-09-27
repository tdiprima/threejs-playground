## Create Points

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
return points;
```

<br>

<mark>**Returns a 1D array of `{ x: 0, y: 0, z: 0 }` objects.**</mark>

The while loop iterates as long as the value of `i` is less than the length specified by the `len` parameter. Inside the loop, the function calculates the position of a point based on the current iteration index (`i`) and adds it to the `points` array. The loop increments `i` by 1 in each iteration.


## Spiral

The give-away in the code that indicates the resulting points will form a spiral is the usage of the variables **`radian` and `radius`** within the while loop.

In each iteration of the while loop, the code calculates the `radian` and `radius` values based on the current iteration index (`i`) and the input parameters. These values are then used to determine the position of each point in 3D space.

Let's break down the relevant code within the while loop:

```javascript
per = i / (len - 1);
radian = Math.PI * 2 * rotationCount * per;
radius = maxRadius * per;
```

<br>

- The variable **`per`** (as in "percentage") represents the progress of the iteration, ranging from 0 to 1. It is calculated by dividing the current index `i` by the total length `len - 1`.

- The variable **`radian`** is derived by multiplying `Math.PI * 2` (representing a full circle in radians) by `rotationCount` (the number of rotations desired) and then further multiplying by `per`. This calculation ensures that as `i` increases, the value of `radian` increases proportionally, resulting in a **spiral** effect.

- The variable **`radius`** is determined by multiplying `maxRadius` by `per`. This ensures that the radius of each point gradually increases as `i` increases, resulting in an **outward spiral** effect.

By manipulating `radian` and `radius` in this way, the code generates points that are evenly distributed along a spiral path. The **`cos` and `sin`** functions are then used to calculate the X and Z coordinates of each point based on `radian` and `radius`, creating a spiral pattern when plotted in 3D space.

In summary, the combination of using `radian` and `radius` in the calculations within the while loop, along with the trigonometric functions, creates the spiral effect in the resulting points.

## Default values

```js
rotationCount = rotationCount === undefined ? 8 : rotationCount; // number of rotations
height = height === undefined ? 5 : height;
maxRadius = maxRadius === undefined ? 5 : maxRadius;
```

<br>

The first 3 lines of the function are responsible for handling default values for the parameters `rotationCount`, `height`, and `maxRadius` if they are not provided when calling the function.

- If `rotationCount` is undefined, it is set to 8. Otherwise, it keeps its original value.
- If `height` is undefined, it is set to 5. Otherwise, it keeps its original value.
- If `maxRadius` is undefined, it is set to 5. Otherwise, it keeps its original value.

These lines ensure that the function will still work correctly even if some or all of these parameters are not explicitly specified when calling `createPoints`.


### What about using default parameters?

Both approaches have their advantages and it depends on the specific requirements of your code and personal preference. Let's compare the two approaches:

1. **Handling Default Values Explicitly:**

    Using explicit checks for undefined and assigning default values within the function body, as shown in the example you provided, gives you more flexibility. You can define default values based on complex conditions or computations. It also allows you to handle default values differently for each parameter. This approach is useful when you need fine-grained control over the default values or when the default values depend on other factors within the function.

2. **Using JavaScript Default Parameters:**

    JavaScript introduced default function parameters as part of ES6. With default parameters, you can define default values directly in the function declaration.

```javascript
let createPoints = function(len, rotationCount = 8, height = 5, maxRadius = 5) {
  // function body
};
```

<br>

Using default parameters makes the function declaration more concise and self-explanatory. It simplifies the code by eliminating the need for explicit checks and assignments within the function body. This approach is suitable when the default values are straightforward and don't require complex calculations or conditions.

In general, if the default values are simple and can be easily expressed in the function declaration, using JavaScript default parameters is a convenient and concise approach. On the other hand, if the default values are more complex or depend on other factors within the function, handling them explicitly in the function body provides greater flexibility.

<br>

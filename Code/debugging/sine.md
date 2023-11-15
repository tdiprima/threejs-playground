## Using sine for Smoothness

<span style="color:blue;">Why do we use `sin` to set position x,y,z (as opposed to `cos` or `tan` or anything else)?</span>

```js
function render(time) {
  time *= 0.001; // convert to seconds

  mesh.position.set(
    Math.sin(time * 1.2) * 5,
    Math.sin(time * 1.1) * 5,
    Math.sin(time * 1.3) * 10
  );
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
```

Sure, I'd be happy to explain why `sin` (sine) is used in this context!

The `sin` function is a mathematical function that helps describe a smooth, repeating wave-like pattern. It's often used in computer graphics, like in your Three.js code, to create smooth, natural movements.

Let's break down your code:

### 1. Time Factor:

```js
time *= 0.001;
```

converts the time from milliseconds to seconds. This is because the time variable probably increases too quickly (since it's in milliseconds), and using it directly would make the movement too fast to be natural.

### 2. Using sine for Positioning:

```js
Math.sin(time * 1.2) * 5
```

- This line uses `sin` to calculate the x-coordinate of the mesh's position. The `sin` function oscillates between -1 and 1. By multiplying the time by 1.2, you change how fast the wave oscillates. Multiplying the result by 5 scales the wave, so the x-coordinate moves between -5 and 5.

- The y and z coordinates are set in a similar way, but with slightly different multipliers for time. This creates a varied movement pattern for each axis.

### Now, why use "sin" instead of "cos" or "tan"?

- **`sin` and `cos`**: Both `sin` and `cos` are similar in that they produce smooth, repeating wave-like patterns. The main difference is their starting point; `sin` starts at 0 (when time is 0), while `cos` starts at 1. You could use `cos` instead of `sin` if you wanted a different starting position but the same type of movement.

- **`tan` (tangent)**: `tan` is quite different from `sin` and `cos`. It doesn't oscillate between -1 and 1. Instead, it goes off to infinity at certain points (which are known as "asymptotes"). This would make the movement very erratic and unnatural, with sudden jumps to extremely high or low values, which is not usually desired in smooth animations.

In summary, `sin` is used in your code to create smooth, natural, and repeating movements for the mesh in your 3D scene. It's a common choice for animations because of the way it smoothly transitions between values, creating the appearance of natural motion.

<span style="color:#0000ff;font-weight:bold;font-size:larger;">I think I saw somewhere that they were using sin for y calculation and cos for x, or vice-versa.  Is this typical?  And why would that work?</span>

Yes, it's quite common in computer graphics and animation to use `sin` for one axis (say, x) and `cos` for another axis (like y). This approach is often used to create circular or elliptical motion patterns. Let me explain why this works and why it's typical:

### 1. Circular Motion:

Imagine a point moving in a circle. If you break down this movement, you'll notice that the point moves back and forth along both the x-axis and the y-axis in a smooth, continuous manner. The functions that describe this back-and-forth motion in a circle are `sin` and `cos`.

### 2. How "sin" and "cos" Work Together:

   - The `sin` function describes the vertical movement (y-axis) in a circle, while `cos` describes the horizontal movement (x-axis).

      <span style="color:lime;">sin = vertical = "ascend"</span>

   - When `time` starts at 0, `sin(0)` is 0, but `cos(0)` is 1. This means if you use `sin` for the y-coordinate and `cos` for the x-coordinate, your object will start at the rightmost point of the circle (assuming the center of the circle is at the origin (0,0)).

   - As `time` increases, the values of `sin` and `cos` change, moving the point in a circular pattern. For any given value of `time`, `sin(time)` and `cos(time)` give you the coordinates of a point on the circle.

### Why It Works:

   - The circle is a fundamental shape in geometry and appears naturally in many physical systems and movements.

   - Using `sin` for one coordinate and `cos` for another creates a smooth, looping motion that's very visually pleasing and mimics many natural movements (like the orbiting of planets, wheels turning, etc.).

   - This method is mathematically neat and computationally efficient for creating circular or elliptical paths.

### 4. Versatility:

By adjusting the multipliers (like the ones you have in your code), you can change the radius of the circle or turn it into an ellipse, allowing for a wide range of movement patterns.

In summary, using `sin` for one axis and `cos` for another is a standard technique to create circular or elliptical motions in graphics programming. It's a simple yet powerful way to simulate natural and cyclical movements.

<span style="color:blue;font-weight:bold;font-size:larger;">ok.  so if I wanted to change my code to move my mesh in a circle (like a planet), I should probably pass the same values in to the sine function, and multiply by the same amount?  Like this?</span>

```js
// Almost!
mesh.position.set(
  Math.sin(time * 1.2) * 5, // x = change to cos
  Math.sin(time * 1.2) * 5,
  0
);
```

To make your mesh move in a circle in the x-y plane, you would indeed use `sin` and `cos` functions with the same multiplier for time, but you'd use `sin` for one axis (say y) and `cos` for the other (say x). This way, the movement on both axes is synchronized to form a circle. Your modified code should look like this:

```javascript
mesh.position.set(
  Math.cos(time * 1.2) * 5, // x-coordinate
  Math.sin(time * 1.2) * 5, // y-coordinate
  0                         // z-coordinate
);
```

In this code:

- `Math.cos(time * 1.2) * 5` calculates the x-coordinate. The `cos` function creates a smooth oscillation between -5 and 5.

- `Math.sin(time * 1.2) * 5` calculates the y-coordinate. The `sin` function also creates a smooth oscillation between -5 and 5, but its phase is offset by 90 degrees compared to `cos`, which is perfect for circular motion.

- The z-coordinate is set to 0, meaning the mesh will stay in the same plane.

With these changes, your mesh will move in a circular path with a radius of 5 units in the x-y plane. The speed of the movement will be determined by the multiplier `1.2`, and you can adjust this value to make the motion faster or slower.

## Clockwise

<span style="color:blue;font-weight:bold;font-size:larger;">That's counter-clock; what if I want it to go clockwise?</span>

```javascript
// Negate either x or y
Math.cos(time * 1.2) * -5
```

<br>

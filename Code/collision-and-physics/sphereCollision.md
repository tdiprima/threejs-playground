## Ball Collision

Here's a simple collision script using three.js where balls (represented as spheres) bounce off each other. This example involves basic physics and collision detection using the distance between spheres to detect a collision and reverse their velocities upon contact.

### Explanation:
- **Scene setup**: We create a scene, camera, and renderer as usual with three.js.
- **Balls**: Each ball is a sphere with a random position and velocity.
- **Movement**: The balls move by adding their velocity to their position in every frame. `ball.position.add(ball.velocity);`
- **Collision detection**: If the distance between two balls is less than the sum of their radii (i.e., they are touching), we swap their velocities to simulate a bounce.

This is a basic implementation, and you can enhance it by adding more accurate physics or better collision response.

# What's the 4 about?

The `4` in both cases defines the range within which the balls can move, effectively acting as boundaries for the scene. Let me break it down:

```js
ball.position.x = Math.random() * 4 - 2;
```

This line randomly places each ball within a certain area on the X-axis. Here's how it works:

- `Math.random()` generates a random number between `0` and `1`.
- `Math.random() * 4` scales that number to be between `0` and `4`.
- Subtracting `2` shifts the range to be between `-2` and `2`.

So, this ensures that the balls are placed randomly in a square area of the scene, with X and Y positions between `-2` and `2`.

```js
if (ball.position.x > 4 || ball.position.x < -4)
```

This line checks if a ball has moved beyond the boundaries on the X-axis (beyond `4` or `-4`):

- `ball.position.x > 4`: This checks if the ball has gone too far to the right.
- `ball.position.x < -4`: This checks if the ball has gone too far to the left.

The same logic applies to the Y-axis in the corresponding `if (ball.position.y > 4 || ball.position.y < -4)` line.

In this case, the `4` represents the edges of an invisible boundary box where the balls are confined to move, ensuring they bounce back when they hit the edges. You can think of this as defining a "play area" where the balls are allowed to move around. If a ball moves outside this boundary, its velocity is reversed (so it "bounces" back in the opposite direction).

# Velocity is direction (sort of)

Yes, when we do `ball.velocity.x *= -1;`, we are reversing the direction of the ball's movement along the X-axis.

### Velocity vs Speed:
- **Speed** refers to how fast something is moving, without considering direction. It's always a positive value.
- **Velocity** includes both **speed and direction**. It can be positive (moving in one direction) or negative (moving in the opposite direction).

In this case:

- If `ball.velocity.x` is positive, the ball is moving to the right.
- If `ball.velocity.x` is negative, the ball is moving to the left.

When we multiply `velocity.x` by `-1`, we're not changing the speed (the magnitude of velocity), but we're flipping the direction:

- A positive velocity becomes negative (right to left).
- A negative velocity becomes positive (left to right).

This is how the ball "bounces" off the walls. When it hits a boundary (like `x > 4` or `x < -4`), we reverse the velocity in that direction, making it go in the opposite direction.

# What's the 2 about?

The reason we multiply by 2 in the condition 

```js
if (dist < ballRadius * 2)
``` 

is to check whether two balls are colliding, i.e., whether the distance between their centers is less than the sum of their radii.

### Explanation:
- **`dist`**: This is the distance between the centers of two balls.
- **`ballRadius`**: This is the radius of each ball. 

For two balls to be touching (i.e., colliding), the distance between their centers must be less than or equal to the sum of their radii.

Since both balls have the same radius (`ballRadius`), the combined distance where they would just touch is `ballRadius + ballRadius`, or `ballRadius * 2`.

So, when we check `if (dist < ballRadius * 2)`, we’re determining if the distance between the two balls is less than their combined radius, which means they are overlapping or colliding.

If the distance is less than that value, the balls are considered to be colliding, and we handle the bounce or response by swapping their velocities.

# Speed

<span style="color:blue;font-size:larger;">I understand that Vector3 takes parameters x, y, z, but how does it know how fast to make it go?</span>

Great question! The speed at which the balls move is determined by the magnitude of their velocity. Let's break this down:

### Velocity in Three.js:
`THREE.Vector3(x, y, z)` represents the velocity in 3D space. In this case:

- `x` is the velocity along the X-axis.
- `y` is the velocity along the Y-axis.
- `z` is the velocity along the Z-axis (set to 0 since we’re dealing with 2D movement here).

### Random Velocity:
This line:

```js
ball.velocity = new THREE.Vector3(Math.random() * 0.05, Math.random() * 0.05, 0);
```

assigns each ball a random velocity vector. The values for `x` and `y` are random numbers between `0` and `0.05` because of `Math.random() * 0.05`.

So, the speed is essentially controlled by this `0.05` value. The `Math.random()` function generates a number between `0` and `1`, and multiplying by `0.05` scales this number down to be between `0` and `0.05`.

### How does it know the speed?
The magnitude of the velocity vector determines how fast the ball moves. The higher the values for `x` and `y`, the faster the ball will move. 

For example:

- If `Math.random()` returns a number close to `0`, the ball will move very slowly (or even not at all if `0` is returned).
- If `Math.random()` returns a number close to `1`, multiplying by `0.05` will give a velocity of `0.05` units per frame, making the ball move faster.

You can adjust the `0.05` multiplier to make the balls move faster or slower:

- Increase it for faster movement (e.g., `Math.random() * 0.1`).
- Decrease it for slower movement (e.g., `Math.random() * 0.02`).

### Example of faster ball movement:
If you want the balls to move faster, you could do something like this:

```js
ball.velocity = new THREE.Vector3(Math.random() * 0.1, Math.random() * 0.1, 0);
```

This would make the ball's speed range between `0` and `0.1` units per frame instead of `0` to `0.05`.

### Speed (magnitude) of velocity:

If you wanted to calculate the actual speed of the ball (the magnitude of the velocity vector), you could use:

```js
let speed = ball.velocity.length();
```

The `length()` method of THREE.Vector3 computes the magnitude of the vector, which is the speed of the ball in this case.

<br>

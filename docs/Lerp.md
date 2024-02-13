## Lerp

### Smooth movement in games

Imagine you're playing a video game where you can move from one point to another. Linear interpolation (lerp) is like the game's way of filling in the steps between where you are and where you want to go, making the movement look smooth instead of just popping from one spot to another.

Here's the simple formula for lerp:

result = start + (end - start) x fraction

- **start**: where you begin.
- **end**: where you want to go.
- **fraction**: how far along the path from start to end you are (usually a number between 0 and 1).

Why should you care? If you're into programming, especially making games or animations, lerp is super useful. It helps in moving objects smoothly, changing colors, or even adjusting sounds. It's a basic tool that makes a big difference in how things look and feel in your projects!

## Fraction

The `fraction` in the linear interpolation formula is a value between 0 and 1 (inclusive) that represents how far along you are from the `start` to the `end`. It's a value you choose based on the context of what you're interpolating.

For example:

- If `fraction` is 0, the result is exactly at the `start` position.
- If `fraction` is 1, the result is exactly at the `end` position.
- If `fraction` is 0.5, the result is halfway between the `start` and the `end`.

In many cases, the fraction is related to time or a progression through a sequence. For instance, if you're animating an object moving from point A to point B over 1 second, and you're at the 0.5 second mark, the `fraction` would be 0.5, indicating the object should be halfway between points A and B.

To calculate `fraction` for animation, you might use something like:

fraction = current time - start time / end time - start time

0.5 = 0.5 - 0 / 1 - 0

This formula gives you a value between 0 and 1 based on the current time within the animation's duration.

<br>

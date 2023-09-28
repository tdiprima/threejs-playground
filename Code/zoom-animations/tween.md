## Tween.js: Animation Simplified

[tween.js user guide](https://tweenjs.github.io/tween.js/docs/user_guide.html)

Tween.js is used for creating smooth animations and transitions. The name "tween" in Tween.js is derived from the term "tweening" or "in-betweening," which refers to the process of generating intermediate frames between two keyframes in animation.

In animation, keyframes are the specific frames that define the start and end points of an animation sequence. The frames in between these keyframes are generated through interpolation, which calculates the values for properties such as position, scale, or opacity to create a smooth transition between the keyframes.

The term "tween" is commonly used in the animation industry to describe these intermediate frames or the process of generating them. Tween.js simplifies the creation of these intermediate frames by providing a set of functions and methods that handle the interpolation and animation process, hence the name "tween."

By using Tween.js, developers can easily create smooth and visually appealing animations by specifying the starting and ending states of an object, and the library takes care of generating the necessary in-between frames to create the animation effect.

## Object-Based Tweening

<span style="color:#0000dd;">When creating a new tween, I've seen either coordinates OR an object being passed, such as controls.target (as in OrbitControls).</span>

```js
let tween = new TWEEN.Tween(position);
let tween = new TWEEN.Tween(controls.target);
```

In tween.js, the `new TWEEN.Tween()` constructor can accept either numerical values or objects as parameters.

When you pass **numerical values**, you are specifying the target values for the tween to animate towards.

When you pass an **object**, the tween will animate each property of the object independently.

```javascript
// Numerical values example
var position = 0;
var targetPosition = 100;
var tween = new TWEEN.Tween(position)
  .to(targetPosition, 1000) // Tween from current position to targetPosition over 1000ms
  .start();

// Object example
var object = { x: 0, y: 0 };
var targetObject = { x: 100, y: 200 };
var tween = new TWEEN.Tween(object)
  .to(targetObject, 1000) // Tween from current object properties to targetObject properties over 1000ms
  .start();
```

<span style="color:#ff00cc;">This is basically the same thing (an object is an object).  But controls.target has a whole bunch of stuff other than {...}, so.</span>

In the first example, the tween animates a numerical value from the current position (0) to the target position (100) over a duration of 1000 milliseconds.

In the second example, the tween animates an object with properties `x` and `y` from its current values `{ x: 0, y: 0 }` to the target values `{ x: 100, y: 200 }` over a duration of 1000 milliseconds.

You can use this **object-based approach** to animate multiple properties of an object simultaneously.

## Three and Tween Example

Animate a rotating cube:

<span style="color:#59acf3;font-size:larger;">zoom-animations/tween-cube.html</span>

To animate the cube, we define an initial rotation value and create a tween animation using Tween.js.

In this case, we **rotate the cube 360 degrees** around the y-axis in 2 seconds.

We use the `onUpdate` callback to update the cube's rotation on each frame.

Finally, we start the animation by calling `.start()` on the tween. We also set up a separate update loop using `TWEEN.update()` and `requestAnimationFrame` to update the Tween.js animations on each frame.

When you open this HTML file in a browser, you should see a green cube rotating continuously.

## Example

Here's ahow you can use Tween.js to animate the position of an HTML element:

<span style="color:#59acf3;font-size:larger;">move-a-box.html</span>

In this example, we include the Tween.js library from a CDN (Content Delivery Network). We create a red box element with the id "box" and position it absolutely using CSS. 

We then define a new tween using `new TWEEN.Tween()` and specify the **initial** and **target values** for the animation.

In this case, we animate the 'x' property from 0 to 200 over a duration of 2 seconds. We also specify the easing function as quadratic easing for smooth acceleration and deceleration.

The `onUpdate` callback is called on each frame update of the tween, where we update the position of the box element by changing its `left` CSS property.

Finally, we create an `animate` function that uses `requestAnimationFrame` to continuously update the tween, and we call `TWEEN.update()` to update the tween on each frame.

When you open the HTML file in a web browser, you should see the red box smoothly moving from the left side of the window to the right over a period of 2 seconds.

<br>

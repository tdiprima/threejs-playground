## Tween.js: Animation Simplified

What the h3ll is a "tween"?

[tween.js user guide](https://tweenjs.github.io/tween.js/docs/user_guide.html)

Tween.js is used for creating smooth animations and transitions. The name "tween" in Tween.js is derived from the term "tweening" or "in-betweening," which refers to the process of generating intermediate frames between two keyframes in animation.

In animation, keyframes are the specific frames that define the start and end points of an animation sequence. The frames in between these keyframes are generated through interpolation, which calculates the values for properties such as position, scale, or opacity to create a smooth transition between the keyframes.

The term "tween" is commonly used in the animation industry to describe these intermediate frames or the process of generating them. Tween.js simplifies the creation of these intermediate frames by providing a set of functions and methods that handle the interpolation and animation process, hence the name "tween."

By using Tween.js, developers can easily create smooth and visually appealing animations by specifying the starting and ending states of an object, and the library takes care of generating the necessary in-between frames to create the animation effect.

## Object-Based Tweening

When creating a new tween, I've seen either coordinates OR an object being passed, such as `controls.target` (as in OrbitControls).

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

```php
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Three.js with Tween.js Example</title>
    <style>
      body { margin: 0; }
      canvas { display: block; }
    </style>
  </head>
  <body>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>
    <script>
      // Set up the scene, camera, and renderer
      let scene = new THREE.Scene();

      let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      let renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Create a cube
      let geometry = new THREE.BoxGeometry();
      let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      // Set up the animation
      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }

      // Add rotation animation using Tween.js
      let rotation = { y: 0 }; // Initial rotation value

      // Configure the tween animation
      let tween = new TWEEN.Tween(rotation)
        .to({ y: Math.PI * 2 }, 2000) // Rotate 360 degrees in 2 seconds
        .easing(TWEEN.Easing.Quadratic.Out) // Use quadratic easing for smooth animation
        .onUpdate(() => {
          cube.rotation.y = rotation.y; // Update cube rotation
        })
        .start(); // Start the animation

      // Start the rendering and update loop
      animate();

      // Update Tween.js on each frame
      function updateTween() {
        TWEEN.update();
        requestAnimationFrame(updateTween);
      }
      updateTween();
    </script>
  </body>
</html>
```

In this example, we first set up the Three.js scene by creating a scene, camera, and renderer. Then, we create a cube and add it to the scene.

Next, we set up the animation loop using the `requestAnimationFrame` function. Inside the loop, we call `renderer.render(scene, camera)` to render the scene.

To animate the cube, we define an initial rotation value and create a tween animation using Tween.js.

In this case, we **rotate the cube 360 degrees** around the y-axis in 2 seconds.

We use the `onUpdate` callback to update the cube's rotation on each frame.

Finally, we start the animation by calling `.start()` on the tween. We also set up a separate update loop using `TWEEN.update()` and `requestAnimationFrame` to update the Tween.js animations on each frame.

When you open this HTML file in a browser, you should see a green cube rotating continuously.

## Example

Here's ahow you can use Tween.js to animate the position of an HTML element:

```php
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Tween.js Example</title>
  <style>
    #box {
      width: 100px;
      height: 100px;
      background-color: red;
      position: absolute;
    }
  </style>
</head>
<body>
<div id="box"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tween.js/18.6.4/tween.umd.js"></script>

<script>
  let box = document.getElementById('box'); // Get the element we want to animate.

  let coords = { x: 0, y: 0 }; // Start at (0, 0)

  // Create a new tween
  let tween = new TWEEN.Tween(coords, false)
    .to({ x: 200, y: 0 }, 2000) // Animate from x = 0 to x = 200 over 2 seconds
    .easing(TWEEN.Easing.Quadratic.InOut) // Use quadratic easing
    .onUpdate(() => {
      // Update the box's position
      box.style.left = `${coords.x}px`;
      // box.style.setProperty('transform', `translate(${coords.x}px, ${coords.y}px)`);
    })
    .start() // Start the tween animation

  // Update the tween on each frame
  function animate(time) {
    tween.update(time)
    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate);
</script>
</body>
</html>
```

In this example, we include the Tween.js library from a CDN (Content Delivery Network). We create a red box element with the id "box" and position it absolutely using CSS. 

We then define a new tween using `new TWEEN.Tween()` and specify the **initial** and **target values** for the animation.

In this case, we animate the 'x' property from 0 to 200 over a duration of 2 seconds. We also specify the easing function as quadratic easing for smooth acceleration and deceleration.

The `onUpdate` callback is called on each frame update of the tween, where we update the position of the box element by changing its `left` CSS property.

Finally, we create an `animate` function that uses `requestAnimationFrame` to continuously update the tween, and we call `TWEEN.update()` to update the tween on each frame.

When you open the HTML file in a web browser, you should see the red box smoothly moving from the left side of the window to the right over a period of 2 seconds.

<br>

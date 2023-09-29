## Zoom into a corner of the image using gsap.js

You can use the gsap library to animate the **camera's position** and **field of view.**

<a href="">bears.html</a>

In the above code, we added **two `gsap.to()` animations.**

The first one animates the camera's `position` property to zoom into the desired corner of the image.

The `x`, `y`, and `z` values specify the target position, where `(0, 0)` is the center of the image plane. (Adjust these values according to the desired corner you want to zoom into.)

The second animation animates the camera's `fov` (field of view) property to control the zoom level.

A smaller value of `fov` will result in a closer zoom. Adjust the `fov` value according to the desired zoom level.

Make sure to place the gsap animations after the initialization code for the camera, renderer, and scene. This way, the image will be loaded before the animations start.

## Camera z position and fov

<span style="color:#0000dd;">What do you mean I have to set the fov?  I thought setting the camera's z position to 0.5 would be sufficient.  (I want to zoom in; not out).</span>

The field of view (fov) of the camera controls how wide or narrow the view is. A smaller fov value makes the view appear zoomed in, while a larger fov value makes the view appear zoomed out.

When you **set the camera's z position** to 0.5, it determines how close or far the camera is from the scene. However, it doesn't directly control the zoom level. The camera's position affects the perspective of the scene, but to achieve a zoom effect, we also need to adjust the camera's field of view.

By **modifying the fov value**, you can control the zoom level. A smaller fov value will make the scene appear more zoomed in, as if you are getting closer to the image. Conversely, a larger fov value will make the scene appear more zoomed out, as if you are moving away from the image.

<span style="color:red;">It did not, in fact, appear to do anything...</span>

In the code example I provided earlier, the **`gsap.to(camera, ...)`** animation is used to **gradually change the camera's fov** value over time. This animation creates a zoom effect by smoothly adjusting the zoom level from its initial value to the target value specified in the animation. The `ease` property determines the animation's smoothness.

So, to summarize, <mark>**changing the camera's z position alone won't give you a zoom effect.**</mark> You also need to adjust the camera's fov value to control the zoom level and achieve the desired zoom effect in three.js.

## Easing is easy

```js
// The_Great_Pumpkin.html
let rotation = { y: 0 };

gsap.to(rotation, {
  y: Math.PI * 2,
  duration: 2,
  onUpdate: function () {
    cube.rotation.y = rotation.y;
  },
  ease: "power2.out", // <-- This guy!
  onComplete: function () {
    console.log("Animation completed!");
  }
});
```

### "Quadratic Easing Effect"

The "quadratic" part in "power2.out" indicates that the easing effect follows a quadratic equation, resulting in a smooth animation with an "out" effect, starting quickly and slowing down towards the end.

<br>

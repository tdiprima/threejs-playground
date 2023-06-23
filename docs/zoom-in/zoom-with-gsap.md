## Zoom into a corner of the image using gsap.js

You can use the gsap library to animate the **camera's position** and **field of view.**

Script tag:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
```

JavaScript code:

```js
console.log(`%cREVISION ${THREE.REVISION}`, "color: #ff00cc;");
let imgSrc = "/images/image1.jpg";
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let texture = new THREE.TextureLoader().load(imgSrc);
let geometry = new THREE.PlaneGeometry(1, 0.75);
let material = new THREE.MeshBasicMaterial({map: texture});
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();

// Zoom animation using gsap
gsap.to(camera.position, {
  duration: 2,
  x: 0.5, // target x position
  y: 0.5, // target y position
  z: 2,   // target z position
  ease: "power2.inOut"
});

gsap.to(camera, {
  duration: 2,
  fov: 40, // target field of view (zoom level)
  ease: "power2.inOut"
});
```

<br>

In the above code, we added **two `gsap.to()` animations.**

The first one animates the camera's `position` property to zoom into the desired corner of the image.

The `x`, `y`, and `z` values specify the target position, where `(0, 0)` is the center of the image plane. (Adjust these values according to the desired corner you want to zoom into.)

The second animation animates the camera's `fov` (field of view) property to control the zoom level.

A smaller value of `fov` will result in a closer zoom. Adjust the `fov` value according to the desired zoom level.

Make sure to place the gsap animations after the initialization code for the camera, renderer, and scene. This way, the image will be loaded before the animations start.

## Camera z position and fov

What do you mean I have to set the fov in order to zoom?  I thought setting the camera's z position to 0.5 would be sufficient.  (I want to zoom in; not out).

The field of view (fov) of the camera controls how wide or narrow the view is. A smaller fov value makes the view appear zoomed in, while a larger fov value makes the view appear zoomed out.

When you **set the camera's z position** to 0.5, it determines how close or far the camera is from the scene. However, it doesn't directly control the zoom level. The camera's position affects the perspective of the scene, but to achieve a zoom effect, we also need to adjust the camera's field of view.

By **modifying the fov value**, you can control the zoom level. A smaller fov value will make the scene appear more zoomed in, as if you are getting closer to the image. Conversely, a larger fov value will make the scene appear more zoomed out, as if you are moving away from the image.

In the code example I provided earlier, the `gsap.to(camera, ...)` animation is used to gradually change the camera's fov value over time. This animation creates a zoom effect by smoothly adjusting the zoom level from its initial value to the target value specified in the animation. The `ease` property determines the animation's smoothness.

So, to summarize, changing the camera's z position alone won't give you a zoom effect. You also need to adjust the camera's fov value to control the zoom level and achieve the desired zoom effect in three.js.

<br>

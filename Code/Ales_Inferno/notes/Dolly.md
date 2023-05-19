## Dolly Operations in Three.js

[mult\_2d\_images.html](../mult_2d_images.html)

Let me explain the concept of "dolly operation" in a way that's easy to understand.

In **filmmaking**, a dolly is a tool that helps move the camera closer to or farther away from the subject or scene being filmed. It allows the camera to smoothly change its position and adjust the distance between the camera and the subject. This movement is called a "dolly operation."

Now, let's bring this concept into the world of Three.js and the OrbitControls library. In Three.js, you can create 3D scenes and view them from **different perspectives** using a virtual camera. The camera acts like your eyes in the virtual world, determining what you see on the screen.

The OrbitControls library is a tool in Three.js that allows you to **control the camera's movement.** It enables you to rotate the camera around a specific target point, zoom in and out, and move the camera closer to or farther away from the target point.

**Adjusting the distance** between the camera and its target point, which is what the dolly operation does, is useful for a couple of reasons. Firstly, it helps you focus on different parts of the 3D scene. If you want to get a closer look at an object or feature in the scene, you can use the dolly operation to move the camera closer to it. Similarly, if you want to see the entire scene from a wider perspective, you can move the camera farther away.

Secondly, adjusting the distance can also help you create dynamic and engaging animations or transitions. By smoothly changing the camera's distance from the target point, you can create a sense of **movement and depth** in your 3D scene. It adds an extra dimension to the viewing experience and can make the scene feel more immersive.

So, in summary, the dolly operation, which involves adjusting the distance between the camera and its target point, is important in Three.js and the OrbitControls library because it allows you to focus on different parts of the scene, explore different perspectives, and create dynamic animations or transitions in your 3D world.

## Behind the scenes

Here's a simple example to demonstrate the dolly operation using Three.js and the OrbitControls library. In this example, we'll create a 3D scene with a cube, and you'll be able to use the dolly operation to move the camera closer to or farther away from the cube.

```php
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dolly</title>
  <style>
    body { margin: 0; }
  </style>
</head>
<body>
  <script type="importmap">{
    "imports": {
      "three": "/build/three.module.js",
      "three/addons/": "/jsm/"
    }
  }
  </script>
  <script async src="/es-module-shims-1.3.6/dist/es-module-shims.js"></script>

  <script type="module">
    import * as THREE from "three";
    import {OrbitControls} from "three/addons/controls/OrbitControls.js";

    // Set up the scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Set up the camera controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Set the initial position of the camera and target
    camera.position.z = 5;
    controls.target.set(0, 0, 0);

    // Render the scene
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();
  </script>
</body>
</html>
```

<br>

In this example, the camera is initially positioned at a distance of 5 units along the z-axis from the cube. You can use your mouse or touch gestures to control the camera movement using the OrbitControls library.

To dolly in or out, you can use the mouse wheel or pinch-to-zoom gesture. Try scrolling the mouse wheel forward or backward or use two fingers to pinch or spread on a touch device. As you do this, you'll notice the camera moving closer to or farther away from the cube, allowing you to see it from different distances.

Feel free to modify the example by adding more objects or experimenting with different camera positions and target points to see how the dolly operation affects the viewing experience.

## OrbitControls Dolly Method

When might one manually use the "dolly" method?  `controls.dolly(...)`?

Great question! While the OrbitControls library handles the dolly operation automatically based on user input, there might be situations where you'd want to manually use the `dolly` method provided by the OrbitControls instance, `controls.dolly(...)`. Here are a few scenarios where you might find it useful:

1. **Programmatic Control:** If you want to control the camera movement programmatically without relying on user input, you can use the `dolly` method. For example, you might want to create a scripted animation where the camera moves closer to or farther away from a specific object or point in the scene at a certain speed or time interval.

2. **Triggered Events:** You can use the `dolly` method in response to specific events or interactions in your application. For instance, you might have buttons or UI elements that, when clicked, trigger the camera to dolly in or out to predefined positions or distances.

3. **Custom Controls:** If you're building a custom camera control system or extending the functionality of the OrbitControls library, you might utilize the `dolly` method to implement specialized camera movements. This could include complex camera paths, following specific curves or trajectories, or integrating additional logic and constraints.

By **manually invoking** the `dolly` method, you have fine-grained control over the camera's dolly operation, enabling you to create specific camera movements or respond to events in a customized manner. It gives you the flexibility to integrate camera adjustments seamlessly into your application or to implement unique camera behaviors tailored to your specific use case.

Remember, the `dolly` method takes parameters that define **how much** to dolly and in **which direction.** For example, `controls.dolly(1)` would dolly the camera closer to the target point, while `controls.dolly(-1)` would move it farther away. The magnitude of the value determines the speed or distance of the dolly operation.

## My Example

```js
controls.dolly(Math.exp(distance * -0.01));
```

`Math.exp(distance * -0.01)` calculates the **exponential value** of `distance * -0.01`.

The `distance` variable represents the distance between the camera and its target point.

`distance * -0.01` indicates that the camera will be moved by a factor relative to the distance. A negative value indicates that the camera will be moved closer to the target, while a **positive value** would **move it farther away.**

`Math.exp()` calculates the exponential value of a given number. In this case, it is used to convert the distance factor into an exponential value.

The specific value `-0.01` and the exponential calculation might be chosen based on the desired behavior and aesthetic preference for camera movement.

<br>

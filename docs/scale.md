## Scale Image for HTML5 Canvas

<span style="color:#0000dd;">If I have an html5 canvas size 512 x 256, and I have an image of size 1024 x 512, how can I load the image using three.js such that the image is scaled to the size of the canvas, while retaining the information of the original image size?</span>

To load and scale an image while retaining the information of the original image size, you can use the `TextureLoader` and `PlaneGeometry` classes.

```javascript
// Create a scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, 512 / 256, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ canvas: yourCanvasElement });

// Set up the image dimensions
var imageWidth = 1024;
var imageHeight = 512;

// Load the image texture
var textureLoader = new THREE.TextureLoader();
textureLoader.load("/images/demo.jpg", function (texture) {
  // Scale the image to fit the canvas
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.5, 0.5); // Adjust the repeat values to fit the canvas

  // Create a plane with the image texture
  var planeGeometry = new THREE.PlaneGeometry(1, 0.5); // Set the plane size to match the canvas aspect ratio
  var material = new THREE.MeshBasicMaterial({ map: texture });
  var plane = new THREE.Mesh(planeGeometry, material);
  scene.add(plane);

  // Position the camera to see the plane
  camera.position.z = 1.5;

  // Render the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});
```

<br>

First, define the dimensions of your image (1024x512) and the canvas (512x256).

Next, you use the `TextureLoader` to load the image texture.

Inside the `load` callback function, you **scale the texture to fit the canvas** using the `wrapS`, `wrapT`, and `repeat` properties. Adjust the `repeat` values to scale the image correctly.

Then, you create a `PlaneGeometry` with a size of 1x0.5 to match the canvas **aspect ratio.**

You create a `MeshBasicMaterial` and set the loaded texture as the map.

Finally, you create a `mesh` with the `geometry` and `material` and add it to the scene.

You position the `camera` to see the plane, and then you create an `animate` function that calls the `renderer` to continuously update and render the scene.

`yourCanvasElement` = your HTML5 canvas element where you want to display the image.

<br>

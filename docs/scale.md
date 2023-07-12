## Scale Image

That's all you do.  Set it in the PlaneGeometry.  How hard is it to just tell me that?

```javascript
var planeGeometry = new THREE.PlaneGeometry(10, 5);
var planeGeometry = new THREE.PlaneGeometry(5, 2.5);
```

## Grr.

Image: 1024 x 512<br>
Canvas: 512 x 256<br>
Scale the image (for display), don't just crop it.<br>
<span style="color:green;font-weight:bold;">Go.</span>

To load and scale an image while retaining the information of the original image size, you can use the `TextureLoader` and `PlaneGeometry` classes.

### Right size, but it's a clipping.

What did I just say?

```html
<div id="container"></div>
```

```javascript
// Set up the desired dimensions
let canvDim = { w: 512, h: 256 };

// Create a scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, canvDim.w / canvDim.h, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

let container = document.getElementById('container');
container.appendChild(renderer.domElement);

// Load the image texture
let textureLoader = new THREE.TextureLoader();
textureLoader.load('/images/Victoriosa.jpg', texture => {
  // Scale the image to fit the canvas
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.5, 0.5); // Adjust the repeat values to fit the canvas

  let imageAspectRatio = texture.image.width / texture.image.height;
  console.log('%cimageAspectRatio', 'color: #ccff00;', imageAspectRatio);

  // Create a plane with the image texture
  let planeGeometry = new THREE.PlaneGeometry(imageAspectRatio, 1);
  // let planeGeometry = new THREE.PlaneGeometry(1, 0.5); // Set the plane size to match the canvas aspect ratio
  let material = new THREE.MeshBasicMaterial({ map: texture });
  let plane = new THREE.Mesh(planeGeometry, material);
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

## Scale image to plane

To scale down the loaded image and display it on a PlaneGeometry with a specific size, you can adjust the scale of the plane's material.

### A small section of the image fills the whole screen

Seriously?  Wtf.

```javascript
// Define the desired size for the plane
let canvDim = { w: 512, h: 256 };

// Create a scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, canvDim.w / canvDim.h, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

let container = document.getElementById('container');
container.appendChild(renderer.domElement);

// Create the PlaneGeometry with the desired size
const planeGeometry = new THREE.PlaneGeometry(canvDim.w, canvDim.h);

// Create a TextureLoader instance
const textureLoader = new THREE.TextureLoader();

// Load the image texture
textureLoader.load('/images/Victoriosa.jpg', function(texture) {
  // Scale the texture to fit the desired plane size
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  // Create a material using the texture
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create the plane mesh with the geometry and material
  const plane = new THREE.Mesh(planeGeometry, material);

  // Add the plane to the scene
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

We first define the desired size for the plane using `planeWidth` and `planeHeight`. Then, we create a `PlaneGeometry` instance with the specified size.

Next, we create a `TextureLoader` instance and load the image texture using the `load` method. Inside the callback function, we can manipulate the loaded texture. In this case, we set the texture wrapping, filtering, and scaling properties to ensure it fits the desired plane size.

We then create a `MeshBasicMaterial` with the loaded texture and use it to create a plane mesh (`THREE.Mesh`) with the geometry and material. Finally, we add the plane to the scene.

By scaling the texture to fit the plane size, the image will be displayed at the specified dimensions (500 x 300 in this case).

## Image Scaling Issue Fixed

<span style="color:#0000dd;font-weight:bold;">¿Me puedes ayudar?</span>

To display the image at the desired size of 512x256 pixels instead of cropping it, you need to adjust the scale of the plane geometry.

Currently, the plane is being created with a width-to-height ratio equal to the image aspect ratio, which causes the cropping effect.

Here's an updated version of your code that scales the plane geometry to fit the desired size while maintaining the image's aspect ratio:

```javascript
// Define the desired size for the plane
let canvDim = { w: 512, h: 256 };

// Create a scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, canvDim.w / canvDim.h, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

let container = document.getElementById('container');
container.appendChild(renderer.domElement);

// Load the image texture
let textureLoader = new THREE.TextureLoader();
textureLoader.load('/images/Victoriosa.jpg', texture => {
  // Calculate the scale factors to fit the image in the canvas
  let imageAspectRatio = texture.image.width / texture.image.height;
  let canvasAspectRatio = canvDim.w / canvDim.h;
  let scaleX = 1;
  let scaleY = 1;

  if (imageAspectRatio > canvasAspectRatio) {
    scaleX = canvasAspectRatio / imageAspectRatio;
  } else {
    scaleY = imageAspectRatio / canvasAspectRatio;
  }

  // Create a plane with the adjusted scale
  let planeGeometry = new THREE.PlaneGeometry(scaleX, scaleY);
  let material = new THREE.MeshBasicMaterial({ map: texture });
  let plane = new THREE.Mesh(planeGeometry, material);
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
<span style="color:deeppink;font-weight:bold;">Close enough.  It should be:</span>

```js
// Aspect ratio (1:0.5 or 2:1)
let scaleX = 2;
let scaleY = 1;

// Scale down by factor of 2
scaleX = scaleX / 2;
scaleY = scaleY / 2;
```

<br>

In this updated code, the scale factors `scaleX` and `scaleY` are calculated based on the image's aspect ratio and the canvas's aspect ratio. These scale factors are then used to adjust the plane's geometry accordingly. By doing this, the image will be scaled to fit the canvas while maintaining its original aspect ratio.

<br>

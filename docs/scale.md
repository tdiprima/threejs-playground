## Image Scaling Issue Fixed

Kinda like <span style="color:#59acf3;">image\_clicked\_coords.html</span> or <span style="color:#59acf3;">image\_drawing\_coords.html</span>.

That's all you do.  Set it in the PlaneGeometry.

```javascript
let planeGeometry = new THREE.PlaneGeometry(10, 5);
let planeGeometry = new THREE.PlaneGeometry(5, 2.5);
```

To display the image at the desired size of 512x256 pixels instead of 1024x512, you need to adjust the scale of the plane geometry.

Currently, the plane is being created with a width-to-height ratio equal to the image aspect ratio, which causes the cropping effect.

Here's an updated version of your code that scales the plane geometry to fit the desired size while maintaining the image's aspect ratio.  <span style="color:deeppink;">Scroll down.</span>

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
<span style="color:deeppink;font-size:larger;">Close enough.  It should be:</span>

```js
// Aspect ratio (1:0.5 or 2:1)
let scaleX = 2;
let scaleY = 1;

// Scale down by factor of 2
scaleX = scaleX / 2;
scaleY = scaleY / 2;
```

In this updated code, the scale factors `scaleX` and `scaleY` are calculated based on the image's aspect ratio and the canvas's aspect ratio. These scale factors are then used to adjust the plane's geometry accordingly. By doing this, the image will be scaled to fit the canvas while maintaining its original aspect ratio.

<br>

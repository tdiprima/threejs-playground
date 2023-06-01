## Image Drawing Coordinates

Below is an example JavaScript program using Three.js that allows the user to load an image, draw on it, and retrieve the coordinates of the user's drawing. The program will write the actual image coordinates of the freedrawing to the console.

To get started, make sure you have included the Three.js library in your HTML file. You can include it using the following script tag:

```html
<script src="/build/three.min.js"></script>
```

<br>

Once you have Three.js included, you can use the following JavaScript code:

```javascript
// Create a scene
let scene = new THREE.Scene();

// Create a camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane object to hold the texture
let plane;

// Load the image as a texture
let textureLoader = new THREE.TextureLoader();
textureLoader.load('/images/image1.jpg', function(texture) {
  let imageAspectRatio = texture.image.width / texture.image.height;
  let planeGeometry = new THREE.PlaneGeometry(imageAspectRatio, 1);
  let planeMaterial = new THREE.MeshBasicMaterial({
    map: texture
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
});

// Create an array to store the coordinates of the user's drawing
let drawingCoordinates = [];

// Event handler for when the user clicks and drags on the canvas
let mouseDown = false;
document.addEventListener('mousedown', function() {
  mouseDown = true;
});

document.addEventListener('mouseup', function() {
  mouseDown = false;
});

document.addEventListener('mousemove', function(event) {
  if (mouseDown && plane) {
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObject(plane);

    if (intersects.length > 0) {
      let point = intersects[0].point;
      drawingCoordinates.push({
        x: point.x,
        y: point.y
      });
    }
  }
});

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Event handler for when the user finishes drawing
document.addEventListener('mouseup', function() {
  console.log(drawingCoordinates);
  drawingCoordinates = [];
});
```

<br>

When you run this code, the image will be loaded onto the canvas created by Three.js.

The user can click and drag on the canvas to draw.

The program will retrieve the coordinates of each point in the drawing and store them in the `drawingCoordinates` array.

When the user releases the mouse button, the program will log the `drawingCoordinates` array to the console.

<br>

## Image Drawing Coordinates

Below is an example JavaScript program that allows the user to load an image, draw on it, and retrieve the coordinates of the user's drawing.

The program will write the actual image coordinates of the freedrawing to the console.

```html
<script src="/build/three.min.js"></script>
```

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

// Event handler for when the user finishes drawing
document.addEventListener('mouseup', function() {
  mouseDown = false;
  console.log(drawingCoordinates);
  drawingCoordinates = [];
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
```

<br>

When you run this code, the image will be loaded onto the canvas created by Three.js.

The user can click and drag on the canvas to draw.

The program will retrieve the coordinates of each point in the drawing and store them in the `drawingCoordinates` array.

When the user releases the mouse button, the program will log the `drawingCoordinates` array to the console.

## OK, Where's the line?

To make a black line appear on the screen where the user draws, you can add the following code inside the **'mousedown'** event listener:

```javascript
let material = new THREE.LineBasicMaterial({ color: 0x000000 });
let geometry = new THREE.BufferGeometry();
let positions = new Float32Array(1000 * 3); // Assuming a maximum of 1000 points
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
let line = new THREE.Line(geometry, material);
scene.add(line);
let index = 0;
```

This code creates a new `THREE.Line` object with a black color material (`LineBasicMaterial`) and an initially empty geometry (`BufferGeometry`). It then adds the line to the scene. We also create an `index` variable to keep track of the current index in the positions array.

Now, inside the **'mousemove'** event listener, after capturing the drawing coordinates, you can update the line's geometry and positions array to reflect the user's drawing:

```javascript
if (intersects.length > 0) {
  let point = intersects[0].point;
  drawingCoordinates.push({ x: point.x, y: point.y });

  if (index < positions.length) {
    positions[index++] = point.x;
    positions[index++] = point.y;
    positions[index++] = 0;
  } else {
    console.warn('Drawing limit exceeded');
  }

  geometry.attributes.position.needsUpdate = true;
}
```

In this code, we add the captured point to the `drawingCoordinates` array as before. Then, we check if the `index` is within the limits of the `positions` array. If it is, we update the positions array with the x, y, and z coordinates of the point and increment the index accordingly. We also set `geometry.attributes.position.needsUpdate` to `true` to notify three.js that the geometry has been updated.

By doing this, the line's geometry will dynamically grow as the user draws on the canvas, and a black line will appear to represent the user's strokes.

Make sure to add this code inside the 'mousemove' event listener, after capturing the drawing coordinates.

## 125 Fubar

I didn't ASK for a conversion to revision 125, yet here we are.

```javascript
// After texture loader
let material = new THREE.LineBasicMaterial({ color: 0x000000 });
let geometry = new THREE.BufferGeometry();
let positions = [];
let line;

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
      drawingCoordinates.push({ x: point.x, y: point.y });

      positions.push(point.x, point.y, 0);
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

      if (!line) {
        line = new THREE.Line(geometry, material);
        scene.add(line);
      }
    }
  }
});
```

In this updated code, the primary changes are related to the creation and update of the line geometry. Instead of using a `Float32Array` directly, we use an empty array called `positions` to store the line's coordinates.

Inside the 'mousemove' event listener, after capturing the drawing coordinates, we push the x, y, and z coordinates of the point to the `positions` array. Then, we update the `geometry` by creating a new `THREE.Float32BufferAttribute` with the updated `positions` array. If the `line` does not exist, we create a new `THREE.Line` object with the updated geometry and add it to the scene.

By making these changes, the code should work with three.js revision 125, and you should see the black line appearing as you draw on the canvas.

## Drawn Coordinates to 3D Line

<span style="color:#0000dd;">How do I use a Line to draw an array of x,y coordinates?</span>

To use the array of x and y coordinates to create a line using `THREE.Line`, you need to convert those 2D coordinates into 3D coordinates in the scene.

```javascript
// Assuming you have an array of x, y coordinates called 'coordinates'
// Create a THREE.Geometry object to hold the line vertices
let lineGeometry = new THREE.Geometry();

// Loop through the coordinates and add them to the lineGeometry
for (let i = 0; i < coordinates.length; i++) {
  let x = coordinates[i].x; // x-coordinate
  let y = coordinates[i].y; // y-coordinate

  // Convert 2D coordinates to 3D coordinates
  let vector = new THREE.Vector3(x, y, 0);

  // Add the vector to the lineGeometry
  lineGeometry.vertices.push(vector);
}

// Create a material for the line
let lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Create a line object using the lineGeometry and lineMaterial
let line = new THREE.Line(lineGeometry, lineMaterial);

// Add the line to your scene
scene.add(line);
```

<br>

In this example, we create a `THREE.Geometry` object called `lineGeometry` to store the line vertices. We then loop through the `coordinates` array, convert each 2D coordinate to a 3D coordinate using `THREE.Vector3`, and add it to the `lineGeometry.vertices` array.

After that, we create a material for the line using `THREE.LineBasicMaterial`, specifying the color. Finally, we create a `THREE.Line` object with the `lineGeometry` and `lineMaterial`, and add it to your scene using `scene.add(line)`.

<br>

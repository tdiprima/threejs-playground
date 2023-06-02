I have a three.js script where I am loading an image, plus letting the user free-draw.  My free-draw part works, but the image doesn't show up.  The thing that makes the image disappear is "planeMaterial.map = canvasTexture;"
Can you see what's wrong?

The issue you're facing is related to the order in which you're setting the texture for the material and updating the canvas texture.

In your code, you're setting the canvas texture to the `planeMaterial.map` property before any drawing occurs on the canvas. At that point, the canvas is empty, and as a result, the image texture appears to be missing.

To fix this issue, you should update the canvas texture only after you have drawn something on the canvas. Here's the modified code:

```javascript
// ...

let canvasTexture = new THREE.CanvasTexture(canvas);

// ...

// allow the user to draw on the canvas
function onCanvasMouseDown(event) {
  isDrawing = true;
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;
  context.beginPath();
  context.moveTo(x, y);
}

function onCanvasMouseMove(event) {
  if (isDrawing) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    context.lineTo(x, y);
    context.stroke();

    // Move this line inside the if statement
    canvasTexture.needsUpdate = true;
  }
}

// ...

(function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
})();
```

By moving `canvasTexture.needsUpdate = true;` inside the `if (isDrawing)` block, the canvas texture will only be updated when there is an actual drawing action taking place. This way, the image texture will be visible while allowing the user to free-draw on top of it.

I hope this helps! Let me know if you have any further questions.


## He literally just handed me back my own code

I apologize for the confusion caused by my previous response. You're right, the code I provided didn't address the specific issue you mentioned.

To ensure that both the image texture and the user's drawing are visible, you need to use a different material for the plane that supports both the image texture and the dynamic canvas texture. One option is to use `THREE.MeshBasicMaterial` for the image texture and `THREE.MeshBasicMaterial` for the canvas texture, and then combine them using `THREE.MeshFaceMaterial`.

Here's the modified code that incorporates this approach:

```javascript
// ...

let textureLoader = new THREE.TextureLoader();
let imageTexture = textureLoader.load("/images/earth.jpg");

// Create a canvas element and add it as a texture to the plane geometry
let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext("2d");

context.strokeStyle = "#FF0000";
context.lineWidth = 5;

// allow the user to draw on the canvas
function onCanvasMouseDown(event) {
  isDrawing = true;
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;
  context.beginPath();
  context.moveTo(x, y);
}

function onCanvasMouseMove(event) {
  if (isDrawing) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    context.lineTo(x, y);
    context.stroke();
    // Tell three.js to update the texture with the latest contents of the canvas
    imageTexture.needsUpdate = true;
  }
}

// ...

// Create materials
let imageMaterial = new THREE.MeshBasicMaterial({ map: imageTexture });
let canvasMaterial = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(canvas) });

// Combine materials
let materials = [imageMaterial, canvasMaterial];
let faceMaterial = new THREE.MeshFaceMaterial(materials);

let plane = new THREE.Mesh(planeGeometry, faceMaterial);
scene.add(plane);

// ...

(function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
})();
```

In this modified code, I've separated the image texture material (`imageMaterial`) and the canvas texture material (`canvasMaterial`). Then, I've combined them using `THREE.MeshFaceMaterial`, which allows you to apply multiple materials to different faces of the mesh. The image texture is applied to one face, while the canvas texture is applied to another face.

This way, the image texture will remain visible even after the user starts drawing on the canvas.

I apologize for the confusion caused by my previous response, and I hope this solution resolves the issue. Let me know if you have any further questions!


## MeshFaceMaterial doesn't exist anymore.  Is there another way to include the 2 materials imageMaterial and canvasMaterial?

Apologies for the outdated information. You're correct that `THREE.MeshFaceMaterial` is no longer available in the latest version of Three.js. Instead, you can achieve the desired effect using `THREE.MeshStandardMaterial` with multiple maps.

Here's an updated version of the code that combines the image texture and canvas texture using two materials on different sides of the plane:

```javascript
// ...

let textureLoader = new THREE.TextureLoader();
let imageTexture = textureLoader.load("/images/earth.jpg");

// Create a canvas element and add it as a texture to the plane geometry
let canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext("2d");

context.strokeStyle = "#FF0000";
context.lineWidth = 5;

// allow the user to draw on the canvas
function onCanvasMouseDown(event) {
  isDrawing = true;
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;
  context.beginPath();
  context.moveTo(x, y);
}

function onCanvasMouseMove(event) {
  if (isDrawing) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    context.lineTo(x, y);
    context.stroke();
    // Tell three.js to update the texture with the latest contents of the canvas
    imageTexture.needsUpdate = true;
  }
}

// ...

// Create materials
let imageMaterial = new THREE.MeshStandardMaterial({ map: imageTexture });
let canvasMaterial = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(canvas) });

// Create a group to hold the front and back faces of the plane
let group = new THREE.Group();

// Create the front face with the image material
let frontPlane = new THREE.Mesh(planeGeometry, imageMaterial);
group.add(frontPlane);

// Create the back face with the canvas material
let backPlane = new THREE.Mesh(planeGeometry, canvasMaterial);
backPlane.rotation.y = Math.PI; // Rotate the back face by 180 degrees
group.add(backPlane);

scene.add(group);

// ...

(function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
})();
```

In this updated code, I've used `THREE.MeshStandardMaterial` instead of `THREE.MeshBasicMaterial` to support more advanced material features. The image texture is applied to the front face, and the canvas texture is applied to the back face of the plane.

To achieve this effect, I've created a `THREE.Group` to hold both faces of the plane. The front face is a regular mesh with the image material, while the back face is another mesh with the canvas material. I've rotated the back face by 180 degrees (`Math.PI`) to make it face the opposite direction.

By using this approach, you can display both the image texture and the user's drawing simultaneously.

I apologize for any inconvenience caused by my previous responses, and I hope this updated solution helps. Let me know if you have any further questions!


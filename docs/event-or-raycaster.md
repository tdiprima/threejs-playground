## Add Event to Image

TL;DR

<mark>**Either use or make a control like DragControls.**</mark>

OK.  How about using a raycaster instead of a click event?

**You are a genius, Tam-tam. :)**

Using a raycaster can provide more flexibility and precision when dealing with mouse interactions in a 3D scene.

Here's how to use a raycaster to handle mouse clicks on the image.

<span style="color:#0000dd;">There is a closure.  Either keep the closure and put everything that relies on "clickableObjects" inside the closure (including the clickableObjects array), or forget the closure and just fudge the mesh's aspect ratio.</span>

```js
// Ales_Inferno/click_image.html
textureLoader.load('image1.jpg', function (texture) {  const clickableObjects = []; // Moved here.  const geometry = new THREE.PlaneGeometry(1, 1);  const material = new THREE.MeshBasicMaterial({ map: texture });  const mesh = new THREE.Mesh(geometry, material);  mesh.scale.set(1.0, texture.image.height / texture.image.width, 1.0);  mesh.userData.interactive = true;  scene.add(mesh);  // Add the mesh to the list of clickable objects  clickableObjects.push(mesh);
  
  // Added onMouseDown event listener
  function onMouseDown(event) { ... }
  renderer.domElement.addEventListener('mousedown', onMouseDown);});
```

<br>
userData needs to be set by you.  But we're also not checking it here. <span style="font-size:30px;">🛸</span>  

What you might do is this:

```js
// annotations-house.html
annotationSprite.userData.id = a; // set id

let intersected = intersects[0].object;

// Get id (check parent object first)
if (intersected.userData && intersected.userData.id) {
    gotoAnnotation(annotations[intersected.userData.id]);
```

## Conclusion

You can't add an event listener to a mesh.  But you can add it to (I think) a camera, or definitely an orbit control.

<br>

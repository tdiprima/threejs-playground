## Synchronized Image Viewers

<span style="color:#0000d8;">In three.js, how can I create 4 image viewers in a webpage, and add a control so that if the user hovers over 1 image and pans and zooms, the other 3 images pan and zoom the same way?</span>

### To create four image viewers in a webpage using Three.js:

1. Create four instances of THREE.WebGLRenderer.

2. Add them to four separate HTML elements using the renderer's DOM element.

3. Create four instances of THREE.Scene.

4. Add your images as textures to four instances of THREE.Mesh.

### To synchronize the panning and zooming of the images:

1. Create a camera and 

2. Attach it to a THREE.Group object. &lt;&mdash; Group didn't work out so good; it put all the images in 1 div.

3. Add each of the four image meshes to the group object.
    * This way, you can control the position and zoom of the group object and it will affect all the images inside it.

### To create the hover effect:

1. Use the Three.js Raycaster to detect when the mouse is hovering over one of the images.

2. When a hover event is detected, you can update the position and zoom of the group object.

3. This will in turn update the position and zoom of all four images.

```javascript
// sync.html
// create four instances of the WebGLRenderer
const renderer1 = new THREE.WebGLRenderer();
const renderer2 = new THREE.WebGLRenderer();
const renderer3 = new THREE.WebGLRenderer();
const renderer4 = new THREE.WebGLRenderer();

// add the renderer's DOM element to four HTML elements
document.getElementById('image1').appendChild(renderer1.domElement);
document.getElementById('image2').appendChild(renderer2.domElement);
document.getElementById('image3').appendChild(renderer3.domElement);
document.getElementById('image4').appendChild(renderer4.domElement);

// create four instances of the Scene
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
const scene4 = new THREE.Scene();

// load your images as textures
const texture1 = new THREE.TextureLoader().load('image1.jpg');
const texture2 = new THREE.TextureLoader().load('image2.jpg');
const texture3 = new THREE.TextureLoader().load('image3.jpg');
const texture4 = new THREE.TextureLoader().load('image4.jpg');

// create four instances of the Mesh, using your textures
const geometry = new THREE.PlaneGeometry(1, 1);
const material1 = new THREE.MeshBasicMaterial({ map: texture1 });
const material2 = new THREE.MeshBasicMaterial({ map: texture2 });
const material3 = new THREE.MeshBasicMaterial({ map: texture3 });
const material4 = new THREE.MeshBasicMaterial({ map: texture4 });

const mesh1 = new THREE.Mesh(geometry, material1);
const mesh2 = new THREE.Mesh(geometry, material2);
const mesh3 = new THREE.Mesh(geometry, material3);
const mesh4 = new THREE.Mesh(geometry, material4);

// create a group object and add all four image meshes to it
const group = new THREE.Group();
group.add(mesh1);
group.add(mesh2);
group.add(mesh3);
group.add(mesh4);

// create a camera and position it to view the group object
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(group.position);

// add the group object to all four scenes
scene1.add(group);
scene2.add(group);
scene3.add(group);
scene4.add(group);

// render the scenes
function render() {
  renderer1.render(scene1, camera);
  renderer2.render(scene2, camera);
  renderer3.render(scene3, camera);
  renderer4.render(scene4, camera);
}

// update the position and zoom of the group object on hover
function onHover(event) {
  // calculate the position of the mouse on the screen
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // use the Raycaster to detect which image the mouse is hovering over
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3, mesh4]);
  if (intersects.length > 0) {
    // update the position and zoom of the group object based on the mouse position
    const offset = intersects[0].point.clone().sub(group.position);
    group.position.add(offset.multiplyScalar(-0.1));
    group.scale.setScalar(1 + intersects[0].distance * 0.1);
  }
}

// add the onHover function as a listener for the mousemove event
document.addEventListener('mousemove', onHover);

// call the render function in a loop to update the scenes
function animate() {
  requestAnimationFrame(animate);
  render();
}

animate();
```

<br>

The `onHover` function is called whenever the mouse moves over any of the four images.

It calculates the position of the mouse on the screen and uses a `Raycaster` to detect which image the mouse is hovering over.

If an intersection is found, it updates the position and zoom of the `group` object based on the distance between the mouse and the image.

This will cause all four images to move and zoom in the same way.

Finally, the `animate` function is called in a loop using `requestAnimationFrame`.

This will continuously update the scenes and render them to the four canvases on the page.

## 3D Interaction

```js
let intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3, mesh4]);
if (intersects.length > 0) {
    let offset = intersects[0].point.clone().sub(group.position);
    group.position.add(offset.multiplyScalar(-0.1));
    group.scale.setScalar(1 + intersects[0].distance * 0.1);
}
```

<br>

1. The `raycaster.intersectObjects()` method is being used to check for intersections between a ray and a list of objects. The raycaster shoots a ray into the scene and checks if it intersects with any of the provided objects (`mesh1`, `mesh2`, `mesh3`, `mesh4`).

2. The `if (intersects.length > 0)` condition checks if any intersections were found. If there are intersections, it means that the ray has intersected with one or more of the objects in the list. <span style="color:red;">Except that I'm getting intersection results even outside the scenes.</span>

3. Inside the `if` block, the code performs actions based on the intersection. Let's go through them step by step:
   a. `intersects[0].point` represents the point where the ray intersects with the first object in the list (the one with the smallest distance from the ray origin).
   b. `clone()` creates a copy of the intersection point vector so that we can perform calculations on it without modifying the original vector.
   c. `sub(group.position)` subtracts the position of the group object from the intersection point. This calculates the offset between the current position of the group and the intersection point.
   d. `group.position.add(offset.multiplyScalar(-0.1))` updates the position of the group object by adding the offset vector multiplied by a scaling factor of -0.1. This causes the group to move towards the intersection point, creating a dragging effect.
   e. `group.scale.setScalar(1 + intersects[0].distance * 0.1)` adjusts the scale of the group object based on the distance between the ray origin and the intersection point. The farther the intersection point is from the origin, the larger the scale factor becomes.

In summary, this code allows the user to interact with the scene by dragging and scaling a group object based on the position of the mouse pointer in relation to the intersected objects. The `intersects[0].point.clone().sub` part calculates the offset between the current group position and the intersection point, enabling dragging functionality.


## Problemas

### What does it mean when you get intersection results, even when the mouse is outside of the scene?

When you get intersection results even when the mouse is outside of the scene, it usually means that the raycaster is capturing intersections with objects beyond the boundaries of the scene or canvas.

The raycaster in three.js shoots a ray into the scene based on the mouse position or other input coordinates. It then checks for intersections with objects in the scene along that ray. The raycaster doesn't know the boundaries of the scene or the canvas by default. It simply calculates intersections along the ray.

So, if you're getting intersection results even when the mouse is outside of the scene, it could be because the raycaster is shooting the ray beyond the scene boundaries, and it intersects with objects in that extended direction.

To handle this situation, you can set up additional checks to filter out unwanted intersections. For example, you can limit the raycaster to only shoot rays within the boundaries of the scene or within a specific region of interest. You can also check if the intersection point falls within the desired boundaries before applying any actions based on the intersection.

By implementing such checks, you can ensure that the intersection results are relevant and meaningful within the context of your specific scene or application.

### Only the last image (image4.jpg) is showing up on screen.  I have 4 WebGLRenderers, 4 divs (one for each image), 4 Scenes, 4 texture loaders, etc.

Set the **position** and scale of the mesh so that it fits within the canvas for that image.

### How to create and add a mesh to a scene:

```javascript
// create a texture loader and load the image file
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('image1.jpg');

// create a material using the loaded texture
const material = new THREE.MeshBasicMaterial({ map: texture });

// create a plane geometry and mesh using the material and geometry
const geometry = new THREE.PlaneGeometry(1, 1);
const mesh = new THREE.Mesh(geometry, material);

// set the position and scale of the mesh so that it fits within the canvas for this image
mesh.position.set(-0.5, 0.5, 0);
mesh.scale.set(0.5, 0.5, 1);

// add the mesh to the scene for this image
scene.add(mesh);
```

<br>
Make sure that you're creating a separate mesh and adding it to a separate scene for each image, and that the positions and scales of the meshes are adjusted appropriately so that they fit within their respective canvases.

## Is this my camera?

Since I have 4 scenes and 4 images, do I need 4 cameras?

Yes, you will need a separate camera for each scene. Each camera is responsible for rendering the view of the scene from a particular perspective, so if you have multiple scenes, you will need multiple cameras to render each scene correctly.

When you create each scene, you can also create a separate camera for that scene, like this:

```javascript
const camera1 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const camera3 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const camera4 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
```

<br>
You will need to update the aspect ratio of the cameras whenever the size of the canvas changes, to ensure that the rendering remains correct. You can do this by adding an event listener for the `resize` event on the window object, like this:

```javascript
window.addEventListener('resize', () => {
    let width = canvas1.clientWidth;
    let height = canvas1.clientHeight;
    camera1.aspect = width / height;
    camera1.updateProjectionMatrix();
    renderer1.setSize(width, height);

    // repeat for the other cameras and renderers
    width = canvas2.clientWidth;
    height = canvas2.clientHeight;
    camera2.aspect = width / height;
    camera2.updateProjectionMatrix();
    renderer2.setSize(width, height);

    width = canvas3.clientWidth;
    height = canvas3.clientHeight;
    camera3.aspect = width / height;
    camera3.updateProjectionMatrix();
    renderer3.setSize(width, height);

    width = canvas4.clientWidth;
    height = canvas4.clientHeight;
    camera4.aspect = width / height;
    camera4.updateProjectionMatrix();
    renderer4.setSize(width, height);
});
```

<br>

In this example, the `resize` event handler updates the aspect ratio of the camera, updates the projection matrix of the camera, and resizes the renderer to match the new size of the canvas. Repeat this code for each camera and renderer.

## Positioning Scenes and Objects

If you have 4 three.js scenes, should the scenes be positioned, or are they positioned via CSS?  Or is it OK to simply position the objects inside each scene?

In three.js, the positioning of scenes and objects can be achieved using different approaches depending on your specific requirements. Here are a few options:

1. **Positioning Scenes:** The positioning of scenes themselves is typically done by manipulating the camera within each scene. By adjusting the camera's position, rotation, and field of view, you can control the view and perspective of the scene. This approach allows you to have multiple scenes arranged in 3D space.

2. **Positioning via CSS:** If you want to position the entire canvas element containing the scenes on your webpage, you can use CSS to control its position, size, and other styling properties. This approach is useful when you want to position the scenes within the HTML layout and control their placement relative to other elements on the page.

3. **Positioning Objects within Scenes:** Inside each scene, you can position objects individually by manipulating their properties such as position, rotation, and scale. This approach is useful for arranging and animating objects within a scene, giving you precise control over their placement.

The choice between these approaches depends on your specific needs and the desired behavior of your application. You can use a combination of these methods to achieve the desired result.

<br>

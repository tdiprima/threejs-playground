## Get Clicked Image Coordinates

I'm rendering an image as a texture to a plane geometry in three.js.  And it's being rendered in the middle of the scene.  Now, if I click on the image, how do I get the coordinates of the image itself?  Like - not relative to the screen; relative to itself.  If I click in the upper left corner I should see 0,0.

To get the coordinates of the clicked point relative to the image itself, you can use the following approach:

1. Set up an event listener for the click event on the renderer's DOM element:

    ```javascript
    renderer.domElement.addEventListener("click", onClick, false);
    ```

2. In the `onClick` function, calculate the relative coordinates of the clicked point within the image:

```javascript
function onClick(event) {
  // Get the renderer's DOM element
  let domElement = renderer.domElement;

  // Get the bounding rectangle of the renderer's DOM element
  let rect = domElement.getBoundingClientRect();

  // Calculate the clicked point's coordinates relative to the renderer's DOM element
  let relativeX = event.clientX - rect.left;
  let relativeY = event.clientY - rect.top;

  // Calculate the clicked point's normalized coordinates within the range of [0, 1]
  let normalizedX = relativeX / rect.width;
  let normalizedY = relativeY / rect.height;

  // Check if the image object is available
  if (image) {
    // Get the dimensions of the image
    let imageWidth = image.width;
    let imageHeight = image.height;

    // Calculate the clicked point's coordinates relative to the image
    let imageX = normalizedX * imageWidth;
    let imageY = normalizedY * imageHeight;

    // Log the coordinates relative to the image
    console.log("Image coordinates:", imageX, imageY);
  } else {
    console.log("Image is not yet loaded.");
  }
}
```

In the above code, `renderer` refers to your Three.js renderer, and `image` refers to the image object that you rendered as a texture on the plane geometry.

This approach calculates the relative coordinates of the clicked point within the renderer's DOM element and then maps those coordinates to the image's dimensions, giving you the coordinates relative to the image itself.

## What image object. C'mon mane... 😒

I just ended up passing width and height, but it still didn't give me what I want.

```js
let image = { width: texture.image.width, height: texture.image.height }
```

I don't have an image object, per se.  I'm loading the image like 

```js
let image = new THREE.TextureLoader().load(resourceURL);
let material = new THREE.MeshBasicMaterial({ map: image });
let planeGeom = new THREE.PlaneGeometry(10, 5);
let mesh = new THREE.Mesh(planeGeom, material);
```
  
So of course when I do `image.width`, it's undefined.

In that case, you can access the image's width and height by using the `image` property of the `map` property of the material assigned to the mesh.

```javascript
let image;let material = new THREE.MeshBasicMaterial({  map: new THREE.TextureLoader().load(resourceURL),  onBeforeCompile: (shader) => {    // Store the image object    image = shader.uniforms.map.value.image;  }});let planeGeom = new THREE.PlaneGeometry(10, 5);let mesh = new THREE.Mesh(planeGeom, material);// Add the mesh to your scene// Set up the click event listenerrenderer.domElement.addEventListener("click", onClick, false);
```

In this updated version, we access the image object from the `uniforms.map.value.image` property inside the `onBeforeCompile` callback of the material. This ensures that the image object is available before trying to retrieve its width and height.

## Err0r 🖥️ 💃🏻

It's failing on

```js
image = shader.uniforms.map.value.image;
```

It says that `shader.uniforms.map.value` is **null.**

The previous approach assumes that the image has been fully loaded before accessing its dimensions, but that may not be the case when the click event occurs.

To handle this situation, we can modify the code to wait for the image to load completely before setting up the click event listener.

<span style="color:deeppink;">Mmm nooo... what happened to just putting it inside the callback?</span>

```javascript
let textureLoader = new THREE.TextureLoader();let material = new THREE.MeshBasicMaterial({  onBeforeCompile: (shader) => {    // Store the image object once it is loaded    textureLoader.load(resourceURL, (loadedImage) => {      image = loadedImage.image;    });  }});// Wait for the image to load completely before setting up the click event listenertextureLoader.load(resourceURL, () => {  renderer.domElement.addEventListener("click", onClick, false);});```

In this updated version, we wait for the image to be fully loaded using the `textureLoader.load` method. Once the image is loaded, we store the `image` object in the `onBeforeCompile` callback of the material. Then, we set up the click event listener after the image has finished loading. This ensures that the image object is available when the click event occurs.

<br>

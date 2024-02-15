## Convert Drawing to Image Coordinates

[image\_drawing\_coords.html](../Code/Ales_Inferno/image_drawing_coords.html)

To convert the `drawingCoordinates` into image coordinates based on the width and height of the image, you need to understand how the coordinates in your Three.js scene relate to the actual pixels of the image. In Three.js, the plane onto which the image is mapped may not directly correspond to the pixel dimensions of the image. Therefore, a conversion is necessary.

```js
let imageAspectRatio = texture.image.width / texture.image.height;
// constructor(width = 1, height = 1)
let planeGeometry = new THREE.PlaneGeometry(imageAspectRatio, 1);
```

Given that your plane geometry is created with the aspect ratio of the image (above), and assuming the image is fully covering the plane, you can map the coordinates from the Three.js world to the image's pixel space. Here is a general approach:

1. **Normalize the Coordinates**: The drawing coordinates are in the Three.js world space, so first, you need to normalize them to the plane's space. The plane has dimensions `imageAspectRatio` (width) and `1` (height). The coordinates should be transformed so that they range from `0` to `imageAspectRatio` in width and `0` to `1` in height.

2. **Scale to Image Pixels**: After normalizing, scale these coordinates to the actual pixel dimensions of the image. Multiply the normalized X coordinate by the image's width and the Y coordinate by the image's height.

Here is an example of how you might implement this:

```javascript
document.addEventListener('mouseup', function () {
  console.log("drawingCoordinates", drawingCoordinates);

  // Assuming you have access to the image's actual width and height
  let imageWidth = texture.image.width;
  let imageHeight = texture.image.height;

  let imageCoordinates = drawingCoordinates.map(coord => {
    // Normalize coordinates (assuming the plane is centered at the origin)
    let normalizedX = (coord.x + imageAspectRatio / 2) / imageAspectRatio;
    let normalizedY = (coord.y + 0.5) / 1;

    // Scale to image dimensions
    let pixelX = normalizedX * imageWidth;
    let pixelY = (1 - normalizedY) * imageHeight; // Y is inverted

    return { x: pixelX, y: pixelY };
  });

  console.log("Image Coordinates:", imageCoordinates);

  drawingCoordinates = [];
  mouseDown = false;
});

// ... rest of your code ...
```

In this code:

- We normalize the x-coordinate by adding half of the plane's width (`imageAspectRatio / 2`) and then divide by the plane's width (`imageAspectRatio`). This maps the x-coordinate to a range from 0 to 1.
- We do the same for the y-coordinate, but since the height of the plane is 1, we just add 0.5 and divide by 1.
- We then scale these normalized coordinates to the image dimensions.
- Note that for the y-coordinate, we invert it (`1 - normalizedY`) because the y-axis in Three.js is inverted relative to the usual image coordinate system (where the top-left corner is (0,0)).

This approach should give you the image pixel coordinates corresponding to the points where the user drew on the plane.

<span style="color:blue;font-size:larger;">If I did not know that the values I'm passing in to PlaneGeometry are imageAspectRatio and 1, how would I calculate it?</span>

To accurately convert the drawing coordinates to image coordinates, you need to know the dimensions of the plane in the Three.js world. In your original code, the plane is created with a width of `imageAspectRatio` and a height of `1`. If you don't have these values directly, you can get the dimensions of the plane from its geometry.

Three.js Mesh objects don't have `height` and `width` properties directly. Instead, you should use the plane's geometry to find the size.

Here's how you can calculate it:

1. **Get Plane Size**: Extract the size of the plane from its geometry. For a `PlaneGeometry`, this is the `width` and `height` of the geometry.

2. **Normalize Coordinates**: Use these dimensions to normalize the coordinates.

3. **Scale to Image Pixels**: Finally, scale these normalized coordinates to the image's pixel dimensions.

Here's an updated version of your code to calculate it:

```javascript
document.addEventListener('mouseup', function () {
  console.log("drawingCoordinates", drawingCoordinates);

  // Assuming you have access to the image's actual width and height
  let imageWidth = texture.image.width;
  let imageHeight = texture.image.height;

  // Get the dimensions of the plane from its geometry
  let planeWidth = plane.geometry.parameters.width;
  let planeHeight = plane.geometry.parameters.height;

  let imageCoordinates = drawingCoordinates.map(coord => {
    // Normalize coordinates (assuming the plane is centered at the origin)
    let normalizedX = (coord.x + planeWidth / 2) / planeWidth;
    let normalizedY = (coord.y + planeHeight / 2) / planeHeight;

    // Scale to image dimensions
    let pixelX = normalizedX * imageWidth;
    let pixelY = (1 - normalizedY) * imageHeight; // Y is inverted

    return { x: pixelX, y: pixelY };
  });

  console.log("Image Coordinates:", imageCoordinates);

  drawingCoordinates = [];
  mouseDown = false;
});

// ... rest of your code ...
```

In this code, `plane.geometry.parameters.width` and `plane.geometry.parameters.height` are used to get the dimensions of the plane. These dimensions are then used to normalize the coordinates. Note that the normalization step assumes the plane is centered at the origin. If your plane's position is different, you may need to adjust the normalization step accordingly.

<br>

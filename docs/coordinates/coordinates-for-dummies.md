## Line Depth and Image
<!-- 2d_image_display.html -->

<span style="color:blue;font-size:larger;">If I wanted to take `line.geometry.attributes.position.array` and convert them to image coordinates, based on the size of the image, how would I do that in such a way that I don't  have to know anything about how the plane was created?</span>

Absolutely, I'll explain it step by step. To convert the line's position from Three.js world coordinates to image coordinates, you need to understand a few concepts:

1. **World Coordinates:** These are the coordinates used in your Three.js scene. In your case, the line's points are defined in this space.

2. **Image Coordinates:** These refer to the coordinates as they would appear on the 2D image. The origin (0,0) is typically at the top-left corner of the image, and the maximum value would be at the bottom-right corner of the image.

3. **Plane Geometry and Aspect Ratio:** The plane displaying your image might not match the image's original aspect ratio, depending on how you've scaled it. The aspect ratio is the width divided by the height.

4. **Viewport Size:** This is the size of the area in the browser where your Three.js scene is rendered (typically the entire window).

Now, let's break down the conversion process:

### Step 1: Normalize World Coordinates to a [-1, 1] Range
Since Three.js uses a 3D space and the image is 2D, we first need to normalize the line's coordinates to a range of [-1, 1] in both x and y directions. In a Three.js scene, this normalized space is where -1 is the left or bottom edge and 1 is the right or top edge.

Assuming your scene's world coordinates go beyond this range, you'll need to know the maximum extents of your world coordinates. You mentioned not wanting to rely on how the plane was created, so you'll need to determine these extents some other way, possibly by keeping track of the objects you add to the scene.

### Step 2: Convert Normalized Coordinates to Image Coordinates
Once you have normalized coordinates, the next step is to map these to your image coordinates.

- **X Coordinate:** Multiply the normalized x-coordinate by half of the image's width. Then, add this value to half of the image's width to shift from the [-1, 1] range to [0, image width].

- **Y Coordinate:** Since the y-coordinate in image space starts at the top and increases downwards, you'll subtract instead of add. Multiply the normalized y-coordinate by half of the image's height and subtract this from half of the image's height.

### Example Calculation
Let's assume you have a normalized coordinate (nx, ny) and an image of width W and height H. The converted image coordinate (ix, iy) would be calculated as follows:

- `ix = (nx + 1) * (W / 2)`
- `iy = (1 - ny) * (H / 2)`

This formula assumes your normalized coordinates are already in the [-1, 1] range. If they're not, you'll need to normalize them first based on the known or calculated extents of your scene.

Remember, this approach works well if the aspect ratio of the plane matches the aspect ratio of the image. If not, you'll need additional adjustments to account for any stretching or squishing of the image.

## Code

Certainly! Based on your code, we can write a JavaScript function to convert the positions from your line geometry to image coordinates. The key steps involve normalizing the coordinates and then converting them to the image's coordinate system.

From your code, the plane is set to have an aspect ratio that matches the image. This means the image covers the entire plane without any stretching or distortion. The plane's size in your scene is 4 units wide and `4 * aspect` units tall, where `aspect` is the image's aspect ratio (height / width).

Let's break down the steps:

1. **Normalize Coordinates**: Convert the line's coordinates from the world space to a [-1, 1] range, based on the size of the plane.

2. **Convert to Image Coordinates**: Map the normalized coordinates to the actual image size.

Here is a JavaScript function that performs this conversion:

```javascript
function worldToImageCoordinates(worldPoints, imageWidth, imageHeight) {
    const aspect = imageHeight / imageWidth;
    const planeWidth = 4; // Width of the plane in your scene
    const planeHeight = planeWidth * aspect; // Height of the plane

    return worldPoints.map(point => {
        // Normalize coordinates to [-1, 1]
        const normalizedX = point.x / (planeWidth / 2);
        const normalizedY = point.y / (planeHeight / 2);

        // Convert normalized coordinates to image coordinates
        const imageX = (normalizedX + 1) * (imageWidth / 2);
        const imageY = (1 - normalizedY) * (imageHeight / 2);

        return { x: imageX, y: imageY };
    });
}

// Example usage:
const linePoints = [
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 0, 0)
];

// Assuming you have the image width and height
const imageWidth = 800; // Replace with actual image width
const imageHeight = 600; // Replace with actual image height

const imageCoordinates = worldToImageCoordinates(linePoints, imageWidth, imageHeight);
console.log(imageCoordinates);
```

This function takes the points from your line, normalizes them based on the plane's size, and then converts those normalized coordinates to image coordinates. Make sure to replace `imageWidth` and `imageHeight` with the actual dimensions of your image.

## Normalized

<span style="color:blue;font-size:larger;">Aren't the line's coordinates in the world space already in a [-1, 1] range?  If so, then the calculation to normalize them again shouldn't change anything, right?</span>

Yes, but he's not calculating using the line.  You have to do the normalization step; otherwise, you'll get zeros.

## Use line.geometry.attributes.position.array

Thank you for the clarification. To use `line.geometry.attributes.position.array`, which is a flat array of numbers representing the positions of the vertices in the format `[x1, y1, z1, x2, y2, z2, ...]`, we need to adjust the function to handle this format. Since the array is flat, we'll process it in steps of three (for x, y, and z coordinates) and ignore the z-coordinate as it's not relevant for the 2D image mapping.

Here's how you can modify the function:

```javascript
function worldToImageCoordinates(positionArray, imageWidth, imageHeight) {
    const imageCoordinates = [];

    for (let i = 0; i < positionArray.length; i += 3) {
        // Extract x and y from the position array (ignoring z)
        const x = positionArray[i];
        const y = positionArray[i + 1];

        // Convert world coordinates directly to image coordinates <-- WRONG!
        const imageX = (x + 1) * (imageWidth / 2);
        const imageY = (1 - y) * (imageHeight / 2);

        imageCoordinates.push({ x: imageX, y: imageY });
    }

    return imageCoordinates;
}

// Example usage:
const positionArray = line.geometry.attributes.position.array;

// Assuming you have the image width and height
const imageWidth = 800; // Replace with actual image width
const imageHeight = 600; // Replace with actual image height

const imageCoordinates = worldToImageCoordinates(positionArray, imageWidth, imageHeight);
console.log(imageCoordinates);
```

This function iterates through the `positionArray`, taking each set of x and y coordinates (while ignoring the z-coordinate), and maps them to the image coordinates. It returns an array of objects, each containing the `x` and `y` image coordinates corresponding to each vertex in your line geometry. Remember to replace `imageWidth` and `imageHeight` with the actual dimensions of your image.

## This is it:

```js
function convertToImageCoordinates(positionArray, imageWidth, imageHeight, planeWidth, planeHeight) {
  const imageCoordinates = [];

  for (let i = 0; i < positionArray.length; i += 3) {
    // Extract the x and y coordinates
    let point = {};
    point.x = positionArray[i];
    point.y = positionArray[i + 1];

    // Normalize coordinates to [-1, 1]
    const normalizedX = point.x / (planeWidth / 2);
    const normalizedY = point.y / (planeHeight / 2);

    // Convert normalized coordinates to image coordinates
    const imageX = (normalizedX + 1) * (imageWidth / 2);
    const imageY = (1 - normalizedY) * (imageHeight / 2);

    imageCoordinates.push({
      x: imageX,
      y: imageY
    });
  }

  return imageCoordinates;
}

// Usage
const imageWidth = tex.image.width;
const imageHeight = tex.image.height;
const aspectRatio = imageHeight / imageWidth;
let planeWidth = plane.geometry.parameters.width;
let planeHeight = plane.geometry.parameters.height;
const positionArray = line.geometry.attributes.position.array;
const imgCoords = convertToImageCoordinates(positionArray, imageWidth, imageHeight, planeWidth, planeHeight);
console.log("Image coordinates:", imgCoords);
```

<span style="color:blue;font-size:larger;">In order for the calculation to come out right, use image width and height instead of plane width and height in production.</span>

## Nope.

See: [image-to-three.md](image-to-three.md)

Scroll down.

<br>

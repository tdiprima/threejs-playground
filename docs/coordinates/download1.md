# Download 1

This code is a bit like a digital artist's tool that lets you zoom in on a specific part of a big picture and save just that piece. It's built for use in a 3D web environment with three.js. Here's how it works, step by step:

1. **Start with a Shape:** It begins with `verticesA`, the corners of a rectangle in your 3D world. Think of this as the outline of the part of the image you're interested in.

2. **Adjust and Save:** The `adjustRectangleAndDownload` function is where the magic happens. You give it an image and a 3D plane (like a flat surface in your 3D world), and it figures out how to match the corner points of your 3D rectangle to the correct spots on the image.

3. **Image Mapping:** It uses a special function, `convertSceneCoordsToImageCoords`, to translate the 3D points of the rectangle into 2D points on the image, taking into account the size of the image and the scale of the 3D plane. This is like converting GPS coordinates into spots on a treasure map.

4. **Find the Edges:** It calculates the smallest and largest x (left and right sides) and y (top and bottom) values among these points. This gives the boundaries of the part of the image you're focusing on.

5. **Create a Canvas:** Next, it creates an invisible drawing board (a canvas) in the browser, sized just right to fit the piece of the image you're interested in.

6. **Draw the Image Piece:** Using some clever drawing commands, it copies just that part of the image onto the canvas, adjusting as needed to make sure it fits perfectly.

7. **Save the Piece:** Finally, it converts the canvas into an image file and automatically downloads it to your computer, like cutting out a piece of a photo and saving it.

8. **Conversion Magic:** The `convertSceneCoordsToImageCoords` function does the heavy lifting of figuring out where each corner of your 3D rectangle lands on the 2D image, considering how the plane is scaled and positioned. This ensures the piece you save matches exactly what you're seeing in the 3D world, scaled down to image size.

So, in short, this code lets you pick a part of a 3D scene, figure out how it matches up with an image, and then saves just that part of the image, like using a virtual camera to take a snapshot of a smaller scene within a larger one.

## Convert 3D to 2D
### Convert Scene Coords To Image Coords

```js
// Convert Three.js coordinates to image pixel coordinates, taking plane scaling into account
function convertSceneCoordsToImageCoords(vertices, imageWidth, imageHeight, planeGeometry, planeScale) {
  // This assumes the plane is centered and covers the entire viewport
  const scaleX = imageWidth / (planeGeometry.parameters.width * planeScale.x);
  const scaleY = imageHeight / (planeGeometry.parameters.height * planeScale.y);

  let pixelVertices = [];
  for (let i = 0; i < vertices.length; i += 3) {
    const x = (vertices[i] + planeGeometry.parameters.width / 2) * scaleX;
    const y = (1 - (vertices[i + 1] + planeGeometry.parameters.height / 2) / planeGeometry.parameters.height) * scaleY;
    pixelVertices.push(x, y);
  }
  return pixelVertices;
}
```

This code snippet is designed to convert 3D coordinates from a Three.js scene to 2D pixel coordinates on an image. It is particularly useful when you have a 3D scene rendered onto a 2D plane (like a computer screen or an image) and you need to map the positions of vertices (points in 3D space) to their corresponding positions on a 2D image. This is how it works:

1. **Input Parameters**:
   - `vertices`: An array of vertex coordinates in Three.js scene space, typically in the format `[x1, y1, z1, x2, y2, z2, ...]`.
   - `imageWidth`, `imageHeight`: Dimensions of the target image where the 3D coordinates will be projected.
   - `planeGeometry`: The geometry of the plane in Three.js that represents the 2D surface on which the 3D scene is rendered.
   - `planeScale`: An object representing the scale applied to the plane geometry, with `x` and `y` properties.

2. **Scaling Factors (`scaleX`, `scaleY`)**:
   - The code calculates scaling factors to convert scene coordinates to image coordinates. It divides the target image's dimensions by the scaled dimensions of the plane (`planeGeometry.parameters.width * planeScale.x` for `scaleX` and similarly for `scaleY`). This step adjusts for any scaling applied to the plane in the 3D scene.

3. **Conversion Loop**:
   - The code iterates over the input vertices array in steps of 3 (since vertices are represented by three values: `x`, `y`, `z`) but only uses `x` and `y` for 2D mapping.
   - For each vertex, it calculates its `x` and `y` pixel positions on the image:
     - The `x` position is found by adjusting the vertex's `x` coordinate to the plane's center and scaling it using `scaleX`.
     - The `y` position requires inverting the `y` coordinate (since screen coordinates usually have the origin at the top left, but 3D coordinates have the origin at the bottom left or center). It's adjusted to the plane's center, scaled, and then inverted in relation to the image height using `scaleY`.

4. **Result**:
   - The converted coordinates are stored in `pixelVertices` as pairs of `[x, y]` values for each vertex, which are then returned by the function.

This process effectively maps the spatial layout of vertices from a 3D space onto a 2D plane, taking into account the dimensions and scaling of the plane in the 3D environment and the target 2D image.

## Why are scaleX and scaleY and x and y calculated that way?

Alright, let's break it down simply!

Imagine you have a drawing on a rubber sheet (that's your 3D scene in Three.js), and you want to transfer that drawing onto a piece of paper (your 2D image). The rubber sheet can be stretched or squished (scaled), and your drawing's size changes accordingly. To accurately transfer your drawing, you need to figure out how much you've stretched or squished your rubber sheet compared to the size of your paper.

**ScaleX and ScaleY:**

- `scaleX` and `scaleY` are like the recipe to adjust the stretchiness of your rubber sheet so the drawing fits perfectly on your piece of paper. 
- If you stretched your sheet more horizontally, `scaleX` tells you how much to squish it back so it matches the paper's width.
- Similarly, if you stretched it a lot vertically, `scaleY` tells you how much to compress it to match the paper's height.

**Calculating x and y:**

- Now, for each point (vertex) in your drawing, you need to find where it goes on the paper.
- The `x` calculation adjusts each point's horizontal position. Since we might have stretched our rubber sheet, we need to "undo" that stretch to get the point back to where it would be on the paper.
- The `y`...

## Calculations

Got it, let's dive into the specifics of the calculations and why they work, focusing on the concepts of scaling and coordinate transformation:

### Scaling Factors (`scaleX` and `scaleY`)

- **Why:** The scene in Three.js and the image on your screen or paper don't naturally match in size. If you have a plane in Three.js that's 2 units wide but your image is 400 pixels wide, simply using the same numbers won't place your points correctly on the image. You need a way to translate or convert the dimensions from the Three.js world to the pixel dimensions of your image.
  
- **How:** 
  - `scaleX = imageWidth / (planeGeometry.parameters.width * planeScale.x)` calculates how many pixels in the image correspond to a single unit of width in the Three.js scene, after accounting for any scaling (`planeScale.x`) you applied to your plane. If your plane was scaled up or down, this affects how wide it appears in the Three.js world, so you adjust the scaling factor accordingly.
  - `scaleY` does the same for the height.

### Coordinate Transformation for `x` and `y`

- **Centering and Adjusting `x` Coordinate:**
  - **Why:** Three.js coordinates and image pixel coordinates start from different places. In Three.js, `(0,0)` might be at the center of your plane, but in an image, `(0,0)` is usually at the top-left corner.
  - **How:** `(vertices[i] + planeGeometry.parameters.width / 2) * scaleX` shifts the `x` coordinate from Three.js space (which could be centered around 0) to image space, where 0 is at the edge. It adds half the plane's width to move everything to the right, ensuring that what was at the center (0 in Three.js) is now at the right edge of the left half of the image. Then, it scales this value to convert it to pixel space.

- **Inverting and Adjusting `y` Coordinate:**
  - **Why:** The `y` axis is inverted between the two coordinate systems. In Three.js, `y` values might increase upwards, but in image coordinates, `y` increases downwards.
  - **How:** The formula for `y` does three things: it shifts the `y` coordinate (like it did for `x`), scales it (also like `x`), and then inverts it. `1 - (vertices[i + 1] + planeGeometry.parameters.height / 2) / planeGeometry.parameters.height` moves the origin to the top-left and inverts the `y` axis so higher values move down the image. Then, `* scaleY` adjusts this to the scale of the image.

### Summary

- **Scale factors (`scaleX` and `scaleY`)** convert Three.js measurements to pixel measurements, taking into account how much you've zoomed in or out (scaled your plane).
- **Adjusting `x` and `y` coordinates** moves your points from the Three.js coordinate system, where the center of the plane might be `(0,0)`, to the image coordinate system, where `(0,0)` is the top-left corner. It also flips the `y` axis to match how images are usually handled (with `y` increasing as you go down), ensuring points appear in the correct location on your 2D image.

## Adjust and Download Image

### Adjust Rectangle And Download

```js
function adjustRectangleAndDownload(image, plane) {
  const imageWidth = image.width;
  const imageHeight = image.height;
  const planeScale = {
    x: plane.scale.x,
    y: plane.scale.y
  };

  // Convert scene coordinates to image pixel coordinates

  // Convert vertices coordinates
  const pixelVertices = convertSceneCoordsToImageCoords(verticesA, imageWidth, imageHeight, planeGeom, planeScale);

  // Extracting the bounding box of the rectangle in image coordinates
  let minX = Math.min(...pixelVertices.filter((v, i) => i % 2 === 0));
  let minY = Math.min(...pixelVertices.filter((v, i) => i % 2 !== 0));
  let maxX = Math.max(...pixelVertices.filter((v, i) => i % 2 === 0));
  let maxY = Math.max(...pixelVertices.filter((v, i) => i % 2 !== 0));

  // Now use these points to crop the image and download it
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  // Set canvas size to the size of the rectangle
  canvas.width = maxX - minX;
  canvas.height = maxY - minY;

  // Crop and draw the image portion on the canvas
  ctx.drawImage(image, -minX, -minY, imageWidth, imageHeight);
  canvas.toBlob(function(blob) {
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cropped_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, 'image/png');
}
```

This code performs the following steps to adjust a portion of an image based on a given plane's position and scale, and then downloads that portion:

1. **Initialize Image and Plane Properties**: It starts by extracting the width and height of the image and the scale of the plane.

2. **Convert Scene Coordinates to Image Pixel Coordinates**:
   - It assumes the existence of a function `convertSceneCoordsToImageCoords` (which is not provided in the snippet) that converts the scene (3D) coordinates of vertices to the image's pixel coordinates. The conversion likely depends on the plane's position, orientation, and scale in the 3D scene, as well as the camera perspective.
   - `verticesA` and `planeGeom` are used in this conversion but are not defined in the provided code. They presumably represent the vertices of the rectangle on the plane and the geometry of the plane, respectively.

3. **Calculate Bounding Box in Image Coordinates**: 
   - It calculates the minimum and maximum x (minX, maxX) and y (minY, maxY) coordinates of the rectangle in pixel space. This is effectively finding the bounding box of the rectangle in the image.
   - The filtering by `i % 2 === 0` or `i % 2 !== 0` suggests that `pixelVertices` is a flat array where even indices represent x coordinates and odd indices represent y coordinates.

4. **Crop and Prepare for Download**:
   - A canvas element is created programmatically, and its context is obtained.
   - The canvas size is set to match the dimensions of the bounding box (rectangle) calculated earlier.
   - The image is drawn onto the canvas using `drawImage`, with adjustments to ensure only the selected portion (defined by the bounding box) is drawn. This involves setting the source (image) drawing coordinates to `(-minX, -minY)` and scaling to the original `imageWidth` and `imageHeight` to ensure the portion aligns correctly on the canvas.
   - The `drawImage` parameters effectively shift the canvas drawing origin to the top-left corner of the desired crop area before drawing the entire image. This results in only the specified portion being visible on the canvas.

5. **Trigger Download**: 
   - The canvas's content is converted to a Blob object representing the image data.
   - A temporary anchor (`<a>`) element is created and used to initiate the download. The `href` of the anchor is set to a URL created from the Blob, and the `download` attribute is set to specify the filename.
   - This triggers a click event on the anchor, starting the download, after which the anchor is removed from the document.

The logic behind the code efficiently maps a 3D plane's coordinates to a 2D image space, extracts the relevant portion of the image based on this mapping, and allows the user to download this image portion.

## Bounding box in image coords

```js
let minX = Math.min(...pixelVertices.filter((v, i) => i % 2 === 0));
let minY = Math.min(...pixelVertices.filter((v, i) => i % 2 !== 0));
let maxX = Math.max(...pixelVertices.filter((v, i) => i % 2 === 0));
let maxY = Math.max(...pixelVertices.filter((v, i) => i % 2 !== 0));
```

Sure! Let's break it down:

Imagine you have a bunch of points (vertices) that outline a shape on an image, and each point has an x (horizontal) and a y (vertical) position. These points are stored in a list called `pixelVertices`, where every even position (like 0, 2, 4, etc.) is an x coordinate, and every odd position (like 1, 3, 5, etc.) is a y coordinate.

Here's what each line of code does:

1. **Find the smallest x value (minX)**: This line goes through all the x coordinates (which are at the even positions in the list) and picks the smallest one. This is like finding the leftmost point of the shape.

   ```js
   let minX = Math.min(...pixelVertices.filter((v, i) => i % 2 === 0));
   ```

   - `filter((v, i) => i % 2 === 0)` picks out every element `v` whose index `i` is even (the x coordinates).
   - `Math.min(...)` finds the smallest of these x coordinates.

2. **Find the smallest y value (minY)**: Similar to the first, but this time it finds the lowest point of the shape by picking the smallest y coordinate (which are at the odd positions).

   ```js
   let minY = Math.min(...pixelVertices.filter((v, i) => i % 2 !== 0));
   ```

3. **Find the largest x value (maxX)**: This line finds the rightmost point of the shape by picking the largest x coordinate.

   ```js
   let maxX = Math.max(...pixelVertices.filter((v, i) => i % 2 === 0));
   ```

4. **Find the largest y value (maxY)**: Lastly, this finds the topmost point by picking the largest y coordinate.

   ```js
   let maxY = Math.max(...pixelVertices.filter((v, i) => i % 2 !== 0));
   ```

So, essentially, these lines of code are sorting through all the points to find the outer edges of the shape: the leftmost, rightmost, lowest, and highest points. This helps in understanding how big the shape is and where it's located on the image.

<br>

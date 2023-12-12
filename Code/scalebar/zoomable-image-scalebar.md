## Create Zoomable Image Scalebar

<span style="color:blue;font-weight:bold;font-size:larger;">Create a scale bar for an image in an app where you can zoom in and out.</span>

[ready-dynamite.html](ready-dynamite.html)

A scale bar is a line or bar that helps show the size of an object or distance between objects in an image. As you zoom in and out, the scale bar should adjust to represent the accurate size or distance based on the level of zoom.

### 1. Cheat:
Let's assume you are using JavaScript and a library like p5.js for simplicity.

### 2. Set up Your Project:
- **HTML**: Create a basic HTML file with a canvas element.
- **JavaScript**: Link p5.js to your project.

### 3. Load the Image:
In your JavaScript file, preload the image you want to zoom into, and display it on the canvas.

```javascript
let img;
function preload() {
  img = loadImage('path_to_your_image.jpg');
}

function setup() {
  createCanvas(800, 600);
  image(img, 0, 0, width, height);
}
```

### 4. Implement Zoom Functionality:
You need a way to zoom in and out of the image. You can do this by changing the size of the image based on user input, like scrolling the mouse wheel.

```javascript
let zoom = 1;

function draw() {
  clear();
  image(img, 0, 0, width * zoom, height * zoom);
}

function mouseWheel(event) {
  zoom += event.delta * -0.001; // Adjust the 0.001 to control the zoom speed
  zoom = constrain(zoom, 0.1, 10); // Adjust min and max zoom levels
  return false; // Prevent default scrolling behavior
}
```

### 5. Add the Scale Bar:
Now, you need to add the scale bar on top of your image.

```javascript
function drawScaleBar() {
  let scaleBarLength = 100 * (1 / zoom); // 100 pixels at zoom level 1
  let scaleBarHeight = 10;

  fill(255);
  rect(50, height - 50, scaleBarLength, scaleBarHeight);
  fill(0);
  textSize(16);
  text('100 units', 50 + scaleBarLength + 5, height - 50 + scaleBarHeight);
}

function draw() {
  clear();
  image(img, 0, 0, width * zoom, height * zoom);
  drawScaleBar();
}
```

This code will add a scale bar that adjusts its size based on the zoom level. You'll need to replace `'100 units'` with the actual unit and size that make sense for your image.

### 6. Test Your App:
Now, run your app in a web browser, and you should be able to zoom in and out using the mouse wheel, and see the scale bar adjusting its size accordingly.

### 7. Polish and Debug:
Finally, make sure to test different parts of your app, handle any errors that might occur, and polish the user interface to make it as user-friendly as possible.

## Reverse 🔄

<span style="color:#0000dd;font-weight:bold;">In this code, the bar shrinks as we zoom in, to reflect the scale of 100 units.  Now, what if I wanted the bar to stay the same size, but the number of units to change?</span>

[witty-scorpion.html](witty-scorpion.html)

If you want the scale bar to stay the same size on the screen while the number of units it represents changes as you zoom in and out, you can do that with a bit of modification to the code.

### Update the Scale Bar Function:

You need to change the `drawScaleBar` function so that the length of the scale bar stays constant, but the number of units it represents changes based on the zoom level.

```javascript
function drawScaleBar() {
  let fixedScaleBarLength = 100; // The scale bar will always be 100 pixels wide on the screen
  let scaleBarHeight = 10;
  let unitsRepresented = 100 * zoom; // The number of units represented by the scale bar changes with zoom

  fill(255);
  rect(50, height - 50, fixedScaleBarLength, scaleBarHeight);
  fill(0);
  textSize(16);
  text(unitsRepresented.toFixed(0) + ' units', 50 + fixedScaleBarLength + 5, height - 50 + scaleBarHeight);
}
```

In this code:

- The `fixedScaleBarLength` variable determines the on-screen size of the scale bar, which stays constant regardless of zoom level.

- The `unitsRepresented` variable calculates how many units the scale bar represents, changing based on the current zoom level. The `.toFixed(0)` function is used to round the number to the nearest whole number, making it easier to read.

### Update the Draw Function:

Make sure your `draw` function calls `drawScaleBar` so that the scale bar is actually drawn on the screen.

<span style="color:yellow;">It does.</span>

### Test Your App:

Run your app in a web browser again, and now you should see that the scale bar stays the same size on the screen, but the number of units it represents changes as you zoom in and out.

This approach gives the user a consistent visual reference for scale, while still providing accurate information about the size of objects in the image at different zoom levels.

## How do I make the text white?

Making the text white in p5.js is really simple. The `fill()` function in p5.js sets the color for the text and shapes, and you can use it to set the text color to white.

You can set the color to white by passing `255` to the `fill()` function before you draw the text. In p5.js, colors are specified by values between 0 and 255 for each color component. A value of `255` represents the maximum brightness of white.

```javascript
function drawScaleBar() {
  // Draw the scale bar rectangle
  fill(255); // White color for the scale bar rectangle

  // Draw the text
  fill(255); // Set text color to white
}
```

In this updated function, the `fill(255)` line before `text()` ensures that the text will be drawn in white. The scale bar rectangle will also be white in this case, because it is drawn right before the text and the fill color is set to white for both. If you want the scale bar rectangle to be a different color, you can add another `fill()` function before the `rect()` function to set a different fill color for the rectangle.

<br>

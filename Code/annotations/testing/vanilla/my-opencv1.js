let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
let offscreenCtx = offscreenCanvas.getContext('2d');

// Set up brush properties
let brushSize = 10;
let isDrawing = false;

ctx.lineWidth = brushSize;
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  drawOutline(e);
}

// Function to draw the outline
function drawOutline(e) {
  if (!isDrawing) return;

  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;

  // Draw on the off-screen canvas
  offscreenCtx.lineWidth = ctx.lineWidth;
  offscreenCtx.lineCap = ctx.lineCap;
  offscreenCtx.strokeStyle = ctx.strokeStyle;

  offscreenCtx.beginPath();
  offscreenCtx.arc(x, y, brushSize, 0, Math.PI * 2);
  offscreenCtx.stroke();
}

function stopDrawing() {
  isDrawing = false;
  processOffscreenCanvas(); // Function to process the drawing
}

function processOffscreenCanvas() {
  console.log("processOffscreenCanvas");

  // cv['onRuntimeInitialized'] = () => {
  //   console.log("here"); // never got here

  if (!cv || !cv.imread) {
    console.log('%cOpenCV.js is not initialized.', "color: #ff6a5a; font-size: larger;");
    return;
  }

  let src, dst, contours, hierarchy;

  try {
    // Convert Canvas to Mat
    src = cv.imread(offscreenCanvas);
    if (!src) {
      console.error("Failed to read image from canvas");
      return;
    }

    dst = new cv.Mat();
    contours = new cv.MatVector();
    hierarchy = new cv.Mat();

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(src, src, 120, 255, cv.THRESH_BINARY);

    // Find Contours
    cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // Draw Contours (Fill the largest contour)
    dst.setTo(new cv.Scalar(255, 255, 255, 255));
    let color = new cv.Scalar(0, 0, 255, 128); // Blue transparent color to fill
    cv.drawContours(dst, contours, 0, color, -1, cv.LINE_8, hierarchy, 100);

    // Convert Mat back to Canvas
    cv.imshow(canvas, dst);
  } catch (e) {
    console.error(`Error in processOffscreenCanvas: ${e.message || e}`);
  } finally {
    // Clean up
    if (src) src.delete();
    if (dst) dst.delete();
    if (contours) contours.delete();
    if (hierarchy) hierarchy.delete();
  }

  // };
}

// Add event listeners to the canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawOutline);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

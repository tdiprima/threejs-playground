let offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;
let offscreenCtx = offscreenCanvas.getContext('2d');

// Set up brush properties
let brushSize = 10;
let isDrawing = false;

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
  // Check if OpenCV is already initialized
  if (cv && cv instanceof Object && cv.Mat) {
    console.log("here");
    processCanvasWithOpenCV();
  } else {
    console.log("there");
    cv['onRuntimeInitialized'] = processCanvasWithOpenCV;
  }
}

function processCanvasWithOpenCV() {
  // Convert Canvas to Mat
  let src = cv.imread(offscreenCanvas);
  let dst = new cv.Mat();
  cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
  cv.threshold(src, src, 120, 255, cv.THRESH_BINARY);

  // Find Contours
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(src, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Draw Contours (Fill the largest contour)
  dst.setTo(new cv.Scalar(255, 255, 255, 255));
  let color = new cv.Scalar(0, 0, 0, 255); // Black color to fill
  cv.drawContours(dst, contours, 0, color, -1, cv.LINE_8, hierarchy, 100);

  // Convert Mat back to Canvas
  cv.imshow(canvas, dst);

  // Clean up
  src.delete(); dst.delete(); contours.delete(); hierarchy.delete();
}

// Add event listeners to the canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawOutline);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Set up brush properties
let brushSize = 10;
let isDrawing = false;

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  drawOutline(e);
}

// Function to stop drawing
function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

// Function to draw the outline
function drawOutline(e) {
  if (!isDrawing) return;

  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;

  // Draw the outline of the circle
  ctx.beginPath();
  ctx.arc(x, y, brushSize, 0, Math.PI * 2);
  ctx.stroke();

  // Set the composite operation to cut out the interior of the circle
  ctx.globalCompositeOperation = 'destination-out';

  // Draw the filled circle to cut out the interior
  ctx.beginPath();
  ctx.arc(x, y, brushSize, 0, Math.PI * 2);
  ctx.fill();

  // Reset the composite operation to default
  ctx.globalCompositeOperation = 'source-over';
  ctx.closePath();
}

// Add event listeners to the canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawOutline);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

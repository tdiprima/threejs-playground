// Set up brush properties
let brushSize = 10;
let brushColor = "black";

let isDrawing = false;

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  drawOutline(e);
}

// Function to stop drawing
function stopDrawing() {
  isDrawing = false;
  // ctx.beginPath(); // dafuq?
  ctx.closePath();
}

// Function to draw the outline
function drawOutline(e) {
  if (!isDrawing) return;

  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;

  ctx.beginPath();
  ctx.arc(x, y, brushSize, 0, Math.PI * 2);
  ctx.strokeStyle = brushColor;
  // ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // not what I expected
  // ctx.fill();
  ctx.stroke();
  // ctx.closePath();
}

// Add event listeners to the canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawOutline);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Set up brush properties
let brushSize = 10;
ctx.lineWidth = 2 * brushSize;
ctx.lineCap = "round";
ctx.strokeStyle = "black";

let isDrawing = false;

// Function to start drawing
function startDrawing(e) {
  isDrawing = true;
  drawOutline(e);
}

// Function to stop drawing
function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

// Function to draw the outline
function drawOutline(e) {
  if (!isDrawing) return;

  let x = e.clientX - canvas.offsetLeft;
  let y = e.clientY - canvas.offsetTop;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(x, y, brushSize, 0, Math.PI * 2);
  ctx.stroke();
  ctx.closePath();
}

// Add event listeners to the canvas
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawOutline);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Better.
const canvas = document.getElementById('canvas');

// Get the canvas context
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create an array to store the points of the polygon
const points = [];

// Create a variable to store the current brush size
let brushSize = 10;

// Create a variable to store the current color
let color = 'black';

// Add an event listener for mouse down events
canvas.addEventListener('mousedown', (e) => {
  // Add the current mouse position to the points array
  points.push({ x: e.clientX, y: e.clientY });

  // Start drawing the polygon
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
});

// Add an event listener for mouse move events
canvas.addEventListener('mousemove', (e) => {
  // If the mouse button is down, draw a line from the previous mouse position to the current mouse position
  if (e.buttons === 1) {
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();

    // Add the current mouse position to the points array
    points.push({ x: e.clientX, y: e.clientY });
  }
});

// Add an event listener for mouse up events
canvas.addEventListener('mouseup', (e) => {
  // Close the polygon
  ctx.closePath();

  // Fill the polygon with the current color
  ctx.fillStyle = color;
  ctx.fill();

  // Clear the interior of the polygon
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.clip();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Reset the points array
  points.length = 0;
});

// Add an event listener for keydown events
document.addEventListener('keydown', (e) => {
  // If the user presses the spacebar, clear the canvas
  if (e.code === 'Space') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // If the user presses the up arrow key, increase the brush size
  if (e.code === 'ArrowUp') {
    brushSize += 5;
  }

  // If the user presses the down arrow key, decrease the brush size
  if (e.code === 'ArrowDown') {
    brushSize -= 5;
  }
});

// Set the initial brush size
ctx.lineWidth = brushSize;

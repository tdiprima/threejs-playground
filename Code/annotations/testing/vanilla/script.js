const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;
let points = [];

function startDrawing(event) {
  isDrawing = true;
  [points, isDrawing] = [{ x: event.clientX, y: event.clientY }, true];
}

function draw(event) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(points.x, points.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  points = { x: event.clientX, y: event.clientY };

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.stroke();
  ctx.closePath();
}

function stopDrawing() {
  isDrawing = false;

  // Fill the polygon
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points) {
    ctx.lineTo(point.x, point.y);
  }
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

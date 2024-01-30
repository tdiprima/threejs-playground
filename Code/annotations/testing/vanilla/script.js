const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let isDrawing = false;
let points = [];

function startDrawing(event) {
  isDrawing = true;
  points.push({ x: event.clientX, y: event.clientY });
}

function draw(event) {
  if (!isDrawing) return;

  const newPoint = { x: event.clientX, y: event.clientY };
  const lastPoint = points[points.length - 1];

  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(lastPoint.x, lastPoint.y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(newPoint.x, newPoint.y);
  ctx.stroke();
  ctx.closePath();

  points.push(newPoint);
}

function stopDrawing() {
  isDrawing = false;

  if (points.length < 3) return;

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

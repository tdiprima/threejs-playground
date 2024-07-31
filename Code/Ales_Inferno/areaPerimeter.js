// Array of points defining the polygon
const points = [
  { x: 30, y: 10 },
  { x: 40, y: 40 },
  { x: 60, y: 40 },
  { x: 70, y: 10 }
];

// Perimeter: Sum of the distances between consecutive vertices
function calculatePerimeter(points) {
  let perimeter = 0;
  for (let i = 0; i < points.length; i++) {
    const nextIndex = (i + 1) % points.length;
    const dx = points[nextIndex].x - points[i].x;
    const dy = points[nextIndex].y - points[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  return perimeter;
}

// Area: Shoelace formula (also known as Gauss's area formula)
function calculateArea(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const nextIndex = (i + 1) % points.length;
    area += points[i].x * points[nextIndex].y - points[i].y * points[nextIndex].x;
  }
  return Math.abs(area) / 2;
}

const perimeter = calculatePerimeter(points);
const area = calculateArea(points);

console.log(`Perimeter: ${perimeter}`);
console.log(`Area: ${area}`);

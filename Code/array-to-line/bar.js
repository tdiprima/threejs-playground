// The points array is a flat array containing the coordinates in the order [x1, y1, z1, x2, y2, z2, ...].
// Each consecutive triplet represents a point in 3D space.
let createLine = function (points) {
  // Step 1: Ensure the array of points does not contain NaN values
  // points = filterNan(points);

  // Step 2: Create a BufferGeometry object
  let geometry = new THREE.BufferGeometry();

  // Step 3: Convert the points array into a Float32Array
  let positions = convertToFloat32(points);

  // Step 4: Create a BufferAttribute with the positions
  let positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  // Step 5: Create a Line* object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  // return new THREE.LineSegments(geometry, material);
  return new THREE.Line(geometry, material);
}

// -------- ----------
// HELPERS
// -------- ----------
function convertToFloat32(points) {
  // Use this if you wanna keep the original array
  let a = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    a[i] = points[i];
  }

  // But we can just do this:
  let positions = new Float32Array(points);
  console.log("%cpositions", "color: #ccff00;", positions);

  return positions;
}

function convertToFloat32A() {
  // Assuming we have an array of point objects
  let b = new Float32Array(points.length * 3);
  for (let i = 0, j = 0; i < points.length; i++, j += 3) {
    b[j] = points[i].x;
    b[j + 1] = points[i].y;
    b[j + 2] = points[i].z;
  }
  return b;
}

function filterNan(points) {
  // Assuming we have an array of point objects
  return points.filter(point => !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z));
}

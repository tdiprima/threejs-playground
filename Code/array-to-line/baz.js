// The points array is a flat array containing the coordinates in the order [x1, y1, z1, x2, y2, z2, ...].
// Each consecutive triplet represents a point in 3D space.
// Each element in the array is directly assigned to the corresponding element in the positions Float32Array.
let createLine = function (points) {
  let geometry = new THREE.BufferGeometry();

  // Convert array of points to Float32Array
  let positions = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    positions[i] = points[i];
  }

  console.log("positions", positions);

  // Create THREE.BufferAttribute with the positions
  let positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  // Create THREE.LineSegments object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  return new THREE.LineSegments(geometry, material);
}

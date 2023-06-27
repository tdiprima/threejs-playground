let createLine = function(points) {
  // Step 1: Ensure the array of points does not contain NaN values
  // points = points.filter(point => !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z));

  // Step 2: Create a THREE.BufferGeometry object
  let geometry = new THREE.BufferGeometry();

  // Step 3: Convert the points array into a Float32Array
  let positions = new Float32Array(points.length * 3); // Each point has x, y, z coordinates
  for (let i = 0, j = 0; i < points.length; i++, j += 3) {
    positions[j] = points[i]; // points[i].x;
    positions[j + 1] = points[i + 1]; // points[i].y;
    positions[j + 2] = points[i + 2]; // points[i].z;
  }

  // Step 4: Create a THREE.BufferAttribute with the positions
  let positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  // Step 5: Create a THREE.LineSegments object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  return new THREE.LineSegments(geometry, material);

}

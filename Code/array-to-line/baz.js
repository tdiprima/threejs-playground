let createLine = function (points) {
  // Step 1: Create a THREE.BufferGeometry object
  let geometry = new THREE.BufferGeometry();

  // Step 2: Convert the array of points to a Float32Array
  let positions = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    positions[i] = points[i];
  }

  console.log("positions", positions);

  // Step 3: Create a THREE.BufferAttribute with the positions
  let positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  // Step 4: Create a THREE.LineSegments object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  return new THREE.LineSegments(geometry, material);
}

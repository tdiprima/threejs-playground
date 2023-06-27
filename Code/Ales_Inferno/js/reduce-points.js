let reducePoints = function(lineGeometry, thresholdDistance) {
  let positions = lineGeometry.attributes.position.array;
  let numPoints = positions.length / 3;

  let indicesToRemove = [];

  for (let i = 0; i < numPoints - 1; i++) {
    let currentPoint = new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);

    let nextPoint = new THREE.Vector3(positions[(i + 1) * 3], positions[(i + 1) * 3 + 1], positions[(i + 1) * 3 + 2]);

    let distance = currentPoint.distanceTo(nextPoint);

    if (distance < thresholdDistance) {
      indicesToRemove.push(i + 1);
    }
  }

  for (let i = indicesToRemove.length - 1; i >= 0; i--) {
    let indexToRemove = indicesToRemove[i];

    positions.splice(indexToRemove * 3, 3);
  }

  lineGeometry.setDrawRange(0, positions.length / 3);
  lineGeometry.attributes.position.needsUpdate = true;
}

function simp(points, scene) {
  let geometry = new THREE.BufferGeometry();

  // Convert the array of points to a Float32Array
  let positions = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    positions[i] = points[i];
  }

  // Decimate the points using Simplify.js
  let tolerance = 0.1; // Adjust the tolerance to control the level of decimation
  let simplifiedPoints = simplify(positions, tolerance, true);
  console.log("simplifiedPoints", simplifiedPoints, typeof simplifiedPoints);

  // Convert the simplified points to a Float32Array
  let simplifiedPositions = new Float32Array(simplifiedPoints);

  // Create a THREE.BufferAttribute with the simplified positions
  // let positionAttribute = new THREE.BufferAttribute(simplifiedPoints, 3);
  let positionAttribute = new THREE.BufferAttribute(simplifiedPositions, 3);
  geometry.setAttribute('position', positionAttribute);

  // Create a THREE.LineSegments object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  let line = new THREE.LineSegments(geometry, material);

  // Add the line to your scene
  scene.add(line);
}

let makeLine = function(points, scene) {
  let geometry = new THREE.BufferGeometry();

  let positions = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    positions[i] = points[i];
  }

  console.log("positions", positions);

  let positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  scene.add(new THREE.LineSegments(geometry, material));

  return geometry;
}

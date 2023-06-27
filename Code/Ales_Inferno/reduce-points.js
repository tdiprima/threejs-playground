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

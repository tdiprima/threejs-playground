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

function working(points, scene) {
  // CONVERT THE STUPID ARRAY
  let geometry = new THREE.BufferGeometry();

  // Convert array of points to Float32Array
  let positions = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    positions[i] = points[i];
  }
  console.log("positions", positions);

  // FINE.  CREATE LINE.
  let positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  // Create THREE.LineSegments object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  let line =  new THREE.LineSegments(geometry, material);
  scene.add(line);

  // CREATE ARRAYS IN CORRECT FORMAT FOR SIMPLIFICATION
  // let posArray = [];
  let simpArray = [];

  for (let i = 0, j = 0; i < points.length; i++, j += 3) {
    // Convert points to {x: Number, y: Number}
    let simpObject = {};
    simpObject.x = points[i];
    simpObject.y = points[i + 1];
    simpArray.push(simpObject);

    // Convert points to {x: Number, y: Number, z: Number}
    // let posObject = {};
    // posObject.x = points[i];
    // posObject.y = points[i + 1];
    // posObject.z = points[i + 2];
    // posArray.push(posObject);
  }

  // console.log("posArray", posArray);
  console.log("simpArray", simpArray);

  let tolerance = 5;
  let simplifiedPoints = simplify(simpArray, tolerance, true);
  console.log("simplifiedPoints", simplifiedPoints);
}

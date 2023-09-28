const drawPointsLine = function (scene) {
  // Assuming our points array is a flat array of numbers
  const points = [0.5, 0.5, 0, -0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0];

  if (points.length % 3 !== 0) {
    console.error('The points array length must be divisible by 3.'); // (x, y, z)
  } else {
    // Step 1: Create a THREE.BufferGeometry object
    let geometry = new THREE.BufferGeometry();

    // Step 2: Convert the array of points to a Float32Array
    let positions = new Float32Array(points);

    // Step 3: Create a THREE.BufferAttribute with the positions
    // Set the 'position' attribute with the correct vector (x, y, z)
    let positionAttribute = new THREE.BufferAttribute(positions, 3);
    geometry.setAttribute('position', positionAttribute);

    // Step 4: Create a THREE.Line* object using the geometry and a material
    let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

    // LineSegments makes it come out too dotty
    // let line = new THREE.LineSegments(geometry, material);

    let line = new THREE.Line(geometry, material);
    scene.add(line);
  }
}

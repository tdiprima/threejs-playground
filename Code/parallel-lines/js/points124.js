const drawPointsLine = function() {
  const points = [{"x":0.5, "y":0.5}, {"x":-0.5, "y":0.5}, {"x":-0.5, "y":-0.5}, {"x":0.5, "y":-0.5}];

  // Step 1: Create a THREE.Geometry object
  let geometry = new THREE.Geometry();

  // Step 2: Add the points to the geometry
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
  }

  // If points was an array of numbers, you'd do this instead
  // Step 2: Add the points to the geometry
  // for (let i = 0; i < points.length; i += 3) {
  //   geometry.vertices.push(new THREE.Vector3(points[i], points[i + 1], points[i + 2]));
  // }

  // Step 3: Create a THREE.Line object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  let line = new THREE.Line(geometry, material);
  scene.add(line);
}

// REV 124 or something
let createLine = function (points) {
  // Create a Geometry object
  let geometry = new THREE.Geometry();

  // Add the points to the geometry
  for (let i = 0; i < points.length; i += 3) {
    geometry.vertices.push(new THREE.Vector3(points[i], points[i + 1], points[i + 2]));
  }

  // Create a Line object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  return new THREE.Line(geometry, material);
}

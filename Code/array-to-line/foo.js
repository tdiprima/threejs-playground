// REV 124 or something
// `points` is an array of objects with x, y, and z coordinates representing the points in 3D space
let createLine = function (points) {
  // Step 1: Create a THREE.Geometry object
  let geometry = new THREE.Geometry();

  // Step 2: Add the points to the geometry
  // for (let i = 0; i < points.length; i++) {
  //   let point = points[i];
  //   geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
  // }

  for (let i = 0, j = 0; i < points.length; i++, j += 3) {
    // This makes no sense, because where are "positions"?
    // positions[j] = points[i].x;
    // positions[j + 1] = points[i].y;
    // positions[j + 2] = points[i].z;

    geometry.vertices.push(new THREE.Vector3(points[i], points[i + 1], points[i + 2]));
    // Actually, 'z' should be zero, so... what are these `points` that I have??
    // myObject.z = points[i + 2];

  }

  // Step 3: Create a THREE.Line object using the geometry and a material
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  return new THREE.Line(geometry, material);
}

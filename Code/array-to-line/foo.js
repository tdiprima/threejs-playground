// REV 124 or something
// `points` is an array of objects with x, y, and z coordinates representing the points in 3D space
let createLine = function (points) {
  let geometry = new THREE.Geometry();

  // Add the points to the geometry
  for (let i = 0, j = 0; i < points.length; i++, j += 3) {
    // 'z' should be zero - and it is (look at the array)
    geometry.vertices.push(new THREE.Vector3(points[i], points[i + 1], points[i + 2]));
  }

  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

  return new THREE.Line(geometry, material);
}

function f() {
  let geometry = new THREE.Geometry();

  // Add points to geometry (where `points` is an array of objects containing x,y,z)
  for (let i = 0; i < points.length; i++) {
    let point = points[i];
    geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z));
  }
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  let line = new THREE.Line(geometry, material);

  scene.add(line);

  renderer.render(scene, camera);
}
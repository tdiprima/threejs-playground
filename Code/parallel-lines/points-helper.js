// create points helper
let createPoints = function(len, rotationCount, height, maxRadius) {
  rotationCount = rotationCount === undefined ? 8 : rotationCount; // number of rotations
  height = height === undefined ? 5 : height;
  maxRadius = maxRadius === undefined ? 5 : maxRadius;

  let yDelta = height / len;
  let points = [];
  let i = 0;
  let v;
  let radian;
  let radius;
  let per;

  while (i < len) {
    per = i / (len - 1);
    radian = Math.PI * 2 * rotationCount * per;
    radius = maxRadius * per;
    v = new THREE.Vector3();
    v.x = Math.cos(radian) * radius;
    v.z = Math.sin(radian) * radius;
    v.y = i * yDelta;
    points.push(v);
    i += 1;
  }
  return points;
};

// Create Points helper function
// -------- ----------
// SCENE, CAMERA, RENDERER
// -------- ----------
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.5, 100);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
// let renderer = new THREE.WebGL1Renderer();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(640, 480, false);
(document.getElementById('demo') || document.body).appendChild(renderer.domElement);

// -------- ----------
// HELPERS
// -------- ----------
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

// update lines group
let updateLinesGroup = function(lines, rs, rDelta, height, radius) {
  lines.children.forEach((line, i, arr) => {
    let per = (i + 1) / arr.length;
    line.geometry.setFromPoints(createPoints(150, rs + rDelta * per, height, radius));
  });
};

// -------- ----------
// LINE
// -------- ----------
// create lines group
let lines = new THREE.Group();
let lineCount = 12;
let colors = [0x00ff00, 0xff0000, 0x0000ff, 0xff00ff, 0x00ffff, 0xffff00];
let i = 0;
while (i < lineCount) {
  let per = i / lineCount;
  let points = createPoints(100, 1 + 0.2 * per, 0, 5);
  let geometry = new THREE.BufferGeometry().setFromPoints(points);
  let line = (scene.userData.line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color: colors[i % colors.length],
      linewidth: 6
    })
  ));
  lines.add(line);
  i += 1;
}
scene.add(lines);
updateLinesGroup(lines, 0.5, 1.4, 10, 4);
lines.position.y = -8;

// -------- ----------
// RENDER
// -------- ----------
renderer.render(scene, camera);

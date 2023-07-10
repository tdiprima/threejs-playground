// Using a Curve to create points for a line
// -------- ----------
// SCENE, CAMERA, RENDERER
// -------- ----------
let scene = new THREE.Scene();
scene.add(new THREE.GridHelper(10, 10));
let camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.5, 100);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(640, 480, false);
(document.getElementById('demo') || document.body).appendChild(renderer.domElement);

// -------- ----------
// CURVE
// -------- ----------
let v_start = new THREE.Vector3(0, 0, 5);
let v_end = new THREE.Vector3(-5, 0, -5);
let v_control = v_start
  .clone()
  .lerp(v_end, 0.5)
  .add(new THREE.Vector3(14.7, 0, -5));
let curve = new THREE.QuadraticBezierCurve3(v_start, v_control, v_end);

// -------- ----------
// POINTS, GEOMETRY, LINE
// -------- ----------
let geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 }));
line.position.y = 0.1;
scene.add(line);

// -------- ----------
// RENDER
// -------- ----------
renderer.render(scene, camera);

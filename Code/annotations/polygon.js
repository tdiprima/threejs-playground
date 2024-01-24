let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
let isDrawing = false;
let points = [];
let currentPolygon = null;

renderer.domElement.addEventListener("mousedown", onMouseDown, false);
renderer.domElement.addEventListener("mousemove", onMouseMove, false);
renderer.domElement.addEventListener("mouseup", onMouseUp, false);
renderer.domElement.addEventListener("dblclick", onDoubleClick, false);

function onMouseDown(event) {
  event.preventDefault();
  if (!isDrawing) {
    isDrawing = true;
    points = []; // Reset points
    let point = getMousePosition(event.clientX, event.clientY);
    points.push(point);
    currentPolygon = createPolygon();
  }
}

function onMouseMove(event) {
  event.preventDefault();
  if (isDrawing) {
    let point = getMousePosition(event.clientX, event.clientY);
    points[points.length - 1] = point;
    updatePolygon();
  }
}

function onMouseUp(event) {
  event.preventDefault();
  if (isDrawing) {
    let point = getMousePosition(event.clientX, event.clientY);
    points.push(point);
    updatePolygon();
  }
}

function onDoubleClick(event) {
  event.preventDefault();
  if (isDrawing && points.length >= 3) {
    isDrawing = false;
    points.pop(); // Remove the duplicated point from double-click
    updatePolygon();
    currentPolygon = null;
  }
}

function getMousePosition(clientX, clientY) {
  let domRect = renderer.domElement.getBoundingClientRect();

  let mouse = new THREE.Vector2();
  mouse.x = ((clientX - domRect.left) / domRect.width) * 2 - 1;
  mouse.y = -((clientY - domRect.top) / domRect.height) * 2 + 1;

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  let intersectionPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)), intersectionPoint);

  return intersectionPoint;
}

function createPolygon() {
  let geometry = new THREE.BufferGeometry();
  let polygon = new THREE.LineLoop(geometry, material);
  scene.add(polygon);
  return polygon;
}

function updatePolygon() {
  if (currentPolygon && points.length > 0) {
    let positions = new Float32Array(points.length * 3);
    for (let i = 0; i < points.length; i++) {
      positions[i * 3] = points[i].x;
      positions[i * 3 + 1] = points[i].y;
      positions[i * 3 + 2] = points[i].z;
    }
    currentPolygon.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    currentPolygon.geometry.attributes.position.needsUpdate = true;
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Create a scene
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a rectangle
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Set up geometry
let geometry = new THREE.BufferGeometry(); // our 3D object
let vertices = new Float32Array(12); // 4 vertices
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); // each vertex is composed of 3 values

// LineLoop: A continuous line that connects back to the start.
let rect = new THREE.LineLoop(geometry, material);
scene.add(rect);

// Handle mouse events
let isDrawing = false;
let startPoint;
let endPoint;
renderer.domElement.addEventListener("mousedown", onMouseDown, false);
renderer.domElement.addEventListener("mousemove", onMouseMove, false);
renderer.domElement.addEventListener("mouseup", onMouseUp, false);

function onMouseDown(event) {
  event.preventDefault();
  isDrawing = true;
  startPoint = getMousePosition(event.clientX, event.clientY);
}

function onMouseMove(event) {
  event.preventDefault();
  if (isDrawing) {
    endPoint = getMousePosition(event.clientX, event.clientY);
    updateRectangle();
  }
}

function onMouseUp(event) {
  event.preventDefault();
  isDrawing = false;
  endPoint = getMousePosition(event.clientX, event.clientY);
  updateRectangle();
}

function getMousePosition(clientX, clientY) {
  // Get the size and position of the canvas element
  let domRect = renderer.domElement.getBoundingClientRect();

  // Normalize mouse coordinates
  let mouse = new THREE.Vector2();
  mouse.x = ((clientX - domRect.left) / domRect.width) * 2 - 1;
  mouse.y = -((clientY - domRect.top) / domRect.height) * 2 + 1;

  // Initialize our Raycaster
  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera); // set raycaster's origin and direction

  // Define an intersection point
  let intersectionPoint = new THREE.Vector3();
  // Calculate intersection with plane
  raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)), intersectionPoint);

  return intersectionPoint;
}

function updateRectangle() {
  let positions = rect.geometry.attributes.position.array;
  positions[0] = startPoint.x;
  positions[1] = startPoint.y;
  positions[2] = startPoint.z;
  positions[3] = endPoint.x;
  positions[4] = startPoint.y;
  positions[5] = startPoint.z;
  positions[6] = endPoint.x;
  positions[7] = endPoint.y;
  positions[8] = startPoint.z;
  positions[9] = startPoint.x;
  positions[10] = endPoint.y;
  positions[11] = startPoint.z;
  rect.geometry.attributes.position.needsUpdate = true;
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

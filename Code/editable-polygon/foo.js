// https://cdnjs.cloudflare.com/ajax/libs/three.js/r80/three.min.js
console.log(`%cREVISION ${THREE.REVISION}`, "color: #ff00cc;");
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const initialVertices = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(1, 1, 0),
  new THREE.Vector3(0, 0, 0)
];

// Create geometry
const geometry = new THREE.Geometry();
geometry.vertices = initialVertices;

function createGeo() {
  // Create material
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Create mesh
  const mesh = new THREE.Mesh(geometry, material);

  // Add mesh to scene
  scene.add(mesh); // where's my mesh?
}

function createGeo1() {
  // Made line instead, but needed to add another point for the last line to be drawn.
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00, depthWrite: false, linewidth: 4 });
  let line = new THREE.Line(geometry, material);
  scene.add(line);
}

// createGeo();
createGeo1();

document.body.addEventListener("mousedown", function () {
  console.log("%cdocument mousedown", "color: #ccff00");
});

// Create handles for each vertex
const handles = [];
for (let i = 0; i < initialVertices.length; i++) {
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.copy(initialVertices[i]);
  handles.push(handleMesh);

  // Add event listeners for dragging
  handleMesh.addEventListener('mousedown', onMouseDown);
  handleMesh.addEventListener('mousemove', onMouseMove);
  handleMesh.addEventListener('mouseup', onMouseUp);
}

// Function to handle dragging
let activeHandle = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// todo: event handlers not firing
function onMouseDown(event) {
  console.log("foo");
  // Set a flag or store the handle as active
  event.preventDefault();
  activeHandle = event.target;
  const index = handles.indexOf(activeHandle);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(mesh);
  if (intersects.length > 0) {
    const position = intersects[0].point;
    geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
    geometry.attributes.position.needsUpdate = true;
  }
}

function onMouseMove(event) {
  console.log("foo");
  // If a handle is active, update its position based on mouse movement
  // Recalculate the new polygon vertices and update the geometry
  event.preventDefault();
  if (activeHandle) {
    const index = handles.indexOf(activeHandle);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      const position = intersects[0].point;
      geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
      geometry.attributes.position.needsUpdate = true;
    }
  }
}

function onMouseUp(event) {
  console.log("foo");
  // Clear the active handle flag or remove reference to the active handle
  event.preventDefault();
  activeHandle = null;
}

// Add handles to the scene
// handles.forEach(element => console.log(element));
handles.forEach(element => scene.add(element));

// Implement the logic to update the polygon shape when handles are dragged
// Update the geometry.vertices array with the new positions and set verticesNeedUpdate to true

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();

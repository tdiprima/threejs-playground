console.log(`%cREVISION ${THREE.REVISION}`, "color: #ff00cc;");

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create initial polygon vertices
const initialVertices = [
  0, 0, 0,
  1, 0, 0,
  1, 1, 0,
];

// Create geometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialVertices, 3));

// Create material
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});

// Create mesh
const mesh = new THREE.Mesh(geometry, material);

// Add mesh to scene
scene.add(mesh);

// Create handles for each vertex
const handles = [];
for (let i = 0; i < initialVertices.length; i += 3) {
  const handleGeometry = new THREE.SphereGeometry(0.1);
  const handleMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
  const handleMesh = new THREE.Mesh(handleGeometry, handleMaterial);
  handleMesh.position.fromArray(initialVertices.slice(i, i + 3));
  handles.push(handleMesh);

  // Add event listeners for dragging
  handleMesh.addEventListener('mousedown', onPointerDown);
  handleMesh.addEventListener('mousemove', onPointerMove);
  handleMesh.addEventListener('mouseup', onPointerUp);

  handleMesh.cursor = 'move';
  handleMesh.userData.index = i / 3;
}

// Function to handle dragging
let activeHandle = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onPointerDown(event) {
  event.preventDefault();
  console.log("onPointerDown");
  activeHandle = event.target;
  activeHandle.material.color.set(0xffff00);

  document.addEventListener('mousemove', onPointerMove);
  document.addEventListener('mouseup', onPointerUp);
}

function onPointerMove(event) {
  event.preventDefault();
  console.log("onPointerMove");
  if (activeHandle) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(mesh);
    if (intersects.length > 0) {
      const position = intersects[0].point;
      const index = activeHandle.userData.index;
      geometry.attributes.position.setXYZ(index, position.x, position.y, position.z);
      geometry.attributes.position.needsUpdate = true;
    }
  }
}

function onPointerUp(event) {
  event.preventDefault();
  console.log("onPointerUp");
  activeHandle.material.color.set(0xff0000);
  activeHandle = null;

  document.removeEventListener('mousemove', onPointerMove);
  document.removeEventListener('mouseup', onPointerUp);
}

// Add handles to the scene
handles.forEach(element => scene.add(element));

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

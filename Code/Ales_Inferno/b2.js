const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a TextureLoader instance
const textureLoader = new THREE.TextureLoader();

// Create a global raycaster
const raycaster = new THREE.Raycaster();

// Create a list to store objects for raycasting
const clickableObjects = [];

// Load the image texture
textureLoader.load('image1.jpg', function (texture) {
  // Create a PlaneGeometry with the desired size
  const geometry = new THREE.PlaneGeometry(1, 1);

  // Create a MeshBasicMaterial with the loaded texture
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create a mesh using the geometry and material
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(1.0, texture.image.height / texture.image.width, 1.0);
  mesh.userData.interactive = true;

  // Add the mesh to the scene
  scene.add(mesh);
  clickableObjects.push(mesh);

  // Add the mesh to the list of clickable objects

});

// Event listener for mouse clicks
function onDocumentMouseDown(event) {
  // Calculate the mouse position in normalized device coordinates (-1 to +1)
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Raycast against the list of clickable objects
  const intersects = raycaster.intersectObjects(clickableObjects);

  // Check if any objects were intersected
  if (intersects.length > 0) {
    console.log('Image clicked!');
  }
}

// Attach the mouse down event listener to the document
document.addEventListener('mousedown', onDocumentMouseDown);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

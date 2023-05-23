const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Event listener function
function onImageClick() {
  console.log('Hello');
}

// Event listener function
function onImageMouseDown() {
  console.log('Hello');
}

// Create a TextureLoader instance
const textureLoader = new THREE.TextureLoader();

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

  // Add the 'mousedown' event listener after the image has loaded
  mesh.addEventListener('mousedown', onImageMouseDown);

  // Add the 'click' event listener after the image has loaded
  mesh.addEventListener('click', onImageClick);
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Define the desired size for the plane
let canvDim = { w: 512, h: 256 };

// Create a scene, camera, and renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, canvDim.w / canvDim.h, 0.1, 1000);

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;

let container = document.getElementById('container');
container.appendChild(renderer.domElement);

// Create the PlaneGeometry with the desired size
const planeGeometry = new THREE.PlaneGeometry(canvDim.w, canvDim.h);

// Create a TextureLoader instance
const textureLoader = new THREE.TextureLoader();

// Load the image texture
textureLoader.load('/images/Victoriosa.jpg', function(texture) {
  // Scale the texture to fit the desired plane size
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  // Create a material using the texture
  const material = new THREE.MeshBasicMaterial({ map: texture });

  // Create the plane mesh with the geometry and material
  const plane = new THREE.Mesh(planeGeometry, material);

  // Add the plane to the scene
  scene.add(plane);

  // Position the camera to see the plane
  camera.position.z = 1.5;

  // Render the scene
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
});

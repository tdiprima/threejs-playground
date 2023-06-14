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

// Load the image texture
let textureLoader = new THREE.TextureLoader();
textureLoader.load('/images/Victoriosa.jpg', texture => {
  // Scale the image to fit the canvas
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(0.5, 0.5); // Adjust the repeat values to fit the canvas

  let imageAspectRatio = texture.image.width / texture.image.height;
  console.log('%cimageAspectRatio', 'color: #ccff00;', imageAspectRatio);

  // Create a plane with the image texture
  let planeGeometry = new THREE.PlaneGeometry(imageAspectRatio, 1);
  let material = new THREE.MeshBasicMaterial({ map: texture });
  let plane = new THREE.Mesh(planeGeometry, material);
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

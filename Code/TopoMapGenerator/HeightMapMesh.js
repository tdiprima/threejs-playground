import * as THREE from 'three';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Add a light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5).normalize();
scene.add(light);

// Load the image
const loader = new THREE.TextureLoader();
loader.load('MountainHeightMap.png', (texture) => {
  // Get image dimensions
  const width = texture.image.width;
  const height = texture.image.height;

  // Create a plane geometry based on the image dimensions
  const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);

  // Get the image data for height mapping
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.drawImage(texture.image, 0, 0);

  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Update the z-coordinate of each vertex based on the grayscale value
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
    geometry.attributes.position.setZ(j, gray / 255 * 20); // Adjust the scale as needed
  }

  geometry.computeVertexNormals();

  // Create a material
  const material = new THREE.MeshPhongMaterial({
    color: 0x888888,
    wireframe: true, // Toggle this to false to see the surface more clearly
  });

  // Create the mesh
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; // Rotate the plane to lay flat
  scene.add(mesh);

  // Render the scene
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Create a geometry (e.g., a simple cube)
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);

// Create a texture
// THREE.WebGLRenderer: Texture has been resized from (400x300) to (256x256)
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/images/image1.jpg');
texture.colorSpace = THREE.SRGBColorSpace;

// Create the custom shader materials
let originalMaterial = new THREE.MeshBasicMaterial({ map: texture }); // Original material without shading
let filterColor = new THREE.Vector3(1, 0, 0); // Red color filter
let shadingMaterial = new THREE.ShaderMaterial({
  uniforms: {
    myTexture: { value: texture },
    filterColor: { value: filterColor }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D myTexture;
    uniform vec3 filterColor;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(myTexture, vUv);
      texel.rgb *= filterColor.rgb;
      gl_FragColor = texel;
    }
  `
});

// Create a mesh using the geometry and original material
const cube = new THREE.Mesh(geometry, originalMaterial);
scene.add(cube);

// Set up the camera position
camera.position.z = 3;

// Function to handle toggle button click
let shadingEnabled = false;
function toggleShading() {
  shadingEnabled = !shadingEnabled;
  if (shadingEnabled) {
    cube.material = shadingMaterial;
  } else {
    cube.material = originalMaterial;
  }
}

// Event listener for toggle button click
const toggleButton = document.getElementById("shader-toggle");
toggleButton.addEventListener("click", toggleShading);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Create a geometry (e.g., a simple cube)
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Create a texture
// THREE.WebGLRenderer: Texture has been resized from (400x300) to (256x256)
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/images/image1.jpg');

// Create the custom shader material
let filterColor = new THREE.Vector3(1, 0, 0); // Red color filter
let colorizationMaterial = new THREE.ShaderMaterial({
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

// Create a mesh using the geometry and material
const cube = new THREE.Mesh(geometry, colorizationMaterial);
scene.add(cube);

// Set up the camera position
camera.position.z = 3;

// Function to handle button click
function applyShading() {
  filterColor = new THREE.Vector3(1, 0, 0); // Red color filter
  colorizationMaterial.uniforms.filterColor.value = filterColor;
}

// Event listener for button click
const button = document.getElementById("shader-toggle");
button.addEventListener("click", applyShading);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
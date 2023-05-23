// Set up the four scenes
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
const scene4 = new THREE.Scene();

// Create the cameras
const camera1 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera3 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera4 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add the four images to the scenes
const loader = new THREE.TextureLoader();
const geometry = new THREE.PlaneGeometry(5, 5);

const image1 = loader.load('image1.jpg');
const material1 = new THREE.MeshBasicMaterial({ map: image1 })
const mesh1 = new THREE.Mesh(geometry, material1);
mesh1.position.set(-2, 2, 0);
scene1.add(mesh1);

const image2 = loader.load('image2.jpg');
const material2 = new THREE.MeshBasicMaterial({ map: image2 })
const mesh2 = new THREE.Mesh(geometry, material2);
mesh2.position.set(2, 2, 0);
scene2.add(mesh2);

const image3 = loader.load('image3.jpg');
const material3 = new THREE.MeshBasicMaterial({ map: image3 })
const mesh3 = new THREE.Mesh(geometry, material3);
mesh3.position.set(-2, -2, 0);
scene3.add(mesh3);

const image4 = loader.load('image4.jpg');
const material4 = new THREE.MeshBasicMaterial({ map: image4 })
const mesh4 = new THREE.Mesh(geometry, material4);
mesh4.position.set(2, -2, 0);
scene4.add(mesh4);

// Set up the controls for each camera
const controls1 = new THREE.OrbitControls(camera1, renderer.domElement);
controls1.target.set(mesh1.position.x, mesh1.position.y, mesh1.position.z);
controls1.enableZoom = true;
controls1.enablePan = true;

const controls2 = new THREE.OrbitControls(camera2, renderer.domElement);
controls2.target.set(mesh2.position.x, mesh2.position.y, mesh2.position.z);
controls2.enableZoom = true;
controls2.enablePan = true;

const controls3 = new THREE.OrbitControls(camera3, renderer.domElement);
controls3.target.set(mesh3.position.x, mesh3.position.y, mesh3.position.z);
controls3.enableZoom = true;
controls3.enablePan = true;

const controls4 = new THREE.OrbitControls(camera4, renderer.domElement);
controls4.target.set(mesh4.position.x, mesh4.position.y, mesh4.position.z);
controls4.enableZoom = true;
controls4.enablePan = true;

// Set up the initial camera positions
camera1.position.set(0, 0, 10);
camera2.position.set(0, 0, 10);
camera3.position.set(0, 0, 10);
camera4.position.set(0, 0, 10);

// Add the scenes to the renderer
renderer.render(scene1, camera1);
renderer.render(scene2, camera2);
renderer.render(scene3, camera3);
renderer.render(scene4, camera4); // cut off here

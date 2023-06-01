import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const loader = new THREE.TextureLoader();
const geometry = new THREE.PlaneGeometry(1, 1);
let selectedCamera = null;
const raycaster = new THREE.Raycaster();

// Set up the parent scene and camera. ¿Por qué?
const parentScene = new THREE.Scene();
const parentCamera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
parentCamera.position.set(0, 0, 10);

// Set up the renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scenes = [];
let cameras = [];
let controls = [];
let meshes = [];

for (let i = 0; i < numScenes; i++) {
  // Create a separate scene for each image
  const scene = new THREE.Scene();
  scenes.push(scene);

  // Add each scene to the parent scene
  parentScene.add(scene);

  // Create a separate camera for each image
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.name = `camera${i + 1}`;
  camera.position.set(0, 0, 5); // Set position of camera
  scene.add(camera);
  cameras.push(camera);

  // Load each image and add it to its corresponding scene
  const image = loader.load(`/images/image${i + 1}.jpg`);
  const material = new THREE.MeshBasicMaterial({ map: image, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `image${i + 1}`;
  scene.add(mesh);
  meshes.push(mesh);

  // Create controls for each camera
  const control = new OrbitControls(camera, renderer.domElement);
  controls.push(control);

  // Set up event listeners to control the cameras
  control.addEventListener('start', () => {
    selectedCamera = camera; // naturally the selected one is the last one (camera4)
  });

  // Move the event listener addition here
  control.addEventListener('change', () => {
    // console.log("¿Esto es un micró?"); // ¡Sí!
    cameras.forEach((c, index) => {
      // ¿Esto te parece familiar?
      if (index !== i) {
        c.position.copy(cameras[i].position);
        c.rotation.copy(cameras[i].rotation);
      }
    });
  });
}

// Add click event listener to the renderer's DOM element
renderer.domElement.addEventListener('click', onClick, false);

function onClick(event) {
  // Calculate normalized device coordinates (NDC) from the click position
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Perform raycasting from the camera
  // const raycaster = new THREE.Raycaster(); // moved up
  raycaster.setFromCamera(mouse, parentCamera);

  // Intersect the ray with the meshes
  const intersects = raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
    // Find the name of the clicked mesh
    const clickedMesh = intersects[0].object;
    const clickedIndex = meshes.indexOf(clickedMesh);
    // const clickedName = meshNames[clickedIndex];
    const clickedName = clickedMesh.name;

    console.log(`Clicked: ${clickedName}, ${cameras[clickedIndex].name}`);
    selectedCamera = cameras[clickedIndex];
  }
}

// Position the images
meshes[0].position.set(-1, 1, 0);
meshes[1].position.set(1, 1, 0);
meshes[2].position.set(-1, -1, 0);
meshes[3].position.set(1, -1, 0);

// Set up a function to handle window resizing
function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

// Render the scene
function render() {
  requestAnimationFrame(render);

  for (let i = 0; i < numScenes; i++) {
    if (selectedCamera && selectedCamera !== cameras[i]) {
      cameras[i].position.copy(selectedCamera.position);
      cameras[i].rotation.copy(selectedCamera.rotation);
    }
    controls[i].update();
  }

  // Update the selected camera's controls
  if (selectedCamera) {
    selectedCamera.lookAt(0, 0, 0);
    selectedCamera.updateProjectionMatrix();
  }

  /*
    if (selectedCamera) {
      console.log("HERE => ", selectedCamera.name);
      selectedCamera.updateProjectionMatrix();
      selectedCamera.updateMatrixWorld();
      selectedCamera.updateWorldMatrix(true, true);
      selectedCamera.updateMatrix();
      selectedCamera.updateMatrixWorld(true);
      selectedCamera.lookAt(0, 0, 0);
      selectedCamera.updateProjectionMatrix();
      selectedCamera.updateMatrixWorld(true);
      selectedCamera.updateMatrix();
      selectedCamera.updateWorldMatrix(true, true);
      // Wait, then shouldn't I render the selectedCamera? Estoy confundida.
    }
    // selectedCamera = null;
  */
  /*
    for (let i = 0; i < numScenes; i++) {
      controls[i].update();
    }
  */

  // Render the parent scene
  renderer.render(parentScene, parentCamera);
}

render();

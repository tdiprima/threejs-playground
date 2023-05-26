import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const loader = new THREE.TextureLoader();
const geometry = new THREE.PlaneGeometry(1, 1);
let selectedCamera = null;
const raycaster = new THREE.Raycaster();

const parentScene = new THREE.Scene();
const parentCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
parentCamera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scenes = [];
let cameras = [];
let controls = [];
let meshes = [];

for (let i = 0; i < numScenes; i++) {
  const scene = new THREE.Scene();
  scenes.push(scene);
  parentScene.add(scene);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.name = `camera${i + 1}`;
  camera.position.set(0, 0, 2);
  scene.add(camera);
  cameras.push(camera);

  let image = loader.load(`image${i + 1}.jpg`);
  let material = new THREE.MeshBasicMaterial({map: image, side: THREE.DoubleSide});
  // Set the position and scale of the mesh so that it fits within the canvas for that image.
  let mesh = new THREE.Mesh(geometry, material);
  mesh.name = `image${i + 1}`;
  scene.add(mesh);
  meshes.push(mesh);

  // OrbitControls should typically be attached to the main camera that you use for rendering (parentCamera).
  // But we want to be able to move these things separately.
  const control = new OrbitControls(camera, renderer.domElement);
  // todo: target? see esqueletos1.js
  control.addEventListener('start', () => {
    selectedCamera = camera;
  });
  controls.push(control);
}

// Position the images
meshes[0].position.set(-2, 2, 0);
meshes[1].position.set(2, 2, 0);
meshes[2].position.set(-2, -2, 0);
meshes[3].position.set(2, -2, 0);

// const controls = new OrbitControls(parentCamera, renderer.domElement);
// controls.addEventListener('start', () => {
//   selectedCamera = parentCamera;
// });

// Set up a function to handle window resizing
function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

function onDocumentMouseDown(event) {
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  raycaster.setFromCamera(mouse, parentCamera);

  const intersects = raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
    selectedCamera = intersects[0].object.parent.children[0];
  }
}

document.addEventListener('mousedown', onDocumentMouseDown);

function onDocumentMouseUp(event) {
  selectedCamera = null;
}

document.addEventListener('mouseup', onDocumentMouseUp);

function onDocumentMouseMove(event) {
  if (selectedCamera) {
    console.log(selectedCamera.name);
    // Retrieve the movement distance of the mouse in the horizontal (X) and vertical (Y) directions
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    // Calculate the rotation angles based on the mouse movement and the window size
    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    // Rotate the selected camera around the world Y-axis (0, 1, 0) by the horizontal angle (theta)
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta);

    // Rotate the selected camera around the world X-axis (1, 0, 0) by the vertical angle (phi)
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi);
  }
  // selectedCamera = null;
}

document.addEventListener('mousemove', onDocumentMouseMove);

function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
  }
  // controls.update();
  renderer.render(parentScene, parentCamera);
}

/*
// Yeah, no.  This isn't just wrong, it's bad.  A browser freezer.
function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < numScenes; i++) {
    controls.target = meshes[i].position; // Set the control's target to the current scene's mesh position
    controls.update(); // Update the controls for the current camera

    // If the current camera is the selected camera, update its position in the scene
    if (selectedCamera && cameras[i] === selectedCamera) {
      const deltaX = event.movementX;
      const deltaY = event.movementY;
      const theta = (deltaX / window.innerWidth) * Math.PI * 2;
      const phi = (deltaY / window.innerHeight) * Math.PI * 2;
      selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta);
      selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi);
    }
  }

  renderer.render(parentScene, parentCamera);
}
 */

animate();

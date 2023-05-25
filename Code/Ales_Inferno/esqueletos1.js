import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const parentScene = new THREE.Scene();
let parentCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

// Create a target object to control the camera
// const target = new THREE.Object3D();
// parentScene.add(target);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let scenes = [];
let cameras = [];
let controls = [];
// let meshes = [];

for (let i = 0; i < numScenes; i++) {
  // Create the four scenes and cameras
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Add the scenes to a parent scene
  parentScene.add(scene);

  // Create the four controls
  const control = new OrbitControls(camera, renderer.domElement);
  // control.target = target;

  control.addEventListener('start', () => {
    selectedCamera = camera;
  });

  let cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    })
  );
  cube.position.set(0, 0, 0);
  scene.add(cube);

  scenes.push(scene);
  cameras.push(camera);
  controls.push(control);
  // meshes.push(cube);
}

// Position the cameras
cameras[0].position.z = 5;
cameras[1].position.x = 5;
cameras[2].position.y = 5;
cameras[3].position.set(-5, 0, 5);

// Position the meshes
// meshes[0].position.set(-1, 1, 0);
// meshes[1].position.set(1, 1, 0);
// meshes[2].position.set(-1, -1, 0);
// meshes[3].position.set(1, -1, 0);
// todo: Yeah! Do this instead: cube.position.set(0, 0, 0);

// Set up event listeners to control the cameras
let selectedCamera = null;

function onDocumentMouseDown(event) {
  if (event.button === 0) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseX < window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = cameras[0];
    } else if (mouseX >= window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = cameras[1];
    } else if (mouseX < window.innerWidth / 2 && mouseY >= window.innerHeight / 2) {
      selectedCamera = cameras[2];
    } else {
      selectedCamera = cameras[3];
    }
  }
}

document.addEventListener('mousedown', onDocumentMouseDown);

function onDocumentMouseUp(event) {
  selectedCamera = null;
}

document.addEventListener('mouseup', onDocumentMouseUp);

function onDocumentMouseMove(event) {
  event.preventDefault();

  if (selectedCamera) {
    // Retrieve the movement distance of the mouse in the horizontal (X) and vertical (Y) directions
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    // Calculate the rotation angles based on the mouse movement and the window size
    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    // Rotate the selected camera
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta); // around the world Y-axis (0, 1, 0) by the horizontal angle (theta)
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi); // around the world X-axis (1, 0, 0) by the vertical angle (phi)
  }
}

document.addEventListener('mousemove', onDocumentMouseMove);

function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

function render() {
  for (let i = 0; i < numScenes; i++) {
    renderer.render(scenes[i], cameras[i]);
  }
}

function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
  }
  render();
}

animate();

// const loader = new THREE.TextureLoader();
// const geometry = new THREE.PlaneGeometry(5, 5);
// const image1 = loader.load('image1.jpg');
// const material1 = new THREE.MeshBasicMaterial({ map: image1 })
// const mesh1 = new THREE.Mesh(geometry, material1);
// mesh1.position.set(-2, 2, 0);

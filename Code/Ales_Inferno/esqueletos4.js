import * as THREE from "three";

const numScenes = 4;
const width = window.innerWidth;
const height = window.innerHeight;
const windowHalfX = width / 2;
const windowHalfY = height / 2;

let scenes = [];
let cameras = [];
let renderers = [];

for (let i = 0; i < numScenes; i++) {
  // SCENES AND CAMERAS
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

  // CUBES
  let cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    })
  );
  cube.position.set(0, 0, 0);
  scene.add(cube);

  // RENDERERS
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(windowHalfX, windowHalfY);
  renderer.domElement.style.position = 'absolute'; // even for the 1st one
  renderer.domElement.style.top = '0'; // reset others later
  renderer.domElement.style.left = '0';
  document.body.appendChild(renderer.domElement);

  scenes.push(scene);
  cameras.push(camera);
  renderers.push(renderer);
}

// Position the cameras
cameras[0].position.z = 5;
cameras[1].position.x = 5;
cameras[2].position.y = 5;
cameras[3].position.set(-5, 0, 5);

// Position the renderers
// renderers[1].domElement.style.top = '0';
renderers[1].domElement.style.left = `${windowHalfX}px`;
renderers[2].domElement.style.position = 'absolute';
renderers[2].domElement.style.top = `${windowHalfY}px`;
// renderers[2].domElement.style.left = '0';
renderers[3].domElement.style.top = `${windowHalfY}px`;
renderers[3].domElement.style.left = `${windowHalfX}px`;

// EVENT LISTENERS TO CONTROL THE CAMERAS

function onDocumentMouseDown(event) {
  event.preventDefault();

  // todo: IDK why we're adding and removing and adding...
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
}

function onDocumentMouseMove(event) {
  const mouseX = event.clientX - windowHalfX;
  const mouseY = event.clientY - windowHalfY;

  const camera1X = (mouseX / width) * 2 - 1;
  const camera1Y = -(mouseY / height) * 2 + 1;
  cameras[0].position.x = camera1X * 10;
  cameras[0].position.y = camera1Y * 10;
  cameras[0].lookAt(scenes[0].position);

  const camera2X = ((mouseX - windowHalfX) / width) * 2 - 1;
  const camera2Y = -(mouseY / height) * 2 + 1;
  cameras[1].position.x = camera2X * 10;
  cameras[1].position.y = camera2Y * 10;
  cameras[1].lookAt(scenes[1].position);

  const camera3X = (mouseX / width) * 2 - 1;
  const camera3Y = -((mouseY - windowHalfY) / height) * 2 + 1;
  cameras[2].position.x = camera3X * 10;
  cameras[2].position.y = camera3Y * 10;
  cameras[2].lookAt(scenes[2].position);

  const camera4X = ((mouseX - windowHalfX) / width) * 2 - 1;
  const camera4Y = -((mouseY - windowHalfY) / height) * 2 + 1;
  cameras[3].position.x = camera4X * 10;
  cameras[3].position.y = camera4Y * 10;
  cameras[3].lookAt(scenes[3].position);

  // Render scenes cameras
  for (let i = 0; i < numScenes; i++) {
    renderers[i].render(scenes[i], cameras[i]);
  }
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('mouseup', onDocumentMouseUp);
}

document.addEventListener('mousedown', onDocumentMouseDown);

function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < numScenes; i++) {
    renderers[i].render(scenes[i], cameras[i]);
  }
}

animate();

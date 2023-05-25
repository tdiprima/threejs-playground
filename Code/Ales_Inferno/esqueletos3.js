import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const loader = new THREE.TextureLoader();
const geometry = new THREE.PlaneGeometry(1, 1);
const width = window.innerWidth / 2;
const height = window.innerHeight / 2;

let scenes = [];
let cameras = [];
// let meshes = [];
let renderers = [];
let controls = [];

for (let i = 0; i < numScenes; i++) {
  // Create the scenes
  scenes.push(new THREE.Scene());

  // Create the cameras
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 10;
  cameras.push(camera);

  // Create the materials, geometries, and meshes
  const image = loader.load(`image${i + 1}.jpg`);
  const material = new THREE.MeshBasicMaterial({ map: image, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0)
  scenes[i].add(mesh);
  // meshes.push(mesh);

  // Create the renderers
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  if (i > 0) {
    renderer.domElement.style.position = 'absolute';
  }
  document.body.appendChild(renderer.domElement);
  renderers.push(renderer);

  // Set up event listeners to control the cameras
  const control = new OrbitControls(cameras[i], renderers[i].domElement);
  // control.addEventListener('change', render);
  controls.push(control);
}

// Position the cameras - no.
// cameras[0].position.set(0, 0, 2);
// cameras[1].position.set(0, 0, -2);
// cameras[2].position.set(2, 0, 0);
// cameras[3].position.set(-2, 0, 0);

// camera1.position.set(0, 0, 5);
// const camera2 = camera1.clone();
// const camera3 = camera1.clone();
// const camera4 = camera1.clone();

// Position the meshes - no.
// meshes[0].position.set(-1, 1, 0);
// meshes[1].position.set(1, 1, 0);
// meshes[2].position.set(-1, -1, 0);
// meshes[3].position.set(1, -1, 0);
// mesh1.position.set(-2, 2, 0);
// mesh2.position.set(2, 2, 0);
// mesh3.position.set(-2, -2, 0);
// mesh4.position.set(2, -2, 0);

// Position the renderers - todo: is it wrong?
renderers[0].domElement.style.left = "0px";
renderers[0].domElement.style.top = "0px";
renderers[1].domElement.style.left = `${width}px`;
renderers[1].domElement.style.top = "0px";
renderers[2].domElement.style.left = "0px";
renderers[2].domElement.style.top = `${height}px`;
renderers[3].domElement.style.left = `${width}px`;
renderers[3].domElement.style.top = `${height}px`;

// todo: events or whatever

function render() {
  for (let i = 0; i < numScenes; i++) {
    renderers[i].render(scenes[i], cameras[i]);
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

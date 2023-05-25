import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;
const loader = new THREE.TextureLoader();

let scenes = [];
let cameras = [];
// let meshes = [];
let controls = [];

// Set up the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

for (let i = 0; i < numScenes; i++) {
  // Set up the four scenes
  const scene = new THREE.Scene();
  scenes.push(scene);

  // Create the cameras
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;
  cameras.push(camera);

  // Add the four images to the scenes
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
        map: loader.load(`image${i + 1}.jpg`),
        side: THREE.DoubleSide
      })
  );
  mesh.position.set(0, 0, 0)
  scene.add(mesh);
  // meshes.push(mesh);

  // Set up the controls for each camera
  const control = new OrbitControls(camera, renderer.domElement);
  control.target.set(mesh.position.x, mesh.position.y, mesh.position.z);
  control.enableZoom = true;
  control.enablePan = true;
  controls.push(control);
}

// Set up the initial camera positions - no.
// cameras[0].position.set(0, 0, 10);
// cameras[1].position.set(0, 0, -10);
// cameras[2].position.set(10, 0, 10);
// cameras[3].position.set(-10, 0, 10); // this is why the image appears slanted or at an angle

// Position the meshes - no. (btw 1's are better)
// meshes[0].position.set(-2, 2, 0);
// meshes[1].position.set(2, 2, 0);
// meshes[2].position.set(-2, -2, 0);
// meshes[3].position.set(2, -2, 0);

// todo: events or whatever

function render() {
  // Add the scenes to the renderer
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

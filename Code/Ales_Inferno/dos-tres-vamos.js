// "Parent scene and cameras.md"
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const numScenes = 4;

// RENDERER
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cameras = [];
let controls = [];
let scenes = [];

for (let i = 0; i < numScenes; i++) {
  // SCENES
  let scene = new THREE.Scene();
  scenes.push(scene);

  // CAMERAS
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  cameras.push(camera);
  camera.position.set(0, 0, 10);

  // CUBES
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
  let cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // CONTROLS
  let control = new OrbitControls(camera, renderer.domElement);
  control.name = `control${i + 1}`;
  controls.push(control);
}

// cameras[0].position.set(0, 0, 10);
// cameras[1].position.set(0, 0, -10);
// cameras[2].position.set(10, 0, 0);
// cameras[3].position.set(-10, 0, 0);

// Initial active camera index
let activeCameraIndex = 0;
let collectiveZoom = false;

function handleZoom(event) {
  if (collectiveZoom) {
    console.log("collective");
    // Zoom all cameras collectively
    cameras.forEach(function (camera) {
      camera.zoom += event.deltaY * 0.001;
    });
  } else {
    console.log("individual");
    let activeControls = controls[activeCameraIndex];
    console.log(activeControls.name)

    activeControls.dollyOut(event.deltaY);
    activeControls.dollyIn(event.deltaX);
  }
}

function render() {
  const width = window.innerWidth / 2;
  const height = window.innerHeight / 2;

  renderer.setScissorTest(true);

  // Top left
  renderer.setViewport(0, 0, width, height);
  renderer.setScissor(0, 0, width, height);
  renderer.render(scenes[0], cameras[0]);

  // Top right
  renderer.setViewport(width, 0, width, height);
  renderer.setScissor(width, 0, width, height);
  renderer.render(scenes[1], cameras[1]);

  // Bottom left
  renderer.setViewport(0, height, width, height);
  renderer.setScissor(0, height, width, height);
  renderer.render(scenes[2], cameras[2]);

  // Bottom right
  renderer.setViewport(width, height, width, height);
  renderer.setScissor(width, height, width, height);
  renderer.render(scenes[3], cameras[3]);
}

(function animLoop() {
  requestAnimationFrame(animLoop);
  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
  }
  render();
})();

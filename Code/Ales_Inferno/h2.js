import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

const geometry = new THREE.PlaneGeometry(1, 1);
const loader = new THREE.TextureLoader();

// Extend the OrbitControls class to emit zoom events
class CustomOrbitControls extends OrbitControls {
  constructor(camera, domElement) {
    super(camera, domElement);
    this.zoomEvent = {type: 'zoom', zoom: this.object.zoom};
  }

  update() {
    const zoomChanged = this.zoomEvent.zoom !== this.object.zoom;

    super.update();

    if (zoomChanged) {
      this.zoomEvent.zoom = this.object.zoom;
      this.dispatchEvent(this.zoomEvent);
    }
  }
}

// Create the first scene
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.z = 1;
const diosa = {antialias: true};
const renderer1 = new THREE.WebGLRenderer(diosa);
// ... Set up renderer, controls, and other necessary configurations for scene1
const canvas1 = document.getElementById('image1');
canvas1.appendChild(renderer1.domElement);

const texture1 = loader.load('image1.jpg');
const material1 = new THREE.MeshBasicMaterial({map: texture1, side: THREE.DoubleSide});
const mesh1 = new THREE.Mesh(geometry, material1);
scene1.add(mesh1);

// Create the second scene
const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.z = 1;
const renderer2 = new THREE.WebGLRenderer(diosa);
// ... Set up renderer, controls, and other necessary configurations for scene2
const canvas2 = document.getElementById('image2');
canvas2.appendChild(renderer2.domElement);

const texture2 = loader.load('image2.jpg');
const material2 = new THREE.MeshBasicMaterial({map: texture2, side: THREE.DoubleSide});
const mesh2 = new THREE.Mesh(geometry, material2);
scene2.add(mesh2);

// Create event system
const eventDispatcher = new THREE.EventDispatcher();

// Create the custom controls for scene1
const controls1 = new CustomOrbitControls(camera1, renderer1.domElement);
controls1.addEventListener('zoom', (event) => {
  console.log("controls1");
  eventDispatcher.dispatchEvent({type: 'scene1zoom', zoom: event.zoom});
});

// Create the custom controls for scene2
const controls2 = new CustomOrbitControls(camera2, renderer2.domElement);
controls2.addEventListener('zoom', (event) => {
  console.log("controls2");
  eventDispatcher.dispatchEvent({type: 'scene2zoom', zoom: event.zoom});
});

// Listen for zoom event on scene1
const onScene1Zoom = (event) => {
  // Adjust the zoom level of camera2 in scene2
  camera2.zoom = event.zoom;
  camera2.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene1zoom', onScene1Zoom);

// Listen for zoom event on scene2
const onScene2Zoom = (event) => {
  // Adjust the zoom level of camera1 in scene1
  camera1.zoom = event.zoom;
  camera1.updateProjectionMatrix();
};
eventDispatcher.addEventListener('scene2zoom', onScene2Zoom);

// Update function for rendering the scenes
function update() {
  controls1.update();
  renderer1.render(scene1, camera1);

  controls2.update();
  renderer2.render(scene2, camera2);

  requestAnimationFrame(update);
}

// Start the rendering loop
update();

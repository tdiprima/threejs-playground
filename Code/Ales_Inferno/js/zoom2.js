// This one seems to be even worse than zoom1
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const imgSrc = "/images/happy.JPG";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement);

let planeGeom = new THREE.PlaneGeometry(3, 3);

let mesh;
let tex = new THREE.TextureLoader().load(imgSrc, (tex) => {
  tex.needsUpdate = true;
  mesh.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
  updateZoom(tex.image.width, tex.image.height);
});

let material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
mesh = new THREE.Mesh(planeGeom, material);
scene.add(mesh);

// Calculate the normalized device coordinates (NDC) from mouse coordinates
function getNormalizedDeviceCoordinates(clientX, clientY) {
  const x = (clientX / window.innerWidth) * 2 - 1;
  const y = -(clientY / window.innerHeight) * 2 + 1;
  return { x, y };
}

// Calculate the world position from NDC coordinates
function getWorldPositionFromNDC(x, y) {
  const vector = new THREE.Vector3(x, y, 0.5);
  vector.unproject(camera);
  const direction = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / direction.z;
  return camera.position.clone().add(direction.multiplyScalar(distance));
}

// Update the camera's position to zoom towards the given world position
function zoomToPosition(position) {
  if (position) {
    const zoomFactor = 0.1; // Adjust this value to control the zoom speed
    const currentPosition = camera.position.clone();
    const targetPosition = position.clone();
    currentPosition.lerp(targetPosition, zoomFactor);
    camera.position.copy(currentPosition);
  }
}

// Update the zoom behavior when the image size changes
function updateZoom(imageWidth, imageHeight) {
  const aspect = imageWidth / imageHeight;
  const fovY = THREE.MathUtils.degToRad(camera.fov);
  const planeHeight = Math.tan(fovY / 2) * Math.abs(camera.position.z) * 2;
  const planeWidth = planeHeight * aspect;
  planeGeom = new THREE.PlaneGeometry(planeWidth, planeHeight);
  mesh.geometry = planeGeom;
}

// Listen for the wheel event and zoom towards the mouse position
renderer.domElement.addEventListener("wheel", (event) => {
  const mousePosition = getNormalizedDeviceCoordinates(event.clientX, event.clientY);
  const worldPosition = getWorldPositionFromNDC(mousePosition.x, mousePosition.y);
  zoomToPosition(worldPosition);
});

(function animate() {
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
})();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);


// Calculate zooming manually
// TODO: There are 2 ways; see below.
import * as THREE from "three";
import {OrbitControls} from "three/examples/controls/OrbitControls.js";

const imgSrc = "/images/happy.JPG";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement);

const texture = new THREE.TextureLoader().load(imgSrc);
const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Calculate the world position from UV coordinates
function getWorldPositionA(u, v) {
  const planeNormal = new THREE.Vector3(0, 0, 1);
  const planePoint = new THREE.Vector3(0, 0, 0);
  const raycaster = new THREE.Raycaster();

  const origin = new THREE.Vector3(u, v, -1).unproject(camera);
  const direction = origin.clone().sub(camera.position).normalize();

  raycaster.set(origin, direction);
  const intersects = raycaster.intersectObject(mesh);

  if (intersects.length > 0) {
    const intersectionPoint = intersects[0].point;
    const distance = intersectionPoint.distanceTo(planePoint);
    const directionVector = new THREE.Vector3().subVectors(intersectionPoint, camera.position).normalize();
    return camera.position.clone().addScaledVector(directionVector, distance);
  }

  return null;
}

// Calculate the world position from normalized device coordinates
function getWorldPositionB(clientX, clientY) {
  const mouse = new THREE.Vector2();
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(mesh);
  if (intersects.length > 0) {
    return intersects[0].point;
  }

  return null;
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

// Listen for the wheel event and zoom towards the mouse position
renderer.domElement.addEventListener("wheel", (event) => {
  // todo: A:
  // const mousePosition = new THREE.Vector2(event.clientX / window.innerWidth, event.clientY / window.innerHeight);
  // const worldPosition = getWorldPositionA(mousePosition.x, mousePosition.y);
  // todo: B:
  const mousePosition = new THREE.Vector2(event.clientX, event.clientY);
  const worldPosition = getWorldPositionB(mousePosition.x, mousePosition.y);
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

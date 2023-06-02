// Use plugin
// npm install --save three
// npm install --save-dev three.js-focus-point
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FocusPoint } from "three.js-focus-point";

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

  // Create and attach the FocusPoint instance to the mesh
  const focusPoint = new FocusPoint(mesh);
  focusPoint.enableZoom = true;

  // Update the focus point whenever the mouse moves over the mesh
  renderer.domElement.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    focusPoint.update(x, y);
  });
});

let material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
mesh = new THREE.Mesh(planeGeom, material);
scene.add(mesh);

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

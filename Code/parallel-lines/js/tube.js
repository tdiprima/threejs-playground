let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// line material
let lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Make sure these values are appropriate for your scene and camera setup.
// Adjust them to ensure that the tube geometry is visible within the camera's frustum.
let RADI = 1;
// let RADI = 0.1;
let t = 0;

let linePoints = [];
// The CatmullRomCurve3 constructor requires an array of points to define the curve, so:
for (let i = 0; i < 20; i++) {
  let vector = new THREE.Vector3(
    RADI * Math.cos(t + i),
    RADI * Math.sin(t + i),
    3 * (t + i)
  );
  linePoints.push(vector);
}

// Supposing you only had these 2 points:
// let startVector = new THREE.Vector3(RADI * Math.cos(t), RADI * Math.sin(t), 3 * t);
// let endVector = new THREE.Vector3(RADI * Math.cos(t + 10), RADI * Math.sin(t + 10), 3 * t);
// let linePoints = [];
// linePoints.push(startVector, endVector);

// Create Tube Geometry
let tubeGeometry = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3(linePoints),
  512, // path segments
  0.5, // THICKNESS
  8, // Roundness of Tube
  false // closed
);

let line = new THREE.Line(tubeGeometry, lineMaterial);
scene.add(line);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();

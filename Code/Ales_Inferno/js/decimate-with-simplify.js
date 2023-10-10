// TODO: TL;DR - simplify sux.
// <script src="/js/simplify.js"></script>
// Original points array length: 294, new length: 254 :p
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let points = []; // TODO: POINTS
let len = points.length;
console.log("original length:", len);

reducePoints(points, scene);

camera.position.z = 10;

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();

function reducePoints(points, scene) {
  // CONVERT THE ARRAY
  let geometry = new THREE.BufferGeometry();

  // Convert array of points to Float32Array
  let positions = new Float32Array(points.length);
  for (let i = 0; i < points.length; i++) {
    positions[i] = points[i];
  }
  // console.log("positions", positions.length);

  // CREATE LINE.
  let positionAttribute = new THREE.BufferAttribute(positions, 3);
  geometry.setAttribute('position', positionAttribute);

  // Create THREE.Line* object using the geometry and a material
  let material = new THREE.LineBasicMaterial({color: 0x00ff00});
  // let line = new THREE.LineSegments(geometry, material);
  let line = new THREE.Line(geometry, material);
  scene.add(line);

  // CREATE ARRAYS IN CORRECT FORMAT FOR SIMPLIFICATION
  let simpArray = [];

  for (let i = 0, j = 0; i < points.length; i++, j += 3) {
    // Convert points to {x: Number, y: Number}
    let simpObject = {};
    simpObject.x = points[i];
    simpObject.y = points[i + 1];
    simpArray.push(simpObject);
  }
  // console.log("simpArray", simpArray);

  let tolerance = 5;
  // NOW, USE SIMPLIFY:
  let simplifiedPoints = simplify(simpArray, tolerance, true);
  let len1 = simplifiedPoints.length;
  console.log("new length:", len1);

  let info = document.getElementById("info");
  info.innerHTML = `Original points array length: ${len}, new length: ${len1}`;
}

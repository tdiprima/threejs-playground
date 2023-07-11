import * as THREE from "three";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, 500 / 400, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x041122));
renderer.setSize(825, 600);
document.body.appendChild(renderer.domElement);

class CustomSinCurve extends THREE.Curve {
  // https://threejs.org/docs/#api/en/geometries/TubeGeometry

  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t, optionalTarget = new THREE.Vector3()) {
    let tx = t * 3 - 1.5;
    let ty = Math.sin(2 * Math.PI * t);
    let tz = 0;

    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

// Create a custom curve for the line
// let curve = new THREE.LineCurve3(
//   new THREE.Vector3(-2, 0, 0), // Start point
//   new THREE.Vector3(2, 0, 0) // End point
// );

// https://stackoverflow.com/questions/11638883/thickness-of-lines-using-three-linebasicmaterial
let curve = new CustomSinCurve(10);

// Create a tube geometry with the custom curve
let segments = 20;
let thickness = 0.5;
let radiusSegments = 8;
let tubeGeometry = new THREE.TubeBufferGeometry(curve, segments, thickness, radiusSegments);

// Create a material for the tube
let material = new THREE.MeshBasicMaterial({color: 0x00ff00});

// Create the mesh using the tube geometry and material
let tubeMesh = new THREE.Mesh(tubeGeometry, material);

// Add the tube mesh to the scene
scene.add(tubeMesh);

// default camera pos
camera.position.z = 100;

// renders the scene
let render = function () {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};

render();

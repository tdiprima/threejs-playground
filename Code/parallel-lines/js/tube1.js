// The line flashed for a second on the 2nd stroke.
let imageSource = "/images/image1.jpg";
let isDrawing = true;
let mouseIsPressed = false;
let positions = []; // Set up arrays to hold line data

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let loader = new THREE.TextureLoader();
let planeGeom = new THREE.PlaneGeometry(10, 10);
let texture = loader.load(imageSource);
let material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide
});
let mesh = new THREE.Mesh(planeGeom, material);
scene.add(mesh);

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

let tubeMaterial = new THREE.MeshBasicMaterial({ color: "#0000ff" });
let tubeGeometry;
let tubeMesh;
let tubePath;

renderer.domElement.addEventListener('pointerdown', event => {
  if (isDrawing) {
    mouseIsPressed = true;
    // Create a new TubeBufferGeometry for each line
    tubePath = new THREE.CatmullRomCurve3(positions);
    tubeGeometry = new THREE.TubeBufferGeometry(tubePath, 100, 0.1, 8, false);
    tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tubeMesh);
  }
});

function onMouseMove(event) {
  if (isDrawing && mouseIsPressed) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Use raycaster to get intersection point with scene
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      let point = intersects[0].point;
      positions.push(point);

      // Update the position attribute of the TubeBufferGeometry
      tubeGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions.flatMap(p => [p.x, p.y, p.z])), 3));

      // Set needsUpdate to true for the position attribute
      tubeGeometry.attributes.position.needsUpdate = true;
      tubeGeometry.computeBoundingSphere();
    }
  }
}

function onMouseUp() {
  if (isDrawing) {
    mouseIsPressed = false;
    // Compute the TubeBufferGeometry's bounding sphere
    tubeGeometry.computeBoundingSphere();
    // positions = []; // todo: uncomment
  }
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

renderer.domElement.addEventListener('mousemove', onMouseMove);
renderer.domElement.addEventListener('mouseup', onMouseUp);
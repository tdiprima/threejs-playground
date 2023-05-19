// Create the four scenes and cameras
const scene1 = new THREE.Scene();
const camera1 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera1.position.z = 5;

const scene2 = new THREE.Scene();
const camera2 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera2.position.x = 5;

const scene3 = new THREE.Scene();
const camera3 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera3.position.y = 5;

const scene4 = new THREE.Scene();
const camera4 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera4.position.set(-5, 0, 5);

// Add the scenes to a parent scene
const parentScene = new THREE.Scene();
parentScene.add(scene1);
parentScene.add(scene2);
parentScene.add(scene3);
parentScene.add(scene4);

// Create a target object to control the camera
const target = new THREE.Object3D();
parentScene.add(target);

// Create the four controls
const controls1 = new THREE.OrbitControls(camera1, renderer.domElement);
controls1.target = target;

const controls2 = new THREE.OrbitControls(camera2, renderer.domElement);
controls2.target = target;

const controls3 = new THREE.OrbitControls(camera3, renderer.domElement);
controls3.target = target;

const controls4 = new THREE.OrbitControls(camera4, renderer.domElement);
controls4.target = target;

// Set up event listeners to control the cameras
let selectedCamera = null;

function onDocumentMouseDown(event) {
  if (event.button === 0) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (mouseX < window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = camera1;
    } else if (mouseX >= window.innerWidth / 2 && mouseY < window.innerHeight / 2) {
      selectedCamera = camera2;
    } else if (mouseX < window.innerWidth / 2 && mouseY >= window.innerHeight / 2) {
      selectedCamera = camera3;
    } else {
      selectedCamera = camera4;
    }
  }
}

controls4.addEventListener('start', () => {
  selectedCamera = camera4;
});

function onDocumentMouseUp(event) {
  selectedCamera = null;
}

function onDocumentMouseMove(event) {
  event.preventDefault();

  if (selectedCamera) {
    // Retrieve the movement distance of the mouse in the horizontal (X) and vertical (Y) directions
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    // Calculate the rotation angles based on the mouse movement and the window size
    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    // Rotate the selected camera
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta); // around the world Y-axis (0, 1, 0) by the horizontal angle (theta)
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi); // around the world X-axis (1, 0, 0) by the vertical angle (phi)
  }
}

function onWindowResize() {
  parentCamera.aspect = window.innerWidth / window.innerHeight;
  parentCamera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add the four images to the scenes
const loader = new THREE.TextureLoader();

const image1 = loader.load('image1.jpg');
const material1 = new THREE.MeshBasicMaterial({ map: image1 })
const mesh1 = new THREE.Mesh(geometry, material1);
mesh1.position.set(-2, 2, 0);

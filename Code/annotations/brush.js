// todo: this is NOT what we want, so simply fixing it isn't really ideal.
let scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x333333, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a brush (It's actually a green dot that doesn't move.)
let brushSize = 0.2; // Size of the brush
let brushColor = new THREE.Color(0x00ff00); // Brush color
let brushOpacity = 0.4; // Brush opacity
let brushGeometry = new THREE.CircleGeometry(brushSize, 32);
let brushMaterial = new THREE.MeshBasicMaterial({ color: brushColor, transparent: true, opacity: brushOpacity });
let brushMesh = new THREE.Mesh(brushGeometry, brushMaterial);
scene.add(brushMesh);

// Create a canvas texture for painting
let canvas = document.createElement("canvas");
canvas.width = canvas.height = 512; // Size of the canvas texture

let context = canvas.getContext("2d");
context.fillStyle = "rgba(0, 0, 0, 0)"; // Set initial fill color to transparent
context.fillRect(0, 0, canvas.width, canvas.height);

let texture = new THREE.CanvasTexture(canvas);

// Create a plane to display the painted texture
let planeGeometry = new THREE.PlaneGeometry(7, 7);
let planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// Handle mouse events
let isPainting = false;
renderer.domElement.addEventListener("mousedown", onMouseDown, false);
renderer.domElement.addEventListener("mousemove", onMouseMove, false);
renderer.domElement.addEventListener("mouseup", onMouseUp, false);

function onMouseDown(event) {
  event.preventDefault();
  isPainting = true;
  paint(event.clientX, event.clientY);
}

function onMouseMove(event) {
  event.preventDefault();
  if (isPainting) {
    paint(event.clientX, event.clientY);
  }
}

function onMouseUp(event) {
  event.preventDefault();
  isPainting = false;
}

function paint(clientX, clientY) {
  let rect = renderer.domElement.getBoundingClientRect();
  let x = ((clientX - rect.left) / rect.width) * canvas.width;
  let y = ((clientY - rect.top) / rect.height) * canvas.height;

  context.beginPath();
  context.arc(x, y, brushSize, 0, Math.PI * 2, false);
  context.closePath();
  context.fillStyle = `rgba(${brushColor.r * 255}, ${brushColor.g * 255}, ${brushColor.b * 255}, ${brushOpacity})`;
  context.fill();

  texture.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

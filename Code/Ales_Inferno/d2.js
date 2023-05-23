// create four instances of the WebGLRenderer
const renderer1 = new THREE.WebGLRenderer();
const renderer2 = new THREE.WebGLRenderer();
const renderer3 = new THREE.WebGLRenderer();
const renderer4 = new THREE.WebGLRenderer();

let canvas1 = document.getElementById('image1');
let canvas2 = document.getElementById('image2');
let canvas3 = document.getElementById('image3');
let canvas4 = document.getElementById('image4');

// add the renderer's DOM element to four HTML elements
canvas1.appendChild(renderer1.domElement);
canvas2.appendChild(renderer2.domElement);
canvas3.appendChild(renderer3.domElement);
canvas4.appendChild(renderer4.domElement);

// create four instances of the Scene
const scene1 = new THREE.Scene();
const scene2 = new THREE.Scene();
const scene3 = new THREE.Scene();
const scene4 = new THREE.Scene();

// load your images as textures
const texture1 = new THREE.TextureLoader().load('image1.jpg');
const texture2 = new THREE.TextureLoader().load('image2.jpg');
const texture3 = new THREE.TextureLoader().load('image3.jpg');
const texture4 = new THREE.TextureLoader().load('image4.jpg');

// create four instances of the Mesh, using your textures
const geometry = new THREE.PlaneGeometry(1, 1);
const material1 = new THREE.MeshBasicMaterial({map: texture1});
const material2 = new THREE.MeshBasicMaterial({map: texture2});
const material3 = new THREE.MeshBasicMaterial({map: texture3});
const material4 = new THREE.MeshBasicMaterial({map: texture4});

const mesh1 = new THREE.Mesh(geometry, material1);
const mesh2 = new THREE.Mesh(geometry, material2);
const mesh3 = new THREE.Mesh(geometry, material3);
const mesh4 = new THREE.Mesh(geometry, material4);

// set the position and scale of the mesh so that it fits within the canvas for this image
// mesh1.position.set(-0.5, 0.5, 0);
// mesh1.scale.set(0.5, 0.5, 1);
mesh1.position.set(-1, 1, 0);
mesh1.position.set(1, 1, 0);
mesh3.position.set(-1, -1, 0);
mesh4.position.set(1, -1, 0);

// create a group object and add all four image meshes to it
// they end up in lower right quadrant
const group = new THREE.Group();
group.add(mesh1);
group.add(mesh2);
group.add(mesh3);
group.add(mesh4);

// todo: if I comment that out and put this, they end up in their own square, but then I lose the "group"
// scene1.add(mesh1);
// scene2.add(mesh2);
// scene3.add(mesh3);
// scene4.add(mesh4);

// create a camera and position it to view the group object
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.z = 5;
// camera.lookAt(group.position);

const aspectRatio = window.innerWidth / window.innerHeight;
const camera1 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const camera2 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const camera3 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const camera4 = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);

camera1.position.z = 5;
camera2.position.z = 5;
camera3.position.z = 5;
camera4.position.z = 5;

// add the group object to all four scenes
scene1.add(group);
scene2.add(group);
scene3.add(group);
scene4.add(group);

// render the scenes
function render() {
  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  renderer3.render(scene3, camera3);
  renderer4.render(scene4, camera4);
}

// update the position and zoom of the group object on hover
function onHover(event) {
  // calculate the position of the mouse on the screen
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // use the Raycaster to detect which image the mouse is hovering over
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera1); // TODO: need a "selected camera"

  const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3, mesh4]);
  if (intersects.length > 0) {
    // update the position and zoom of the group object based on the mouse position
    const offset = intersects[0].point.clone().sub(group.position);
    group.position.add(offset.multiplyScalar(-0.1));
    group.scale.setScalar(1 + intersects[0].distance * 0.1);
  }
}

// add the onHover function as a listener for the mousemove event
document.addEventListener('mousemove', onHover);

// call the render function in a loop to update the scenes
function animate() {
  requestAnimationFrame(animate);
  render();
}

animate();

window.addEventListener('resize', () => {
  let width = canvas1.clientWidth;
  let height = canvas1.clientHeight;
  camera1.aspect = width / height;
  camera1.updateProjectionMatrix();
  renderer1.setSize(width, height);
  // Repeat this code for each camera and renderer.

  width = canvas2.clientWidth;
  height = canvas2.clientHeight;
  camera2.aspect = width / height;
  camera2.updateProjectionMatrix();
  renderer2.setSize(width, height);

  width = canvas3.clientWidth;
  height = canvas3.clientHeight;
  camera3.aspect = width / height;
  camera3.updateProjectionMatrix();
  renderer3.setSize(width, height);

  width = canvas4.clientWidth;
  height = canvas4.clientHeight;
  camera4.aspect = width / height;
  camera4.updateProjectionMatrix();
  renderer4.setSize(width, height);
});

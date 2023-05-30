## Detach/Reattach Orbit Controls

To disconnect and reconnect the two `OrbitControls`, you can add a toggle button that changes the behavior of the controls. Here's an updated version of your code with the detach and reattach functionality:

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let RENDER_WIDTH = window.innerWidth / 2;
let RENDER_HEIGHT = window.innerHeight / 2;
let ASPECT = RENDER_WIDTH / RENDER_HEIGHT;
const numScenes = 2;
const geometry = new THREE.PlaneGeometry(1, 1);
const loader = new THREE.TextureLoader();
let scenes = [];
let cameras = [];
let renderers = [];
let controls = [];
let colors = ["#2b2b2b", "#484848"];
let detachControls = false; // Flag to toggle controls detachment

for (let i = 0; i < numScenes; i++) {
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[i]);
  scenes.push(scene);

  let camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  camera.position.z = 2;
  cameras.push(camera);

  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT);
  document.getElementById(`image${i + 1}`).appendChild(renderer.domElement);
  renderers.push(renderer);

  let texture = new THREE.TextureLoader().load(`image${i + 1}.jpg`);
  let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  let geometry = new THREE.PlaneGeometry(3, 2);
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let control = new OrbitControls(camera, renderer.domElement);
  if (i === 0) {
    control.addEventListener("change", onControlsChange1);
  } else {
    control.addEventListener("change", onControlsChange2);
  }
  controls.push(control);
}

function onControlsChange1() {
  if (detachControls) return;

  cameras[1].copy(cameras[0]);
  cameras[1].updateProjectionMatrix();
}

function onControlsChange2() {
  if (detachControls) return;

  cameras[0].copy(cameras[1]);
  cameras[0].updateProjectionMatrix();
}

function update() {
  for (let i = 0; i < numScenes; i++) {
    controls[i].update();
    renderers[i].render(scenes[i], cameras[i]);
  }
  requestAnimationFrame(update);
}

// Function to detach or reattach controls based on the 'detachControls' flag
function toggleControlsDetachment() {
  detachControls = !detachControls;
  if (detachControls) {
    controls[0].enabled = false;
    controls[1].enabled = false;
  } else {
    controls[0].enabled = true;
    controls[1].enabled = true;
  }
}

// Toggle button click event listener
document.getElementById("toggleButton").addEventListener("click", toggleControlsDetachment);

update();
```

In this updated code, we added a `detachControls` variable to act as a flag to determine whether the controls should be detached or not. We also introduced a `toggleControlsDetachment` function that toggles the `detachControls` flag and enables or disables the controls accordingly.

To use the detach functionality, you can add an HTML button element with the id "toggleButton" to your webpage. When the button is clicked, the `toggleControlsDetachment` function is called, which will detach or reattach the controls based on the

 current state of the `detachControls` flag.

Note that when the controls are detached, they won't respond to any changes, such as panning, zooming, or rotating. When you reattach them, they will continue following each other's movements as before.

## Una

I understand your requirement. If you want to retain the ability to control the detached control while the other control remains static, you can modify the code to selectively disable the controls based on the `detachControls` flag. Here's an updated version of the code that allows you to control the active control even when detached:

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let RENDER_WIDTH = window.innerWidth / 2;
let RENDER_HEIGHT = window.innerHeight / 2;
let ASPECT = RENDER_WIDTH / RENDER_HEIGHT;
const numScenes = 2;
const geometry = new THREE.PlaneGeometry(1, 1);
const loader = new THREE.TextureLoader();
let scenes = [];
let cameras = [];
let renderers = [];
let controls = [];
let colors = ["#2b2b2b", "#484848"];
let activeControlIndex = 0; // Index of the currently active control
let detachControls = false; // Flag to toggle controls detachment

for (let i = 0; i < numScenes; i++) {
  let scene = new THREE.Scene();
  scene.background = new THREE.Color(colors[i]);
  scenes.push(scene);

  let camera = new THREE.PerspectiveCamera(75, ASPECT, 0.1, 1000);
  camera.position.z = 2;
  cameras.push(camera);

  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT);
  document.getElementById(`image${i + 1}`).appendChild(renderer.domElement);
  renderers.push(renderer);

  let texture = new THREE.TextureLoader().load(`image${i + 1}.jpg`);
  let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  let geometry = new THREE.PlaneGeometry(3, 2);
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let control = new OrbitControls(camera, renderer.domElement);
  control.addEventListener("change", onControlsChange);
  controls.push(control);
}

function onControlsChange() {
  if (detachControls) {
    cameras[1 - activeControlIndex].copy(cameras[activeControlIndex]);
    cameras[1 - activeControlIndex].updateProjectionMatrix();
  }
}

function update() {
  controls.forEach((control, index) => {
    if (index !== activeControlIndex || !detachControls) {
      control.update();
    }
    renderers[index].render(scenes[index], cameras[index]);
  });
  requestAnimationFrame(update);
}

// Function to detach or reattach controls based on the 'detachControls' flag
function toggleControlsDetachment() {
  detachControls = !detachControls;
  if (detachControls) {
    controls.forEach((control, index) => {
      control.enabled = (index === activeControlIndex);
    });
  } else {
    controls.forEach((control) => {
      control.enabled = true;
    });
  }
}

// Function to switch the active control
function switchActiveControl(index) {
  activeControlIndex = index;
  controls.forEach((control, i) => {
    control.enabled = (i === activeControlIndex) || !detachControls;
  });
}

// Toggle button click event listener
document.getElementById("toggleButton").addEventListener("click", toggleControlsDetachment);

// Control switch button click event listeners
document.getElementById("control1Button").addEventListener("click", () => {
  switchActiveControl(0);
});
document.getElementById("control2Button").addEventListener("click", () => {
  switchActiveControl(1);
});

update();
```

In this updated code, I added an `activeControlIndex` variable

to keep track of the currently active control. The `switchActiveControl` function allows you to switch between controls by updating the `activeControlIndex` and enabling the corresponding control while disabling the other control.

When the controls are detached (`detachControls` is `true`), each control's `enabled` property is set based on whether it is the active control or not. Only the active control is enabled, allowing you to control it while the other control remains static.

You can add two HTML buttons with ids "control1Button" and "control2Button" to switch between controls. When clicked, the corresponding control is activated, allowing you to interact with it. The toggle button (`toggleButton`) can be used to detach or reattach the controls.

Now you can control the active control even when the controls are detached, and the other control will remain static.

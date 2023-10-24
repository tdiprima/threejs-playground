## Create Dynamic Scale Bar

[Scaling PlaneGeometry starts from the center not left](https://discourse.threejs.org/t/scaling-planegeometry-starts-from-the-center-not-left/1026)

Right now, there isn't a built-in feature in the three.js library to create a scale bar dynamically.

However, it is entirely possible to create a dynamic scale bar yourself:

### 1. **Create Scale Bar as a Mesh:**
First, create a scale bar as a Three.js mesh (like a `THREE.PlaneGeometry` or `THREE.BoxGeometry`) and add it to your scene.

### 2. **Position Scale Bar:**
Position the scale bar mesh in the lower-left corner of your camera's viewport. You might need to constantly adjust its position relative to the camera, especially if you are using a perspective camera.

### 3. **Update Scale Bar Size:**
You would need to dynamically adjust the scale bar's size based on the camera's zoom level or distance from the object. To do this, you would listen for changes to the camera's `zoom` or `position` properties and update the scale bar's `scale` property accordingly.

### 4. **Add Text Labels:**
You might also want to add text labels to indicate the scale. This might be a bit trickier but can be achieved using the `THREE.TextGeometry` class or using HTML elements positioned over the canvas.

### A general pseudocode outline:

```javascript
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/renderers/CSS2DRenderer.js';
console.info({ CSS2DRenderer, CSS2DObject });

// Create scale bar mesh
let scaleBarGeometry = new THREE.PlaneGeometry(1, 0.1);
let scaleBarMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff
});

let scaleBar = new THREE.Mesh(scaleBarGeometry, scaleBarMaterial);
scaleBar.position.set(-2, -2, 0); // Set initial position of the scale bar
scene.add(scaleBar);

// Create a label for the scale bar
let labelDiv = document.createElement('div');
labelDiv.className = 'label';
labelDiv.textContent = 'Scale: ';
labelDiv.style.marginTop = '-1em';
let label = new CSS2DObject(labelDiv);
label.position.set(0, 0.1, 0); // Set position of label above the scale bar
scaleBar.add(label);

let labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

function calculateScale(zoom) {
  // This function should return a scale value based on the camera's zoom
  // Here's a simple example that inversely scales the bar with the camera's zoom
  return 1 / zoom;
}

function update() {
  // Update scale bar position relative to the camera
  let vector = new THREE.Vector3(-0.95, -0.95, -1);
  vector.unproject(camera);
  scaleBar.position.copy(vector);

  // Update scale bar size based on camera zoom
  let scale = calculateScale(camera.zoom);
  scaleBar.scale.set(scale, 1, 1);

  // Update text labels
  labelDiv.textContent = `Scale: ${(1 / scale).toFixed(2)}`;
}
```

### Notes:
- The `calculateScale` function needs to be defined based on how you want to calculate the scale. This might involve some trial and error or math based on your camera setup and scene dimensions.
- You might need to convert world units to screen units or vice versa, depending on your implementation.
- Adjusting the size and position of the scale bar mesh can be tricky, so you may need to experiment and adjust the calculations to fit your specific scene and camera setup.

### Conclusion:
While the pseudo-code and steps provided should guide you in the right direction, you need to make adjustments according to your requirements. For precise steps, I would recommend referring to the three.js documentation and other resources that are current as of your asking. The community forums and discussions related to three.js might provide more specific solutions and examples as well.

<br>

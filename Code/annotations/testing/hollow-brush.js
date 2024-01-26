import * as THREE from "/build/three.module.js";

export function hollowBrush(scene, camera, renderer) {
  let points = []; // Array to store the points of the line
  let drawing = false; // Flag to check if drawing is active
  let raycaster = new THREE.Raycaster();

  // Function to convert mouse coordinates to Three.js coordinates using raycasting
  function getMousePos(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector2(mouseX, mouseY);
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].object instanceof THREE.Mesh) {
        return intersects[i].point;
      }
    }
    return null;
  }

  // Function to start drawing
  function startDrawing(event) {
    drawing = true;
    points = [];
    const mousePos = getMousePos(event);
    if (mousePos === null) return;
    points.push(new THREE.Vector3(mousePos.x, mousePos.y, 0)); // Start point
  }

  // Function to update the line while drawing
  function updateDrawing(event) {
    if (!drawing) return;
    const mousePos = getMousePos(event);
    if (mousePos === null) return;
    points.push(new THREE.Vector3(mousePos.x, mousePos.y, 0)); // Add new point
    updateLineLoop();
  }

  // Function to stop drawing
  function stopDrawing() {
    drawing = false;
  }

  // Function to update or create the line loop
  function updateLineLoop() {
    if (lineLoop) scene.remove(lineLoop); // Remove old line loop if it exists
    const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
    lineLoop = new THREE.LineLoop(lineGeom, new THREE.LineBasicMaterial({ color: 0xff0000 }));
    scene.add(lineLoop);
  }

  let lineLoop; // Global variable to store the line loop

  // Add event listeners for mouse events
  renderer.domElement.addEventListener('mousedown', startDrawing);
  renderer.domElement.addEventListener('mousemove', updateDrawing);
  window.addEventListener('mouseup', stopDrawing);
}

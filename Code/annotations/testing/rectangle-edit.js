import * as THREE from 'three';
import { createButton, textInputPopup, deleteIcon } from "../helpers/elements.js";
import { getMousePosition } from "../helpers/mouse.js";

export function rectangle(scene, camera, renderer, controls) {
  let rectangleButton = createButton({
    id: "rectangle",
    innerHtml: "<i class=\"fa-regular fa-square\"></i>",
    title: "rectangle"
  });

  rectangleButton.addEventListener("click", function () {
    if (isDrawing) {
      isDrawing = false;
      controls.enabled = true;
      this.classList.replace('btnOn', 'annotationBtn');
      canvas.removeEventListener("mousedown", onMouseDown, false);
      canvas.removeEventListener("mousemove", onMouseMove, false);
      canvas.removeEventListener("mouseup", onMouseUp, false);
    } else {
      isDrawing = true;
      controls.enabled = false;
      this.classList.replace('annotationBtn', 'btnOn');
      canvas.addEventListener("mousedown", onMouseDown, false);
      canvas.addEventListener("mousemove", onMouseMove, false);
      canvas.addEventListener("mouseup", onMouseUp, false);
    }
  });

  const canvas = renderer.domElement;
  let material = new THREE.LineBasicMaterial({color: 0x0000ff});
  let isDrawing = false;
  let mouseIsPressed = false;
  let startPoint;
  let endPoint;
  let currentRectangle;
  let draggingHandle = false; // The flag indicating if a handle is being dragged
  let selectedHandle = null;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let dragPlane = new THREE.PlaneGeometry(1000, 1000); // Adjust size as needed
  let dragPlaneMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0.25,
    transparent: true,
    visible: false
  }); // Make invisible
  dragPlane = new THREE.Mesh(dragPlane, dragPlaneMaterial);
  scene.add(dragPlane);

  function onMouseDown(event) {
    event.preventDefault();
    if (isDrawing) {
      mouseIsPressed = true;
      startPoint = getMousePosition(event.clientX, event.clientY, canvas, camera);
      currentRectangle = createRectangle();
    } else {
      // Adjust mouse coordinates for raycasting
      mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

      // Perform raycasting to check if a handle is clicked
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0 && intersects[0].object.userData.isHandle) {
        controls.enabled = false; // Disable any controls to allow dragging
        draggingHandle = true; // Set the flag here
        selectedHandle = intersects[0].object;

        // Adjust the dragPlane position to align with the selected handle
        dragPlane.position.copy(selectedHandle.position);
        dragPlane.lookAt(camera.position); // Ensure the plane is facing the camera
      }
    }
  }

  function onMouseMove(event) {
    if (draggingHandle && selectedHandle) {
      console.log("here"); // TODO?
      event.preventDefault();

      if (!draggingHandle) return;

      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Assuming there's a "dragPlane" in the scene that represents the plane you're dragging the handles on
      const intersects = raycaster.intersectObject(dragPlane);

      if (intersects.length > 0 && draggingHandle) {
        const point = intersects[0].point;
        selectedHandle.position.copy(point);
        updateVertexPosition(selectedHandle); // Update the geometry of the rectangle
      }
    } else if (isDrawing && mouseIsPressed) {
      endPoint = getMousePosition(event.clientX, event.clientY, canvas, camera);
      updateRectangle();
    }
  }

  function onMouseUp(event) {
    if (draggingHandle && selectedHandle) {
      // Update the rectangle's vertex corresponding to the handle's new position
      updateVertexPosition(selectedHandle);
      draggingHandle = false;
      selectedHandle = null;
      controls.enabled = true; // Re-enable any controls we disabled on mousedown
    } else if (isDrawing) {
      // Finalize the rectangle drawing
      mouseIsPressed = false;
      endPoint = getMousePosition(event.clientX, event.clientY, canvas, camera);
      updateRectangle();
      // deleteIcon(event, currentRectangle, scene);
      textInputPopup(event, currentRectangle);
      addEditHandles(currentRectangle);
      // console.log("currentRectangle:", currentRectangle);
    }
  }

  function createRectangle() {
    let geometry = new THREE.BufferGeometry(); // our 3D object
    let vertices = new Float32Array(12); // 4 vertices
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); // each vertex is composed of 3 values

    // LineLoop: A continuous line that connects back to the start.
    let rect = new THREE.LineLoop(geometry, material);
    rect.renderOrder = 999;
    rect.name = "rectangle annotation";
    scene.add(rect);

    return rect;
  }

  function updateRectangle() {
    if (!currentRectangle) return
    let positions = currentRectangle.geometry.attributes.position.array;
    positions[0] = startPoint.x;
    positions[1] = startPoint.y;
    positions[2] = startPoint.z;
    positions[3] = endPoint.x;
    positions[4] = startPoint.y;
    positions[5] = startPoint.z;
    positions[6] = endPoint.x;
    positions[7] = endPoint.y;
    positions[8] = startPoint.z;
    positions[9] = startPoint.x;
    positions[10] = endPoint.y;
    positions[11] = startPoint.z;
    currentRectangle.geometry.attributes.position.needsUpdate = true;
  }

  function addEditHandles(rectangle) {
    // Access the position attribute of the geometry
    const positions = rectangle.geometry.attributes.position;
    const vertices = positions.array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];

      const handleGeometry = new THREE.SphereGeometry(25, 32, 32); // Adjust size as needed
      const handleMaterial = new THREE.MeshBasicMaterial({color: 0x0000dd});
      const handle = new THREE.Mesh(handleGeometry, handleMaterial);

      // Set the position of the handle
      handle.position.set(x, y, z);

      handle.userData = {isHandle: true, vertexIndex: i / 3, parentRectangle: rectangle};
      scene.add(handle);
    }
  }

  function updateVertexPosition(handle) {
    const vertexIndex = handle.userData.vertexIndex;
    const newPosition = handle.position;
    const parentRectangle = handle.userData.parentRectangle;
    const positions = parentRectangle.geometry.attributes.position;

    positions.array[vertexIndex * 3] = newPosition.x;
    positions.array[vertexIndex * 3 + 1] = newPosition.y;
    positions.array[vertexIndex * 3 + 2] = newPosition.z;

    positions.needsUpdate = true;
  }
}

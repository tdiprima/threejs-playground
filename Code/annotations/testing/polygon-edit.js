// It sorta works (you can move vertices), but I can't make multiple polygons.
import * as THREE from 'three';
import { createButton, textInputPopup } from "../helpers/elements.js";
import { getMousePosition } from "../helpers/mouse.js";

export function polygon(scene, camera, renderer, controls) {
  let polygonButton = createButton({
    id: "polygon",
    innerHtml: "<i class=\"fa-solid fa-draw-polygon\"></i>",
    title: "polygon"
  });

  polygonButton.addEventListener("click", function () {
    if (isDrawing) {
      isDrawing = false;
      controls.enabled = true;
      this.classList.replace('btnOn', 'annotationBtn');
      canvas.removeEventListener("mousedown", onMouseDown, false);
      canvas.removeEventListener("mousemove", onMouseMove, false);
      canvas.removeEventListener("mouseup", onMouseUp, false);
      canvas.removeEventListener("dblclick", onDoubleClick, false);
    } else {
      isDrawing = true;
      controls.enabled = false;
      this.classList.replace('annotationBtn', 'btnOn');
      canvas.addEventListener("mousedown", onMouseDown, false);
      canvas.addEventListener("mousemove", onMouseMove, false);
      canvas.addEventListener("mouseup", onMouseUp, false);
      canvas.addEventListener("dblclick", onDoubleClick, false);
    }
  });

  const canvas = renderer.domElement;
  let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
  let isDrawing = false;
  let mouseIsPressed = false;
  let points = [];
  let currentPolygon = null;
  let draggingVertexIndex = null; // Index of the vertex being dragged

  function onMouseMove(event) {
    if (!isDrawing) return;

    // Dragging mode: if a vertex is being dragged, update its position
    if (mouseIsPressed && draggingVertexIndex !== null) {
      const point = getMousePosition(event.clientX, event.clientY, canvas, camera);
      points[draggingVertexIndex] = point; // Update the position of the dragged vertex
      updatePolygon();
    }
    // Drawing mode: update the last point position for new polygon drawing
    else if (mouseIsPressed && draggingVertexIndex === null && points.length > 0) {
      const point = getMousePosition(event.clientX, event.clientY, canvas, camera);
      points[points.length - 1] = point;
      updatePolygon();
    }
  }

  function onMouseDown(event) {
    if (!isDrawing) return;

    const point = getMousePosition(event.clientX, event.clientY, canvas, camera);
    // Check if the click is near an existing vertex for dragging
    const nearVertexIndex = findNearVertex(point, points);
    if (nearVertexIndex !== -1) {
      // Start dragging this vertex
      draggingVertexIndex = nearVertexIndex;
      mouseIsPressed = true;
    }
    // Start a new polygon or add a new vertex if not near an existing vertex
    else if (!mouseIsPressed) {
      mouseIsPressed = true;
      if (draggingVertexIndex === null) {
        points.push(point);
        if (!currentPolygon) {
          currentPolygon = createPolygon();
        }
      }
    }
  }

  function onMouseUp(event) {
    // Finalize dragging or adding a new vertex
    mouseIsPressed = false;
    if (draggingVertexIndex !== null) {
      // Finalize vertex position after dragging
      draggingVertexIndex = null;
    } else if (isDrawing) {
      // Add vertex on mouse up if not dragging
      updatePolygon();
    }
  }

  // Add a function to find a vertex near the click point
  function findNearVertex(point, vertices) {
    const threshold = 10; // Distance threshold to consider 'near'
    for (let i = 0; i < vertices.length; i++) {
      if (distanceBetween(point, vertices[i]) < threshold) {
        return i; // Return index of the near vertex
      }
    }
    return -1; // Return -1 if no vertex is near
  }

  // Calculate distance between two points (considering 3D space if necessary)
  function distanceBetween(point1, point2) {
    return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2) + Math.pow(point1.z - point2.z, 2));
  }

  function onDoubleClick(event) {
    if (isDrawing && points.length > 2) { // Ensure a valid polygon
      mouseIsPressed = false;
      points.pop(); // Remove the duplicated point from double-click
      finalizeCurrentPolygon(); // Finalize and prepare for a new polygon
      textInputPopup(event, currentPolygon);
      currentPolygon = null; // Reset currentPolygon for the next one
    }
  }

  function finalizeCurrentPolygon() {
    // This function replaces the temporary line drawing with a finalized LineLoop
    updatePolygon(); // Ensure the final point is included
    // No need to create a new object here, as updatePolygon already updates the LineLoop
  }

  function createPolygon() {
    let geometry = new THREE.BufferGeometry();
    // Ensure material and geometry are correctly set up for a LineLoop
    let polygon = new THREE.LineLoop(geometry, material);
    polygon.renderOrder = 999;
    polygon.name = "polygon annotation";
    scene.add(polygon);
    return polygon;
  }

  function updatePolygon() {
    // This function remains largely the same, ensuring the LineLoop's geometry is updated
    if (currentPolygon && points.length > 0) {
      let positions = new Float32Array(points.length * 3);
      for (let i = 0; i < points.length; i++) {
        positions[i * 3] = points[i].x;
        positions[i * 3 + 1] = points[i].y;
        positions[i * 3 + 2] = points[i].z;
      }
      currentPolygon.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      currentPolygon.geometry.attributes.position.needsUpdate = true;
      currentPolygon.geometry.setDrawRange(0, points.length);
    }
  }
}

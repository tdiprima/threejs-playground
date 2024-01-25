import * as THREE from "/build/three.module.js";

export function testing(scene, camera, renderer) {
  let vertices;
  let segments;
  let typeOfShape;
  let updateMesh;

  // Button event listeners
  let rectangleButton = document.getElementById("rectangle");
  let ellipseButton = document.getElementById("ellipse");
  let polygonButton = document.getElementById("polygon");

  rectangleButton.addEventListener("click", function () {
    typeOfShape = "rectangle";
    initGeometry(); // Initialize geometry when button is clicked
  });

  ellipseButton.addEventListener("click", function () {
    typeOfShape = "ellipse";
    initGeometry();
  });

  polygonButton.addEventListener("click", function () {
    typeOfShape = "polygon";
    points = [];
    initGeometry();
  });

  // Create a mesh
  let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  let geometry = new THREE.BufferGeometry(); // our 3D object
  let positions = [];

  // Set up geometry and "update" function
  function initGeometry() {
    switch (typeOfShape) {
      case "rectangle":
        vertices = new Float32Array(12); // 4 vertices
        updateMesh = updateRectangle;
        break;
      case "ellipse":
        segments = 64; // Number of line segments used to approximate the mesh
        vertices = new Float32Array((segments + 1) * 3); // (segments + 1) vertices * 3 coordinates (x, y, z)
        updateMesh = updateEllipse;
        break;
      case "polygon":
        vertices = new Float32Array(positions);
        updateMesh = updatePolygon;
        break;
      default:
        console.log("Invalid shape type");
        return; // Return if typeOfShape is invalid
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3)); // each vertex is composed of 3 values
  }

  // LineLoop: A continuous line that connects back to the start.
  let mesh = new THREE.LineLoop(geometry, material);
  scene.add(mesh);

  // Handle mouse events
  let isDrawing = false;
  let startPoint;
  let endPoint;
  let points = []; // polygon

  renderer.domElement.addEventListener("mousedown", onMouseDown, false);
  renderer.domElement.addEventListener("mousemove", onMouseMove, false);
  renderer.domElement.addEventListener("mouseup", onMouseUp, false);
  renderer.domElement.addEventListener("dblclick", onDoubleClick, false);

  function onMouseDown(event) {
    isDrawing = true;
    startPoint = getMousePosition(event.clientX, event.clientY);
    points.push(startPoint);
  }

  function onMouseMove(event) {
    if (isDrawing) {
      endPoint = getMousePosition(event.clientX, event.clientY);
      points[points.length - 1] = endPoint;
      if (updateMesh) updateMesh();
    }
  }

  function onMouseUp(event) {
    if (typeOfShape !== "polygon") isDrawing = false;
    endPoint = getMousePosition(event.clientX, event.clientY);
    points.push(endPoint);
    if (updateMesh) updateMesh();
  }

  function onDoubleClick(event) {
    if (typeOfShape === "polygon") {
      if (isDrawing && points.length >= 3) {
        isDrawing = false;
        points.pop(); // Remove the duplicated point from double-click
        updatePolygon();
      }

      positions = []; // Reset for next time
      points = [];
    }
  }

  function getMousePosition(clientX, clientY) {
    // Get the size and position of the canvas element
    let domRect = renderer.domElement.getBoundingClientRect();

    // Normalize mouse coordinates
    let mouse = new THREE.Vector2();
    mouse.x = ((clientX - domRect.left) / domRect.width) * 2 - 1;
    mouse.y = -((clientY - domRect.top) / domRect.height) * 2 + 1;

    // Initialize our Raycaster
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera); // set raycaster's origin and direction

    // Define an intersection point
    let intersectionPoint = new THREE.Vector3();
    // Calculate intersection with plane
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)), intersectionPoint);

    return intersectionPoint;
  }

  const updateRectangle = function () {
    let positions = mesh.geometry.attributes.position.array;
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
    mesh.geometry.attributes.position.needsUpdate = true;
  }

  const updateEllipse = function () {
    let positions = mesh.geometry.attributes.position.array;
    let center = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
    let radiusX = Math.abs(startPoint.x - endPoint.x) * 0.5;
    let radiusY = Math.abs(startPoint.y - endPoint.y) * 0.5;

    for (let i = 0; i <= segments; i++) {
      let theta = (i / segments) * Math.PI * 2;
      let x = center.x + Math.cos(theta) * radiusX;
      let y = center.y + Math.sin(theta) * radiusY;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = 0;
    }

    mesh.geometry.attributes.position.needsUpdate = true;
  }

  const updatePolygon = function () {
    // You need to update the vertices array whenever the points array changes.
    let numPoints = points.length;
    if (numPoints > 0) {
      positions = new Float32Array(numPoints * 3);
      for (let i = 0; i < numPoints; i++) {
        positions[i * 3] = points[i].x;
        positions[i * 3 + 1] = points[i].y;
        positions[i * 3 + 2] = points[i].z;
      }

      if (isDrawing) {
        positions[numPoints * 3] = points[0].x; // Connect the last point with the first point
        positions[numPoints * 3 + 1] = points[0].y;
        positions[numPoints * 3 + 2] = points[0].z;
      }
    }

    mesh.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    mesh.geometry.attributes.position.needsUpdate = true;
  }
}

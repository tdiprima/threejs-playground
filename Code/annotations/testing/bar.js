import * as THREE from "/build/three.module.js";

export function testing(scene, camera, renderer) {
  let vertices;
  let segments;
  let typeOfShape;
  let temporaryMesh; // Temporary mesh for drawing
  let allMeshes = []; // Array to store all permanent meshes

  // Material for the shapes
  let material = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 10 });

  // Handle mouse events
  let isDrawing = false;
  let startPoint = new THREE.Vector2(0, 0);
  let endPoint = new THREE.Vector2(0, 0);
  let points = []; // Points for polygon

  // Button event listeners
  let rectangleButton = document.getElementById("rectangle");
  let ellipseButton = document.getElementById("ellipse");
  let polygonButton = document.getElementById("polygon");

  // Button click handlers
  rectangleButton.addEventListener("click", function () {
    startDrawing("rectangle");
  });

  ellipseButton.addEventListener("click", function () {
    startDrawing("ellipse");
  });

  polygonButton.addEventListener("click", function () {
    startDrawing("polygon");
    points = [];
  });

  renderer.domElement.addEventListener("mousedown", onMouseDown, false);
  renderer.domElement.addEventListener("mousemove", onMouseMove, false);
  renderer.domElement.addEventListener("mouseup", onMouseUp, false);
  renderer.domElement.addEventListener("dblclick", onDoubleClick, false);

  // Start drawing a shape
  function startDrawing(type) {
    isDrawing = true;
    typeOfShape = type;
    initGeometry();
    temporaryMesh = new THREE.LineLoop(new THREE.BufferGeometry(), material);
    scene.add(temporaryMesh);
  }

  // Complete the drawing
  function completeDrawing() {
    isDrawing = false;
    let permanentGeometry = new THREE.BufferGeometry();
    permanentGeometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    addMesh(permanentGeometry, material);
    scene.remove(temporaryMesh); // Remove temporary mesh
    temporaryMesh = null;
    points = [];
  }

  function addMesh(geometry, material) {
    let newMesh = new THREE.LineLoop(geometry, material);
    newMesh.renderOrder = 999;
    scene.add(newMesh);
    allMeshes.push(newMesh);
  }

  // Set up geometry
  function initGeometry() {
    switch (typeOfShape) {
      case "rectangle":
        vertices = new Float32Array(12); // 4 vertices
        break;
      case "ellipse":
        segments = 64; // Number of line segments for the ellipse
        vertices = new Float32Array((segments + 1) * 3); // Vertices for the ellipse
        break;
      case "polygon":
        vertices = new Float32Array(positions);
        break;
      default:
        console.log("Invalid shape type");
        return;
    }
  }

  // Event handlers
  function onMouseDown(event) {
    if (isDrawing) {
      startPoint = getMousePosition(event.clientX, event.clientY);
      points.push(startPoint.clone());
    }
  }

  function onMouseMove(event) {
    if (isDrawing) {
      endPoint = getMousePosition(event.clientX, event.clientY);
      points[points.length - 1] = endPoint.clone();
      updateMesh(temporaryMesh.geometry); // Update temporary mesh
    }
  }

  function onMouseUp(event) {
    if (typeOfShape !== "polygon") {
      completeDrawing();
      // points = []; // todo: if it borks, check this
    }
  }

  function onDoubleClick(event) {
    if (typeOfShape === "polygon" && points.length >= 3) {
      completeDrawing();
    }
  }

  // Update mesh function now takes geometry as a parameter
  function updateMesh(geometry) {
    switch (typeOfShape) {
      case "rectangle":
        updateRectangle(geometry);
        break;
      case "ellipse":
        updateEllipse(geometry);
        break;
      case "polygon":
        updatePolygon(geometry);
        break;
      default:
        console.log("Invalid shape type");
    }
  }

  // The shape update functions now modify the passed geometry
  const updateRectangle = function (geometry) {
    let positions = [
      startPoint.x, startPoint.y, startPoint.z,  // First corner
      endPoint.x, startPoint.y, startPoint.z,    // Second corner
      endPoint.x, endPoint.y, startPoint.z,      // Third corner
      startPoint.x, endPoint.y, startPoint.z     // Fourth corner
    ];

    // Close the rectangle by repeating the first point
    positions.push(startPoint.x, startPoint.y, startPoint.z);

    // Convert positions to a Float32Array
    let vertices = new Float32Array(positions);

    // Update the geometry
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.attributes.position.needsUpdate = true;
  };

  const updateEllipse = function (geometry) {
    // Center of the ellipse
    let centerX = (startPoint.x + endPoint.x) / 2;
    let centerY = (startPoint.y + endPoint.y) / 2;
    let centerZ = (startPoint.z + endPoint.z) / 2;

    // Radii of the ellipse
    let radiusX = Math.abs(endPoint.x - startPoint.x) / 2;
    let radiusY = Math.abs(endPoint.y - startPoint.y) / 2;

    // Number of segments
    const segments = 64; // More segments make the ellipse smoother
    let angleIncrement = Math.PI * 2 / segments;

    // Create or update the array of vertices
    vertices = new Float32Array((segments + 1) * 3);

    // Calculate positions of vertices around the ellipse
    for (let i = 0; i <= segments; i++) {
      let angle = angleIncrement * i;
      let x = centerX + radiusX * Math.cos(angle);
      let y = centerY + radiusY * Math.sin(angle);
      let z = centerZ; // Ellipse is in 2D plane, so z is constant

      vertices[i * 3] = x;
      vertices[i * 3 + 1] = y;
      vertices[i * 3 + 2] = z;
    }

    // Update the geometry with the new vertices
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.attributes.position.needsUpdate = true;
  };

  const updatePolygon = function (geometry) {
    let positions = [];

    // Loop through each point in the points array
    for (let i = 0; i < points.length; i++) {
      positions.push(points[i].x, points[i].y, points[i].z);
    }

    // Close the polygon by connecting to the first point
    if (points.length > 0) {
      positions.push(points[0].x, points[0].y, points[0].z);
    }

    // Convert positions to a Float32Array
    let vertices = new Float32Array(positions);

    // Update the geometry
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.attributes.position.needsUpdate = true;
  };

  // Function to get mouse position
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
}

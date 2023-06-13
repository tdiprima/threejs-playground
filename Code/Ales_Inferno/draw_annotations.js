// https://cdnjs.cloudflare.com/ajax/libs/three.js/r124/three.min.js
function drawAnnotations() {
  // Assuming you have an array of x, y drawingCoordinates called 'drawingCoordinates'
  // Create a THREE.Geometry object to hold the line vertices
  let lineGeometry = new THREE.Geometry();

  // Loop through the drawingCoordinates and add them to the lineGeometry
  for (let i = 0; i < drawingCoordinates.length; i++) {
    let x = drawingCoordinates[i].x; // x-coordinate
    let y = drawingCoordinates[i].y; // y-coordinate

    // Convert 2D drawingCoordinates to 3D drawingCoordinates
    let vector = new THREE.Vector3(x, y, 0);

    // Add the vector to the lineGeometry
    lineGeometry.vertices.push(vector);
  }

  // Create a material for the line
  let lineMaterial = new THREE.LineBasicMaterial({color: 0x00ff00});

  // Create a line object using the lineGeometry and lineMaterial
  let line = new THREE.Line(lineGeometry, lineMaterial);

  // Add the line to your scene
  scene.add(line);

  console.log("drawingCoordinates", drawingCoordinates);
}

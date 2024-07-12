// Example zoomFactor. Adjust this based on your application's current zoom level.
let zoomFactor = 2; // For example, 2x zoom

function worldToScreen(vector) {
  let widthHalf = window.innerWidth / 2;
  let heightHalf = window.innerHeight / 2;

  vector.project(camera);
  vector.x = (vector.x * widthHalf) + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;
  return vector;
}

function calculateAreaAndPerimeter(screenPositions, zoomFactor) {
  let area = 0, perimeter = 0;
  let n = screenPositions.length;

  for (let i = 0; i < n - 1; i++) {
    let x1 = screenPositions[i].x, y1 = screenPositions[i].y;
    let x2 = screenPositions[i + 1].x, y2 = screenPositions[i + 1].y;
    area += x1 * y2 - x2 * y1;
    perimeter += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  area = Math.abs(area / 2);
  perimeter += Math.sqrt((screenPositions[n - 1].x - screenPositions[0].x) ** 2 + (screenPositions[n - 1].y - screenPositions[0].y) ** 2);

  // Adjust area and perimeter by the zoom factor
  // Pixels per micron at base level (zoomFactor = 1)
  const pixelsPerMicronBase = 4;

  // Pixels per micron at current zoom level
  const pixelsPerMicron = pixelsPerMicronBase * zoomFactor;

  // Convert area from pixels^2 to microns^2
  const areaInMicrons = area / (pixelsPerMicron ** 2);

  // Convert perimeter from pixels to microns
  const perimeterInMicrons = perimeter / pixelsPerMicron;

  return {area: areaInMicrons, perimeter: perimeterInMicrons};
}

function displayPolygonInfo(positions) {
  let screenPositions = [];
  for (let i = 0; i < positions.length; i += 3) {
    let vector = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
    screenPositions.push(worldToScreen(vector.clone()));
  }

  let {area, perimeter} = calculateAreaAndPerimeter(screenPositions, zoomFactor);

  let infoDiv = document.getElementById('infoDiv');
  let infoText = document.getElementById('infoText');
  infoText.innerHTML = `Area: ${area.toFixed(2)} microns<sup>2</sup><br>Perimeter: ${perimeter.toFixed(2)} microns`;
  infoDiv.style.display = 'block';

  setTimeout(() => {
    infoDiv.style.display = 'none';
  }, 5000);
}

window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

(function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();


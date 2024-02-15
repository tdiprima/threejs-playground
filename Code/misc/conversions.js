function convertToImageCoordinates(positionArray, imageWidth, imageHeight) {
  const imageCoordinates = [];

  for (let i = 0; i < positionArray.length; i += 3) {
    // Extract the x and y coordinates from Three.js NDC space
    let threeX = positionArray[i];     // X coordinate in NDC
    let threeY = positionArray[i + 1]; // Y coordinate in NDC

    // Convert from NDC space [-1, 1] to image coordinates
    const imageX = (threeX + 1) / 2 * imageWidth;
    const imageY = (1 - threeY) / 2 * imageHeight;

    imageCoordinates.push({ x: imageX, y: imageY });
  }

  return imageCoordinates;
}

/**
 * Convert image coordinates to Three.js coordinates
 */
function imageToThreeCoords(array, imageWidth, imageHeight) {
  return array.map(({x, y}) => {
    // Normalize coordinates (0 to 1)
    const normalizedX = x / imageWidth;
    const normalizedY = y / imageHeight;

    // Map to Three.js coordinates (-1 to 1)
    const threeX = normalizedX * 2 - 1; // Shift and scale x
    const threeY = (1 - normalizedY) * 2 - 1; // Invert, shift, and scale y (y is inverted in WebGL/Three.js)

    return { x: threeX, y: threeY };
  });
}

const imageCoords = [
  {x: 100, y: 100}, // Vertex A
  {x: 300, y: 100}, // Vertex B
  {x: 200, y: 300}  // Vertex C
];

console.log(imageToThreeCoords(imageCoords, 400, 300));

// const threeCoords = [
//   { x: -0.5, y: 0.3333333333333335 },
//   { x: 0.5, y: 0.3333333333333335 },
//   { x: 0, y: -1 }
// ];

const threeCoords = [-0.5, 0.33, 0, 0.5, 0.33, 0, 0, -1, 0];
console.log(convertToImageCoordinates(threeCoords, 400, 300));

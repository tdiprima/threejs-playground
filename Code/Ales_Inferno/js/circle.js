// REVISION 124
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the circle geometry
// Adjust the radius and segments variables to customize the size and smoothness of the circle
let radius = 5;
let segments = 64;
let geometry = new THREE.Geometry();
let material = new THREE.LineBasicMaterial({ color: 0x00ff00 });

// Calculate the vertices of the circle by iterating over a specified number of segments
for (let i = 0; i <= segments; i++) {
  let theta = (i / segments) * Math.PI * 2;
  // Using cos and sin to calculate the x and y coordinates of each vertex
  let x = radius * Math.cos(theta);
  let y = radius * Math.sin(theta);
  geometry.vertices.push(new THREE.Vector3(x, y, 0));
}

let originalArray = geometry.vertices;
console.log("originalArray", originalArray.length);

// Create the circle using Line
let circle = new THREE.Line(geometry, material);
scene.add(circle);

let decButton = document.getElementById("decimate");
decButton.addEventListener("click", function () {
  scene.remove(circle);

  let point1 = originalArray[0];
  let point2 = originalArray[originalArray.length - 1];

  // Extract every 3rd element
  const newArray = originalArray.reduce((acc, current, index) => {
    if ((index + 1) % 3 === 0) {
      acc.push(current);
    }
    return acc;
  }, []);

  newArray.unshift(point1); // Add element 1 to the beginning of the array
  newArray.push(point2);

  console.log("newArray", newArray.length);

  let geometry1 = new THREE.Geometry();
  let material1 = new THREE.LineBasicMaterial({ color: 0xff0000 });

  geometry1.vertices = newArray;

  let circle1 = new THREE.Line(geometry1, material1);
  scene.add(circle1);
});

// OK! The last thing you do is position the camera.
camera.position.z = 10;

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Render the scene in an animation loop
(function animate() {
  requestAnimationFrame(animate);
  // Display scene using a WebGL renderer
  renderer.render(scene, camera);
})();

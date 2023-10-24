// https://discourse.threejs.org/t/create-a-scale-bar/25278
// https://stackoverflow.com/questions/26719519/how-can-i-draw-a-scale-meter#26724981
let controls = new THREE.OrbitControls({});
let camera = {};
// get distance from camera to 'target' of OrbitControls
let distance = camera.position.distanceTo(controls.target);
let normalizedDistance = (distance - controls.minDistnace) / (controls.maxDistance - controls.minDistance);
// let normalizedDistance = distance / (controls.maxDistance - controls.minDistance)
console.log(normalizedDistance);
let fieldNameElement;
fieldNameElement.innerText = `Scale : ${normalizedDistance.toFixed(2).toString()}`;

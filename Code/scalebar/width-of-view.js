// https://stackoverflow.com/questions/13350875/three-js-width-of-view#13351534
let camera, dist, width;
let vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians
let height = 2 * Math.tan(vFOV / 2) * dist; // visible height
let width = height * camera.aspect; // visible width

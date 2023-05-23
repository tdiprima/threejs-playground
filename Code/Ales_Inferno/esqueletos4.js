renderer1.setSize(width / 2, height / 2);
renderer1.domElement.style.position = 'absolute';
renderer1.domElement.style.top = '0';
renderer1.domElement.style.left = '0';
document.body.appendChild(renderer1.domElement);

renderer2.setSize(width / 2, height / 2);
renderer2.domElement.style.position = 'absolute';
renderer2.domElement.style.top = '0';
renderer2.domElement.style.left = `${width / 2}px`;
document.body.appendChild(renderer2.domElement);

renderer3.setSize(width / 2, height / 2);
renderer3.domElement.style.position = 'absolute';
renderer3.domElement.style.top = `${height / 2}px`;
renderer3.domElement.style.left = '0';
document.body.appendChild(renderer3.domElement);

renderer4.setSize(width / 2, height / 2);
renderer4.domElement.style.position = 'absolute';
renderer4.domElement.style.top = `${height / 2}px`;
renderer4.domElement.style.left = `${width / 2}px`;
document.body.appendChild(renderer4.domElement);

// Set up event listeners to control the cameras
function onDocumentMouseDown(event) {
  event.preventDefault();

  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
}

function onDocumentMouseMove(event) {
  const mouseX = event.clientX - windowHalfX;
  const mouseY = event.clientY - windowHalfY;

  const camera1X = (mouseX / width) * 2 - 1;
  const camera1Y = -(mouseY / height) * 2 + 1;
  camera1.position.x = camera1X * 10;
  camera1.position.y = camera1Y * 10;
  camera1.lookAt(scene1.position);

  const camera2X = ((mouseX - width / 2) / width) * 2 - 1;
  const camera2Y = -(mouseY / height) * 2 + 1;
  camera2.position.x = camera2X * 10;
  camera2.position.y = camera2Y * 10;
  camera2.lookAt(scene2.position);

  const camera3X = (mouseX / width) * 2 - 1;
  const camera3Y = -((mouseY - height / 2) / height) * 2 + 1;
  camera3.position.x = camera3X * 10;
  camera3.position.y = camera3Y * 10;
  camera3.lookAt(scene3.position);

  const camera4X = ((mouseX - width / 2) / width) * 2 - 1;
  const camera4Y = -((mouseY - height / 2) / height) * 2 + 1;
  camera4.position.x = camera4X * 10;
  camera4.position.y = camera4Y * 10;
  camera4.lookAt(scene4.position);

  renderer1.render(scene1, camera1);
  renderer2.render(scene2, camera2);
  renderer3.render(scene3, camera3);
  renderer4.render(scene4, camera4);
}

function onDocumentMouseUp(event) {
  document.removeEventListener('mousemove', onDocumentMouseMove);
  document.removeEventListener('mouseup', onDocumentMouseUp);
}

document.addEventListener('mousedown', onDocumentMouseDown);

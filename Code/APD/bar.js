// Image 1 clicked! Image 2 clicked! Both.
function onDocumentMouseDown(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster1 = new THREE.Raycaster();
  raycaster1.setFromCamera(mouse, camera1);
  const intersects1 = raycaster1.intersectObject(mesh1);

  const raycaster2 = new THREE.Raycaster();
  raycaster2.setFromCamera(mouse, camera2);
  const intersects2 = raycaster2.intersectObject(mesh2);

  if (intersects1.length > 0) {
    console.log('Image 1 clicked!', intersects1[0].object);
  }

  if (intersects2.length > 0) {
    console.log('Image 2 clicked!', intersects2[0].object);
  }
}


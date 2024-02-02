// TypeError: can't access property "type", obj.geometry is undefined
function serializeScene() {
  serializedData = scene.children.map(obj => {
    return {
      type: obj.geometry.type,
      position: obj.position,
      rotation: obj.rotation,
      userData: obj.userData
    };
  });
  console.log('Serialized Data:', serializedData);
}

function deserializeScene() {
  serializedData.forEach(data => {
    const geometry = new THREE[data.type]();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(data.position);
    mesh.rotation.copy(data.rotation);
    mesh.userData = data.userData;

    scene.add(mesh);
  });
}

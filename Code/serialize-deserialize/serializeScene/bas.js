// Filter on if the object type is LineLoop
// obj.geometry.vertices is undefined
function serializeScene() {
  serializedData = scene.children.filter(obj => obj instanceof THREE.LineLoop).map(obj => {
    // Assuming every LineLoop object has a geometry and material we want to serialize
    // Note: For LineLoop, geometry type might not be directly available as in Mesh. You might need to handle it differently.
    return {
      type: 'LineLoop', // Directly specify the type as LineLoop since obj.geometry.type might not be what you expect
      vertices: obj.geometry.vertices.map(v => ({ x: v.x, y: v.y, z: v.z })), // Example for serializing vertices
      position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
      rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
      scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
      userData: obj.userData
    };
  });
  console.log('Serialized Data:', serializedData);
}

function deserializeScene() {
  serializedData.forEach(data => {
    if(data.type === 'LineLoop') {
      // Recreate the geometry from vertices
      const geometry = new THREE.Geometry(); // or BufferGeometry, depending on your Three.js version
      data.vertices.forEach(v => geometry.vertices.push(new THREE.Vector3(v.x, v.y, v.z)));

      // Assuming a basic material for simplicity. Customize as needed.
      const material = new THREE.LineBasicMaterial({ color: 0xffff00 });

      // Create the LineLoop object
      const lineLoop = new THREE.LineLoop(geometry, material);

      // Set position, rotation, and scale
      lineLoop.position.set(data.position.x, data.position.y, data.position.z);
      lineLoop.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
      lineLoop.scale.set(data.scale.x, data.scale.y, data.scale.z);

      // If you have userData to set
      lineLoop.userData = data.userData;

      // Add the newly created object to the scene
      scene.add(lineLoop);
    }
    // Handle other object types if necessary
  });
}

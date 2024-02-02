// Fixes bas
function serializeScene() {
  serializedData = scene.children.filter(obj => obj instanceof THREE.LineLoop).map(obj => {
    // Accessing vertex data from BufferGeometry
    const vertices = [];
    if (obj.geometry.attributes.position) {
      const positions = obj.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        vertices.push({
          x: positions.getX(i),
          y: positions.getY(i),
          z: positions.getZ(i)
        });
      }
    }

    return {
      type: 'LineLoop',
      vertices: vertices,
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
    if (data.type === 'LineLoop') {
      // Create a BufferGeometry
      const geometry = new THREE.BufferGeometry();

      // Flatten the vertex data for BufferGeometry
      const vertices = [];
      data.vertices.forEach(v => {
        vertices.push(v.x, v.y, v.z);
      });

      // Add vertices to the geometry
      const verticesFloat32Array = new Float32Array(vertices);
      geometry.setAttribute('position', new THREE.BufferAttribute(verticesFloat32Array, 3));

      // Create a basic material for the LineLoop
      const material = new THREE.LineBasicMaterial({ color: 0xffff00 });

      // Create the LineLoop object with the geometry and material
      const lineLoop = new THREE.LineLoop(geometry, material);

      // Set position, rotation, and scale
      lineLoop.position.set(data.position.x, data.position.y, data.position.z);
      lineLoop.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
      lineLoop.scale.set(data.scale.x, data.scale.y, data.scale.z);

      // Set userData if any
      lineLoop.userData = data.userData;

      // Add the LineLoop to the scene
      scene.add(lineLoop);
    }
    // Include deserialization for other object types if necessary
  });
}

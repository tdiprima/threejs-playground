// Fixes foo
function serializeScene() {
  serializedData = scene.children.filter(obj => obj.isMesh).map(obj => {
    return {
      type: obj.geometry.type,
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
      userData: obj.userData
    };
  });
  console.log('Serialized Data:', serializedData);
}

// Additionally, remember that the position, rotation, and scale properties are objects containing x, y, and z values.
// When serializing, you might want to store these values individually, as direct copying of these objects might not work as expected due to their internal structures.
// position: {
//   x: obj.position.x,
//     y: obj.position.y,
//     z: obj.position.z
// },

import * as THREE from 'three';
import { createButton } from "../helpers/elements.js";

export function save(scene) {

  const saveButton = createButton({
    id: "save",
    innerHtml: "<i class=\"fas fa-save\"></i>",
    title: "save"
  });

  saveButton.addEventListener("click", serializeScene);

  function serializeScene() {
    const serializedData = scene.children.filter(obj => obj instanceof THREE.LineLoop).map(obj => {
      // Assuming every LineLoop object has a geometry and material we want to serialize
      return {
        type: 'LineLoop', // Directly specify the type as LineLoop
        vertices: obj.vertices.map(v => ({ x: v.x, y: v.y, z: v.z })), // Serializing vertices
        position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
        rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
        scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
        userData: obj.userData
      };
    });
    console.log('Serialized Data:', serializedData);
  }
}

export function deserializeScene(scene, serializedData) {
  serializedData.forEach(data => {
    if(data.type === 'LineLoop') {
      // Recreate the geometry from vertices
      const geometry = new THREE.Geometry(); // or BufferGeometry, depending on your Three.js version
      data.vertices.forEach(v => geometry.vertices.push(new THREE.Vector3(v.x, v.y, v.z)));

      // Assuming a basic material for simplicity. Customize as needed.
      const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

      // Create the LineLoop object
      const lineLoop = new THREE.LineLoop(geometry, material);

      // Set position, rotation, scale, and userData
      lineLoop.position.set(data.position.x, data.position.y, data.position.z);
      lineLoop.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
      lineLoop.scale.set(data.scale.x, data.scale.y, data.scale.z);
      lineLoop.userData = data.userData;

      // Add the newly created object to the scene
      scene.add(lineLoop);
    }
    // Handle other object types if necessary
  });
}

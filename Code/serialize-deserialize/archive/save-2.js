import * as THREE from 'three';
import { createButton } from "../helpers/elements.js";

export function save(scene) {
  const demo = true;

  const saveButton = createButton({
    id: "save",
    innerHtml: "<i class=\"fas fa-save\"></i>",
    title: "save"
  });

  saveButton.addEventListener("click", function () {
    serializeScene(scene);
  });

  let serializedData = [];

  function serializeObject(obj) {
    // Accessing vertex data from BufferGeometry
    const vertices = [];
    if (obj.geometry && obj.geometry.attributes.position) {
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
      type: obj.type,
      geometryType: obj.geometry ? obj.geometry.type : undefined,
      materialType: obj.material ? obj.material.type : undefined,
      opacity: obj.material ? obj.material.opacity : 1,
      color: obj.material ? obj.material.color : new THREE.Color( 0, 0, 1 ),
      vertices: vertices,
      position: obj.position,
      rotation: obj.rotation,
      scale: obj.scale,
      name: obj.name,
      userData: obj.userData
    };
  }

  function serializeScene(scene) {
    serializedData = []; // Reset serialized data

    // Check if scene and scene.children are defined
    if (!scene || !scene.children) {
      console.error('Scene or scene.children is undefined.');
      alert('Failed to serialize the scene. Check console for details.');
      return; // Exit the function if scene or scene.children is not defined
    }

    function traverseAndSerialize(obj) {
      // Check if object's name includes "annotation"
      if (obj.name.includes("annotation")) {
        serializedData.push(serializeObject(obj));
      }

      // If the object has children, iterate through them
      if (obj.children && obj.children.length > 0) {
        obj.children.forEach(child => {
          traverseAndSerialize(child);
        });
      }
    }

    scene.children.forEach(child => {
      traverseAndSerialize(child);
    });

    // TODO: Save to the database
    console.log('Serialized Data:', serializedData);
    alert('Scene serialized successfully. Check console for details.');
  }

  //*******************************
  // For demonstration and testing:
  if (demo) {
    createButton({
      id: "clear",
      innerHtml: "<i class=\"fas fa-skull\"></i>",
      title: "clear"
    }).addEventListener("click", function () {
      scene.children.forEach(child => {
        if (child.name.includes("annotation")) {
          // Remove the mesh from the scene
          scene.remove(child);
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    });
    createButton({
      id: "deserialize",
      innerHtml: "<i class=\"fa-solid fa-image\"></i>",
      title: "deserialize"
    }).addEventListener("click", function () {
      deserializeScene(scene, serializedData);
    });
  }
}

export function deserializeScene(scene, serializedData) {
  serializedData.forEach(data => {
    if (data.name.includes("annotation")) {
      const geometry = new THREE[data.geometryType]();

      // Flatten the vertex data for BufferGeometry
      const vertices = [];
      data.vertices.forEach(v => {
        vertices.push(v.x, v.y, v.z);
      });

      // Add vertices to the geometry
      const verticesFloat32Array = new Float32Array(vertices);
      geometry.setAttribute('position', new THREE.BufferAttribute(verticesFloat32Array, 3));

      let material;
      if (data.opacity === 1) {
        material = new THREE[data.materialType]({ color: data.color });
      } else {
        material = new THREE[data.materialType]({ color: data.color, transparent: true, opacity: data.opacity});
      }

      const mesh = new THREE[data.type](geometry, material);

      // Set position, rotation, scale, and userData
      mesh.position.copy(data.position);
      mesh.rotation.copy(data.rotation);
      mesh.scale.copy(data.scale);
      mesh.name = data.name;
      mesh.userData = data.userData;

      // Add the newly created object to the scene
      scene.add(mesh);
    }
  });
}

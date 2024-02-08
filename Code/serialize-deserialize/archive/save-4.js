// Serialize the whole object
import * as THREE from 'three';
import { createButton } from "../helpers/elements.js";

export function save(scene) {
  const demo = true;

  createButton({
    id: "save",
    innerHtml: "<i class=\"fas fa-save\"></i>",
    title: "save"
  }).addEventListener("click", function () {
    serializeScene(scene);
  });

  let serializedObjects = [];

  function serializeScene(scene) {
    serializedObjects = [];

    // Custom function to serialize individual object properties, including children
    function serializeObjectWithChildren(obj) {
      // Use .toJSON() to serialize the object itself
      let serializedObj = obj.toJSON();

      // Filter children to include only those with names like "annotation"
      if (obj.children && obj.children.length > 0) {
        serializedObj.children = obj.children
          .filter(child => child.name.includes("annotation"))
          .map(child => child.toJSON());
      }

      return serializedObj;
    }

    scene.traverse((obj) => {
      if (obj.name.includes("annotation")) {
        // Directly serialize objects named "annotation"
        serializedObjects.push(serializeObjectWithChildren(obj));
      } else if (obj.type === 'Group') {
        // If the object is a Group, check its children
        let groupWithFilteredChildren = obj.children.filter(child => child.name.includes("annotation"));
        if (groupWithFilteredChildren.length > 0) {
          // Serialize the group with only the relevant children
          let serializedGroup = serializeObjectWithChildren(obj);
          // Replace the children of the serialized group with only those filtered
          serializedGroup.children = groupWithFilteredChildren.map(child => child.toJSON());
          serializedObjects.push(serializedGroup);
        }
      }
    });

    // TODO: save serializedObjects to a database
    console.log('Serialized Objects:', serializedObjects);
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
      let objectsToRemove = [];

      function findAnnotations(obj) {
        if (obj.name.includes("annotation")) {
          // Add the object to the removal list
          objectsToRemove.push(obj);
        } else if (obj.children && obj.children.length) {
          // If the object has children, check them too
          obj.children.forEach(findAnnotations);
        }
      }

      // Start the search with the top-level children of the scene
      scene.children.forEach(findAnnotations);

      // Now remove the collected objects and dispose of their resources
      objectsToRemove.forEach(obj => {
        if (obj.parent) {
          obj.parent.remove(obj); // Ensure the object is removed from its parent
        } else {
          scene.remove(obj); // Fallback in case the object is directly a child of the scene
        }
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          // In case of an array of materials
          if (Array.isArray(obj.material)) {
            obj.material.forEach(material => material.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    });

    createButton({
      id: "deserialize",
      innerHtml: "<i class=\"fa-solid fa-image\"></i>",
      title: "deserialize"
    }).addEventListener("click", function () {
      deserializeScene(scene, serializedObjects);
    });
  }
}

export function deserializeScene(scene, serializedObjects) {
  const loader = new THREE.ObjectLoader();

  serializedObjects.forEach(serializedData => {
    // Assuming serializedData is the JSON object for each object
    // If serializedData is a string, parse it first: const json = JSON.parse(serializedData);
    const object = loader.parse(serializedData);

    // Add the deserialized object to the scene
    scene.add(object);
  });

  console.log('Objects deserialized and added to the scene.');
}

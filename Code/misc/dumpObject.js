/**
 * This code provides utility functions to recursively log the hierarchy of objects
 * in a Three.js scene, inspect objects with level of detail (LOD), and log material
 * and geometry properties of square meshes.
 */
import * as THREE from 'three';

/**
 * Recursive function to dump the hierarchy of a Three.js object
 */
export function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  // Determine the prefix for the current object (either └─ for the last child, or ├─ for others)
  const localPrefix = isLast ? '└─' : '├─';

  // Add the current object's name and type to the lines array
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || 'unnamed'} [${obj.type}]`);

  // Update the prefix for child objects (│ for continuing, or space for the last child)
  const newPrefix = prefix + (isLast ? '  ' : '│ ');

  // Determine the index of the last child
  const lastNdx = obj.children.length - 1;

  // Recursively dump each child object
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx; // Check if this is the last child
    dumpObject(child, lines, isLast, newPrefix);
  });

  // Return the accumulated lines for display
  return lines;
}
// import {dumpObject} from './dumpObject.js';
// console.log("scene.children:", scene.children);
// console.log(`%c${dumpObject(scene).join('\n')}`, "color: #00ff00;");

/**
 * Function to log the hierarchy of objects in a Three.js scene
 */
export function sceneDump(scene) {
  scene.children.forEach(child => {
    // Log each child of the scene using dumpObject, styling the text in green
    console.log(`%c${dumpObject(child).join('\n')}`, "color: #00ff00;");
  });
}

/**
 * Function to specifically dump the details of objects in a scene that are instances of THREE.LOD
 */
export function imageViewerDump(scene) {
  scene.children.forEach(child => {
    // Check if the child is an instance of THREE.LOD (Level of Detail)
    if (child instanceof THREE.LOD) {
      console.log(child, "\nfound with children:\n", child.children);

      // Log details of each child within the LOD object
      child.children.forEach((lodChild) => {
        console.log("Child type: ", lodChild.type);

        // If the child is a Mesh, log its geometry
        if (lodChild instanceof THREE.Mesh) {
          console.log("Mesh with geometry: ", lodChild.geometry);
        } else {
          // Otherwise, log that it is a non-mesh child
          console.log("Non-mesh child: ", lodChild);
        }
      });
    }
  });
}

/**
 * Function to log properties of an array of square meshes
 */
export function objectProperties(squares) {
  // Loop through each square mesh in the array
  squares.forEach((square, index) => {
    // Check if the object has a material and log its transparency and opacity
    if (square.material) {
      console.log(`Object ${index} - Transparent: ${square.material.transparent}, Opacity: ${square.material.opacity}`);
    } else {
      console.log(`Object ${index} does not have a material.`);
    }

    // Check if the object has a bounding box and log it
    if (square.geometry.boundingBox) {
      console.log('Object has a bounding box:', square.geometry.boundingBox);
    } else {
      console.log('Object does not have a bounding box.');
    }

    // Check if the object has a bounding sphere and log it
    if (square.geometry.boundingSphere) {
      console.log('Object has a bounding sphere:', square.geometry.boundingSphere);
    } else {
      console.log('Object does not have a bounding sphere.');
    }
  });
}

## Map multiple textures to a material

You can use the `THREE.MultiMaterial` class, or by using a newer approach with the `THREE.MeshStandardMaterial` and the `THREE.Texture` class. I'll explain both methods below:

1. Using `THREE.MultiMaterial` (deprecated):

   ```javascript
   // Create the textures
   var texture1 = new THREE.TextureLoader().load('texture1.jpg');
   var texture2 = new THREE.TextureLoader().load('texture2.jpg');

   // Create the materials
   var material1 = new THREE.MeshBasicMaterial({ map: texture1 });
   var material2 = new THREE.MeshBasicMaterial({ map: texture2 });

   // Create the MultiMaterial
   var materials = [material1, material2];
   var multiMaterial = new THREE.MultiMaterial(materials);

   // Create the geometry and assign the MultiMaterial
   var geometry = new THREE.BoxGeometry(1, 1, 1);
   var mesh = new THREE.Mesh(geometry, multiMaterial);

   // Add the mesh to the scene
   scene.add(mesh);
   ```

   With `THREE.MultiMaterial`, you create an array of materials and assign it to the `THREE.MultiMaterial` object. Each material in the array can have its own texture.

2. Using `THREE.MeshStandardMaterial` and `THREE.Texture` (recommended):

   ```javascript
   // Create the textures
   var texture1 = new THREE.TextureLoader().load('texture1.jpg');
   var texture2 = new THREE.TextureLoader().load('texture2.jpg');

   // Create the materials
   var material1 = new THREE.MeshStandardMaterial({ map: texture1 });
   var material2 = new THREE.MeshStandardMaterial({ map: texture2 });

   // Create the geometry
   var geometry = new THREE.BoxGeometry(1, 1, 1);

   // Apply the materials to the geometry's faces
   geometry.faces.forEach(function (face) {
     // Assign material1 to the first half of the faces
     if (face.normal.y > 0) {
       face.materialIndex = 0;
     }
     // Assign material2 to the second half of the faces
     else {
       face.materialIndex = 1;
     }
   });

   // Create the mesh
   var mesh = new THREE.Mesh(geometry, [material1, material2]);

   // Add the mesh to the scene
   scene.add(mesh);
   ```

   In this approach, you use a single `THREE.MeshStandardMaterial` for each texture and assign them to the respective faces of the geometry. The `materialIndex` property is used to determine which material to apply to each face.

Note that `THREE.MultiMaterial` has been deprecated in recent versions of Three.js, and the newer approach using `THREE.MeshStandardMaterial` and `THREE.Texture` is recommended.

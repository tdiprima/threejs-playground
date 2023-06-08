## Map multiple textures to a material

<span style="color:#0000dd;">This is because I wanted to map both the image and the drawing-canvas to the same thing, so that hopefully I could draw on it.  Remember?</span>

```
THREE.MultiMaterial has been removed. Use an Array instead. 
```

[THREE.MultiMaterial has been removed. Use an Array instead](https://stackoverflow.com/questions/45429660/three-multimaterial-has-been-removed-use-an-array-instead)

[Multimaterials in THREE.js](https://discourse.threejs.org/t/multimaterials-in-three-js/2368)

## Answer (sort of)

TEXTURE 1: /textures/images/cut-the-rope.jpg

TEXTURE 2: /textures/decal/decal-normal.jpg

You can use the `THREE.MultiMaterial` class, or by using a newer approach with the `THREE.MeshStandardMaterial` and the `THREE.Texture` class.

1. Using `THREE.MultiMaterial` (deprecated):

    <mark>**Tried it.**</mark> Getting new error "group material is undefined", which causes another error, which...

    ```html
    <!-- Didn't work with this, so tried it right from the three.js repo and the code still didn't work.  I might just need a different version. IDK. -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/84/three.min.js"></script>
    ```
    
   ```javascript
   // commit e65efda9df; 84dev
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

    <br>

    With `THREE.MultiMaterial`, you create an array of materials and assign it to the `THREE.MultiMaterial` object. Each material in the array can have its own texture.

2. Using `THREE.MeshStandardMaterial` and `THREE.Texture` (recommended):

    <mark>**I know I freakin did this**</mark> with the stupid cube and the colors. `geometry.vertices`

   ```javascript
   // Create the textures
   var texture1 = new THREE.TextureLoader().load('texture1.jpg');
   var texture2 = new THREE.TextureLoader().load('texture2.jpg');

   // Create the materials
   var material1 = new THREE.MeshStandardMaterial({ map: texture1 });
   var material2 = new THREE.MeshStandardMaterial({ map: texture2 });

   // Create the geometry
   var geometry = new THREE.BoxGeometry(1, 1, 1);

    // TODO: geometry.faces is undefined
    // Tried r124, where geometry.faces works, but nothing shows up on screen.

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

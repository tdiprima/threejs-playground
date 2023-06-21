## Serialize and Deserialize Canvas

In fabric.js, we can serialize and deserialize our canvas, in order to save it to a database and restore it.  I have a fabric.js code sample below; can it be converted to three.js?

```javascript
let canvas = new fabric.Canvas('c');
canvas.add(new fabric.Rect({
  width: 50,
  height: 50,
  fill: 'red',
  top: 100,
  left: 100
}));
let c = canvas.toJSON();

console.log('%ccanvas to json', 'color: lime;', c);
console.log('%ctype', 'color: blue;', typeof c);

let str = JSON.stringify(canvas);
console.log('%cstr', 'color: red;', str);

canvas.clear();
canvas.loadFromJSON(c);
```

### Objects' Necessary Properties

In Three.js, there isn't a built-in serialization and deserialization functionality like in fabric.js. However, you can still achieve similar functionality by manually storing and restoring the necessary properties of objects in your scene.

Here we're gonna serialize the whole scene, like the whole canvas:

```javascript
// Set up the scene
const scene = new THREE.Scene();

// Add a cube to the scene
// const geometry = new THREE.BoxGeometry(50, 50, 50);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 'red' });
const cube = new THREE.Mesh(geometry, material);
// cube.position.set(100, 25, 0);
cube.position.set(2, 0.5, 0);
scene.add(cube);

// Serialize the scene
const serializedScene = JSON.stringify(scene.toJSON());
console.log('%cscene to json', 'color: lime;', serializedScene);

// Restore the scene
scene.clear();
const parsedScene = JSON.parse(serializedScene);
const loader = new THREE.ObjectLoader();
const restoredObjects = loader.parse(parsedScene);
scene.add(restoredObjects);
```

<br>

**Serialize the scene** using `JSON.stringify(scene.toJSON())`.

**To restore the scene**, we parse the serialized JSON, create a `THREE.ObjectLoader` to load the parsed objects, and add them back to the scene.

Note that this is a basic example and may not cover all possible scenarios <span style="color:#ff00cc;">...yadda yadda.</span>

## Position Update Not Working

<span style="color:lime;">It's because I'm reserializing &ndash; see below.</span>

I tried using `needsUpdate`.

But the `needsUpdate` property does not affect the position of the mesh.

It is used for notifying Three.js that certain attributes of the geometry or material have been updated and need to be reprocessed.

## Aha! Position not saved

If you're serializing and deserializing the scene using `scene.toJSON()`, you're correct that the position information of the mesh won't be included in the resulting JSON data.

The `toJSON()` method of Three.js excludes certain properties, including the position, rotation, and scale of objects.

### Serialize/Deserialize Additional Data

This is what people mean when they say "Use a Custom Serialization Approach".

You can manually collect the position information (and other necessary properties) of each mesh in the scene and include it as part of your serialized data.
    
During deserialization, you would create new mesh objects and set their properties based on the restored data.

```javascript
// Serializing
let serializedData = {
  meshes: []
};

scene.traverse((object) => {
  if (object instanceof THREE.Mesh) {
    serializedData.meshes.push({
      position: object.position.toArray()
      // Include other necessary properties
    });
  }
});

let jsonString = JSON.stringify(serializedData);

// Storing jsonString to the database

// Deserializing
let restoredData = JSON.parse(jsonString);

restoredData.meshes.forEach((meshData) => {
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.fromArray(meshData.position);
  // Set other necessary properties

  scene.add(mesh);
});
```

<br>

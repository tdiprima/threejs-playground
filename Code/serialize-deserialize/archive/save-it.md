## Serialize and Deserialize in Three.js

<span style="color:#0000dd;">In fabric.js, we can serialize and deserialize our canvas, in order to save it to a database and restore it.  Can this be converted to three.js?</span>

```javascript
let canvas = new fabric.Canvas('c');
canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'red', top: 100, left: 100 }));

let c = canvas.toJSON();
let str = JSON.stringify(canvas);

canvas.clear();
canvas.loadFromJSON(c);
```

<br>
In Three.js, there isn't a built-in serialization and deserialization functionality like in fabric.js. However, you can still achieve similar functionality by manually storing and restoring the necessary properties of objects in your scene.

Below is a general guide on how you might approach saving a scene in Three.js to a database and later restoring it, considering that your scene is composed of simple objects like cubes (analogous to the rectangles in the Fabric.js example):

### 1. Setup Your Three.js Scene
First, you will need to create and render a scene using Three.js. Let's say you create a cube...

### 2. Serialize Scene
Then, you can convert your scene into a JSON object:

```javascript
const sceneJSON = scene.toJSON();
const sceneString = JSON.stringify(sceneJSON);
```

### 3. Deserialize Scene
Later, when you need to restore the scene, you can parse the JSON string and load it back into a scene:

```javascript
const loadedSceneJSON = JSON.parse(sceneString);
const loader = new THREE.ObjectLoader();
const loadedScene = loader.parse(loadedSceneJSON);

// Now you can use `loadedScene` to render or manipulate further
```

### Points to Consider:
- This simple example assumes you're working with basic objects. For complex objects, textures, or shaders, additional steps might be necessary during the serialization and deserialization process.
- If you have non-geometric data associated with your objects, you might need a custom serialization/deserialization process.
- Performance implications: Depending on the complexity and size of your scene, serialization and deserialization might be resource-intensive operations.

For a production environment, you may need to refine and handle various cases based on the actual content of your scenes. Ensure to read and understand the [Three.js documentation](https://threejs.org/docs/) to deal with different objects and data structures you'll be working with.

## Aha! Position not saved

If you're serializing and deserializing the scene using `scene.toJSON()`, you're correct that the position information of the mesh won't be included in the resulting JSON data.

The `toJSON()` method of Three.js excludes certain properties, including the position, rotation, and scale of objects.

### Serialize/Deserialize Additional Data

This is what people mean when they say "Use a Custom Serialization Approach".

You can manually collect the position information (and other necessary properties) of each mesh in the scene and include it as part of your serialized data.
    
During deserialization, you would create new mesh objects and set their properties based on the restored data.

```javascript
// with-position.html
let serializedData = { meshes: [] };

scene.traverse(object => {
  //...
});

restoredData.meshes.forEach(meshData => {
  //...
  scene.add(mesh);
});
```

<br>

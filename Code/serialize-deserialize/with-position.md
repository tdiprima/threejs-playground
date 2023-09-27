## Custom Serialization

<span style="color:#0000dd;">Buddy asserts that</span> the position of the cube or any other object should be retained when you serialize the `THREE.Scene` using `scene.toJSON()`, assuming you're moving the object itself and not just the camera or something else.

<span style="color:#0000dd;">He's wrong.  I double-checked our work with a nuevo.html example.</span>

Ensure that you're correctly setting the position of the cube and then serializing the scene. <span style="color:#0000dd;">Async? Nope. Checked it with a button.</span>

Note that the position should be set on the object itself (the cube, in this case) and not on the geometry. <span style="color:lime;">&check;</span>

### Example:

1. **Creating and Positioning the Cube:**

    ```javascript
    const cube = new THREE.Mesh(geometry, material);
    
    // Setting position of the cube
    cube.position.set(1, 2, 3);
    
    scene.add(cube);
    camera.position.z = 5;
    ```

2. **Serializing the Scene:**

    ```javascript
    const sceneJSON = scene.toJSON();
    const sceneString = JSON.stringify(sceneJSON);
    console.log(sceneString);  // You should see the cube's position in this JSON string
    ```

3. **Deserializing the Scene:**

    ```javascript
    const loadedSceneJSON = JSON.parse(sceneString);
    const loader = new THREE.ObjectLoader();
    const loadedScene = loader.parse(loadedSceneJSON);
    ```

    - After deserializing, you can inspect the `loadedScene` object to verify that the cube's position is retained. <span style="color:lime;">&check;</span>

### Possible Issues:

- Ensure you're working with the latest version of Three.js as different versions may behave differently. <span style="color:lime;">&check;</span>

- Ensure you're positioning the cube (or any object) itself and not its geometry or material. <span style="color:lime;">&check;</span>

- Ensure you're serializing the entire scene and not just a part of it. <span style="color:lime;">&check;</span>

If you still encounter issues, you might need to consider a custom serialization process where you manually save and restore the positions (and other properties) of each object in the scene. However, this should not be necessary for standard use-cases with Three.js.

## Custom Serialization

If you need to create a custom serialization process for any reason, you could manually extract and store the relevant data for each object:

```javascript
const customSerialization = {
    objects: scene.children.map(child => ({
        position: child.position,
        rotation: child.rotation,
        //...other properties
    })),
    //...other scene data
};
const customSerializationString = JSON.stringify(customSerialization);
```

And then manually recreate and position each object when deserializing:

```javascript
const customDeserialization = JSON.parse(customSerializationString);
customDeserialization.objects.forEach(objData => {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.copy(objData.position);
    //...set other properties
    loadedScene.add(cube);
});
```

<br>

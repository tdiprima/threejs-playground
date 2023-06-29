## instanceof

```js
type(image1); // Object. Brilliant.
image1 instanceof THREE.Object3D; // false
```

<br>

If `image2` is not an instance of `THREE.Object3D`, it means it is not a direct instance of the `Object3D` class or any of its subclasses. However, you can still determine its type by checking its constructor or using the `instanceof` operator with other potential classes or prototypes.

Here are a couple of approaches you can try to find out the type of `image2`:

1. <mark>**Checking the constructor:**</mark>

   ```javascript
   console.log(image2.constructor.name); // Texture
   ```

   This will log the name of the constructor function, which can provide insights into the type of the object.

2. **Using `instanceof`** with potential classes or prototypes:

   ```javascript
   console.log(image2 instanceof THREE.Mesh);
   console.log(image2 instanceof THREE.Sprite);
   console.log(image2 instanceof THREE.Group);   
   // Add more checks for other possible types
   ```

<br>

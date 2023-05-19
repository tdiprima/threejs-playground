## Perform the object intersection successfully using the Raycaster class

sync.html, pan\_and\_zoom-3.html

```js
const intersects = raycaster.intersectObjects([image1, image2, image3, image4]);
```

### Fixing intersectObjects TypeError

The error message you're encountering, "Uncaught TypeError: can't access property 'test', object.layers is undefined," typically occurs when the `intersectObjects` method of the `Raycaster` class is **used with objects** that do not have the `layers` property defined.

<span style="color:#0000dd;font-size:larger;">I fixed something upstream, and forgot to change the objects I'm passing to intersectObjects().  The End.</span>

The <mark>**`layers`**</mark> property is an optional feature in three.js that allows you to <mark>**selectively render objects**</mark> based on certain **layers.**

To resolve this issue, you can try the following steps:

1. Check if all the objects you are passing to `intersectObjects` have the `layers` property defined. Make sure `image1`, `image2`, `image3`, and `image4` are **instances of** the `Object3D` class or its subclasses.  <span style="color:#0000dd;font-weight:bold;">See: "instanceof".</span>

2. If the objects don't have the `layers` property defined, you can set it manually by adding `object.layers = new THREE.Layers();` for each object. This will **create a new `Layers` object** and assign it to the `layers` property of the object.

    <!-- NOTE!  INDENT TO KEEP THE ORDERED LIST. -->

   ```javascript
   image1.layers = new THREE.Layers();
   image2.layers = new THREE.Layers();
   image3.layers = new THREE.Layers();
   image4.layers = new THREE.Layers();
   ```

   By doing this, you are ensuring that the `layers` property is defined for each object and preventing the "object.layers is undefined" error.

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

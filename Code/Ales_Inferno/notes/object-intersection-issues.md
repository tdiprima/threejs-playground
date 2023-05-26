## Accessing Loaded Textures

<span style="color:#0000dd;">I'm loading a texture, and then I'm adding the mesh to a global array called clickableObjects, to be used later.  I am testing being able to access clickableObjects from outside TextureLoader.load().  I get "No" the first time, but if I refresh the page, I still get "No", but I am now able to pass the clickableObjects array to a raycaster and get a positive response.  How do I get this to work without having to refresh the page?</span>

The issue you're facing is due to the **asynchronous** nature of the `TextureLoader` function. When you load the texture, it takes some time to retrieve the image file, and the rest of your code continues to execute in the meantime. Therefore, when you check the length of `clickableObjects` immediately after calling `TextureLoader.load()`, the texture may not have been loaded yet, and the array will still be empty.

<span style="color:red;">Obviously.</span>

To ensure that you can access the `clickableObjects` array reliably, you need to perform any operations that rely on its content inside the callback function of `TextureLoader.load()`. Here's an updated version of your code:

```javascript
let clickableObjects = [];new THREE.TextureLoader().load('image1.jpg', function (texture) {  const geometry = new THREE.PlaneGeometry(1, 1);  const material = new THREE.MeshBasicMaterial({ map: texture });  const mesh = new THREE.Mesh(geometry, material);  mesh.scale.set(1.0, texture.image.height / texture.image.width, 1.0);  mesh.userData.interactive = true;  mesh.name = "image1";  scene.add(mesh);  clickableObjects.push(mesh);  // This goes inside the closure now  if (clickableObjects.length > 0) {    console.log("Yes", clickableObjects);  } else {    console.log("No", clickableObjects);  }  // Call any other functions or operations that depend on `clickableObjects` here});
```

<br>

By moving the code inside the callback function, you ensure that it will execute only after the texture has finished loading and the `clickableObjects` array has been populated. This way, you won't need to refresh the page to access the array.

<span style="color:#0000dd;">Gweat.  Now what happens when I have 4 images?  That means put the other 3 image generation stuff in there as well.  Cool.  "Div soup."</span> <span style="font-size:30px;">🍜</span> <span style="color:#0000dd;">This is all because I want the aspect ratio.</span>

## Perform the object intersection successfully using the Raycaster class

dust-to-dust.html, kool-aid-kids.html / kool2.js

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

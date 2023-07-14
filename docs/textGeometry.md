## Creating a TextGeometry

### Hello, cube? 🟩

```javascript
// font-text-geo.html
let textGeometry = new THREE.TextGeometry("Hewwo, Fwiday!", {
  font: new THREE.FontLoader().load("font.json"), // <- wrong
  size: 1, // Size of the text
  height: 0.1, // Thickness of the text
  curveSegments: 12, // Set the number of segments used for curve approximation
  bevelEnabled: false // Disable bevel
});

let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
let textMesh = new THREE.Mesh(textGeometry, material);
scene.add(textMesh);
```

## Fix! ❇️

The issue in your code is that you're not waiting for the font file to load before creating the `TextGeometry`. The `THREE.FontLoader().load()` function is asynchronous and requires a callback to handle the loaded font. Since the font hasn't loaded yet, the `TextGeometry` is not created correctly, and you see the default rotating cube instead.

To fix this issue, you can modify your code as follows (shove everything inside, including the stupid render function).

```javascript
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a loader for the font
let fontLoader = new THREE.FontLoader();
fontLoader.load("font.json", function (font) {
  // Create a TextGeometry using the loaded font
  let textGeometry = new THREE.TextGeometry("Hewwo!!", {
    font: font, // Pass the loaded font
    size: 1,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: false
  });

  // Create a material for the text
  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

  // Create a mesh using the text geometry and material
  let textMesh = new THREE.Mesh(textGeometry, material);

  // Add the text mesh to the scene
  scene.add(textMesh);

  function render() {
    requestAnimationFrame(render);
    textMesh.rotation.x += 0.01;
    textMesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  render();
});
```

<br>

By using the `fontLoader.load()` function and providing a callback, the `TextGeometry` creation is deferred until the font is successfully loaded. This ensures that the text will be correctly rendered on the screen instead of the rotating cube.


## Default font 🍃🍁🍂

No, it is not possible to create a `TextGeometry` in Three.js without using `THREE.FontLoader`. The `TextGeometry` class does not have a default font.

**`TextGeometry` requires a font** to generate the geometry for the specified text. The font data is typically loaded using the `THREE.FontLoader` class, which asynchronously loads a font file (usually in JSON format) and provides the necessary font data for creating the `TextGeometry` object.

Here's an example of using `THREE.FontLoader` to load a font and create a `TextGeometry`:

```javascript
// Load the font asynchronously
let fontLoader = new THREE.FontLoader();
fontLoader.load("font.json", font => {
  // Font loaded, create TextGeometry
  let textGeometry = new THREE.TextGeometry("Hewwo, Bear!", {
    font,
    size: 1,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: false
  });

  // Create material, mesh, and add to the scene (similar to the previous example)
});
```

<br>

In this example, we use the `fontLoader.load()` function to load the font asynchronously.

Once the font is loaded, the provided callback function is called.

Inside the callback, we create the `TextGeometry` using the loaded font and proceed with creating the material, mesh, and rendering the scene.

<br>

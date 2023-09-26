## Creating a TextGeometry

I think if you do it like this it makes it a cube or something.

```javascript
// fontLoader/font-text-geo.html
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

<br>
The issue in your code is that you're not waiting for the font file to load before creating the TextGeometry.

The `THREE.FontLoader().load()` function is asynchronous and requires a callback to handle the loaded font. Since the font hasn't loaded yet, the `TextGeometry` is not created correctly, and you see the default rotating cube instead.

To fix this issue, you can modify your code as follows:

<span style="color:#0000dd;font-size:larger;">Create a loader for the font, then shove everything inside it, including the render function.</span>

<a href="Code/fontLoader/font-text-geo.html">Code</a>

By using the `fontLoader.load()` function and providing a callback, the `TextGeometry` creation is deferred until the font is successfully loaded. This ensures that the text will be correctly rendered on the screen instead of the rotating cube.

<br>

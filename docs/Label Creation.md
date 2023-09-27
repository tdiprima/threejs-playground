## THREE.Texture(canvas)

fontLoader/create-label.html

<span style="color:#0000dd;">The code I'm using is shite, please rewrite it.</span>

Absolutely, let's try refining the code to resolve your issues. The division by `100` seems to be an attempt to scale the `PlaneGeometry` to a reasonable size in the Three.js scene. However, if this scaling doesn't achieve the desired effect, you might need to adjust it.

Here's a step-by-step walkthrough of the improved `createLabel` function:

1. **Create a Canvas**: Adjust the canvas width and height to match the text dimensions plus some padding if necessary.
2. **Draw Text**: Render the text onto the canvas, and ensure it's correctly positioned and sized.
3. **Create a Texture**: Create a `THREE.Texture` from the canvas and ensure it's updated.
4. **Create a Material**: Create a `THREE.MeshBasicMaterial` using the texture. You might need to adjust the material properties to get the desired visual effect.
5. **Create Geometry and Mesh**: Create a `THREE.PlaneGeometry` and `THREE.Mesh` with appropriate sizing and return it.

Below is an adjusted version of the `createLabel` function:

```javascript
function createLabel(text, fontSize, fontWeight, fontFamily) {

  // Yeah, remember - also do it here for some reason.
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  let metrics = context.measureText(text);  let textWidth = metrics.width;  canvas.width = textWidth;  canvas.height = fontSize * 1.2; // added some padding for text height

  // Reset font after resizing canvas
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  // transparent: true
  let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });

  // Instead of textWidth and fontSize (duh)  let geometry = new THREE.PlaneGeometry(canvas.width / 100, canvas.height / 100); // Adjust the scale factor as needed  return new THREE.Mesh(geometry, material);
}
```

### Key Points:

- Ensure the canvas has an appropriate size for the text. The `canvas.width` and `canvas.height` should be set to accommodate the text dimensions.
- Adjust the `context.fillText` call to properly position the text within the canvas.
- The scale factor in `THREE.PlaneGeometry` should be adjusted to ensure the text appears at the correct size in your Three.js scene. You might need to tweak the division by `100` to get the right scale.

### Testing:
- Ensure you test the function with different text strings, font sizes, and font weights to confirm it works as expected in various scenarios.
- Adjust the scaling factor and text positioning as necessary based on your testing.

Remember, the appearance of text in Three.js depends on various factors, including camera position, scene scaling, and the size of the renderer. Adjust the code as necessary to fit your specific application's requirements.

<br>

## Draw & Measure Lines

A reimagined version of the fabric.js program using three.js.

### Version 1:

```js
const length = Calculate.lineLength(startPoint.x, startPoint.y, endPoint.x, endPoint.y).toFixed(2);
const textGeometry = new THREE.TextGeometry(`Length ${length}`, { size: 0.1 });
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
text = new THREE.Mesh(textGeometry, textMaterial);
```

**`{ size: 0.1 }`:** Size of the text geometry is specified in 3D units.
0.1 means text geometry will have relatively small size compared to other objects in scene.To control the actual visual size of the text in the rendered scene, you would need to adjust the scale of the rendered text object using the `scale` property.

### Version 2: get rid of white box

Removes the white box and displays the text using a sprite:

```js
const length = Calculate.lineLength(startPoint.x, startPoint.y, endPoint.x, endPoint.y).toFixed(2);const textTexture = createTextTexture(`Length ${length}`);const spriteMaterial = new THREE.SpriteMaterial({ map: textTexture });text = new THREE.Sprite(spriteMaterial);text.scale.set(0.4, 0.2, 1);


function createTextTexture(text) {  const canvas = document.createElement('canvas');  const context = canvas.getContext('2d');  context.font = 'Bold 20px Arial';    const textMetrics = context.measureText(text);  const width = textMetrics.width;  const height = 24;    canvas.width = width;  canvas.height = height;    context.font = 'Bold 20px Arial';  context.fillStyle = 'white';  context.fillText(text, 0, height / 2 + 5);    const texture = new THREE.Texture(canvas);  texture.needsUpdate = true;    return texture;}
```

**`text.scale.set(0.4, 0.2, 1)`:** Set 0.4 as the scale along the X-axis, 0.2 as the scale along the Y-axis, and 1 as the scale along the Z-axis, since we want the text to be wider than it is tall.
Adjust the scale property of the sprite as needed to control the size of the text.
**`createTextTexture(text)`:** Generate a texture by creating a canvas, drawing the text onto it, and then use that canvas as a texture for the sprite material.

If you change the font size...

```js
context.font = 'Bold 20px Arial'
```

Don't forget to also update the `text.scale` property accordingly in the `onMouseMove` function, to ensure the text remains visible and properly scaled relative to the scene.

## wtf is this white box?

In the given example, there isn't actually a "box" being drawn. The term "box" might be a bit misleading. The code is simply using a `THREE.Line` object to create a line segment between two points, giving the appearance of a line.

The line is created using the `lineGeometry` which is defined as `new THREE.BufferGeometry()`, and the `lineMaterial` is defined as `new THREE.LineBasicMaterial({ color: 0x00ff00 })`. The `LineBasicMaterial` allows you to specify the color of the line. In this case, it's set to green (`0x00ff00`), indicating that the line will be rendered in green color.

As for the text, the color is set in the `textMaterial` using `new THREE.MeshBasicMaterial({ color: 0xffffff })`. Here, `0xffffff` represents white color. So, the text will be rendered in white.

To clarify, there is no actual box being drawn in this example. It's just a line segment and some text rendered in the scene.## I don't think so, Tim

ok.  then the white "box" I'm seeing may be an artifact.  on mousedown, a white square appears at the cursor.  when i drag the mouse, a green line does get drawn, and this white box moves.  i want to see text there; not a box.

Apologies for the confusion. The white square artifact you're seeing is likely due to the default behavior of the browser when handling the `mousedown` event. It might be rendering a visual indication of the click event.

To remove the white square artifact, you can prevent the default behavior of the `mousedown` event. Update the `onMouseDown` function as follows:

```javascript
function onMouseDown(event) {
  event.preventDefault(); // Prevent default behavior
  
  isDrawing = true;
  
  startPoint = getMouseCoordinates(event);
  startVector = new THREE.Vector3(startPoint.x, startPoint.y, 0);
  
  lineGeometry.setFromPoints([startVector, startVector]);
  line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
}
```

By calling `event.preventDefault()`, you prevent the default behavior of the browser, which removes the unwanted visual artifact.

After making this change, the white square should no longer appear, and you should be able to see the green line and the text as intended.

<span style="color:#0000dd;">No.  Not only did it not work (as I suspected), but now it's like pulling teeth to draw the darn line.  Why is this so hard?</span>

<br>

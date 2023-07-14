## THREE.Texture(canvas)

```js
// create-label.html
function createLabel(text, fontSize, fontWeight, fontFamily) {
  let canvas = document.createElement("canvas");
  let context = canvas.getContext("2d");

  let metrics = null;
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  metrics = context.measureText(text);
  let textWidth = metrics.width;

  // Background
  context.fillStyle = "rgba(255, 255, 255, 0.8)";
  context.fillRect(0, 0, textWidth, fontSize);

  // Text
  context.fillStyle = "black";
  context.fillText(text, 0, fontSize);

  // Create texture
  let texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  // Material, geometry, mesh
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  let geometry = new THREE.PlaneGeometry(textWidth / 100, fontSize / 100);
  let mesh = new THREE.Mesh(geometry, material);

  return mesh;
}
```

## Explain context.font and PlaneGeometry

1. When setting the **`context.font`** property, you should use the desired font size followed by the unit of measurement.

    In the given code, `${fontSize}px` is used, which means the font size is specified in **pixels.**

2. In the code, `textWidth / 100` and `fontSize / 100` are used to calculate the dimensions of the `PlaneGeometry`.

    It seems that the code **assumes a certain relationship** between the canvas size (determined by `textWidth`) and the desired size of the label in the three.js scene.

By dividing `textWidth` by 100 and `fontSize` by 100, the code might be attempting to **scale down** the dimensions of the `PlaneGeometry` to fit within a reasonable range for a label in the scene. This scaling factor of 100 appears to be an arbitrary choice, and the exact reasoning behind it depends on the specific requirements of the scene and how the labels are being used.

You can adjust this **scaling factor** to fit your specific needs. If you want larger labels, you can increase the scaling factor (e.g., `textWidth / 50`, `fontSize / 50`). Conversely, if you want smaller labels, you can decrease the scaling factor (e.g., `textWidth / 200`, `fontSize / 200`). Experiment with different values to achieve the desired size and proportions for your labels in the three.js scene.

## Point or Pixels

<span style="color:#0000dd;">When setting font size, do people generally prefer to use "point" or "pixels".</span>

<span style="color:#0000dd;">(Pixels makes sense, but there are other measurements too.)</span>

<span style="color:#0000dd;">And he couldn't say which is used the most.</span> <span style="font-size:27px;">🤠</span>

**Pixels (px)** are a relative unit of measurement that corresponds directly to the pixels on a screen. If you set a font size to 12px, it will be 12 pixels tall on most screens. Pixels provide precise control over the size of the text and ensure consistent rendering across different devices and resolutions.

**Points (pt)**, on the other hand, are a unit of measurement commonly used in print media. One point is equivalent to 1/72 of an inch. In CSS, one point is approximately equal to 1.33 pixels (96 pixels per inch divided by 72 points per inch). So, if you set a font size to 12pt, it will be approximately 16 pixels tall on most screens.

If you are designing for the **web** and want to have precise control over the size of the text, pixels are generally preferred. If you are designing for **print** or have specific requirements related to physical sizes, points may be more appropriate.

It's worth noting that using relative units like **em** (em) or **rem** (root em) can also provide flexibility and responsiveness, as they scale with the parent elements or the root element, respectively.

<br>

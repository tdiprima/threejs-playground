## Brush-Based Outlining Technique

The technique you're referring to, where the inside of the brush is clear and the circumference of the brush is used to draw an outline, is commonly known as **"brush-based outlining"** or **"brush-based annotation."** It is a widely used approach in various image annotation and segmentation tasks.

If you're developing a web-based application, you might use JavaScript and HTML5 canvas for the drawing functionality.

Alternatively, if you're working with a specific graphics library or framework, you can consult their documentation for more guidance on handling mouse events and drawing operations.

It's worth noting that [QuPath](https://github.com/qupath/qupath) is open source, so you can explore its source code on GitHub to see how they have implemented their brush-based outlining tool. This can serve as a valuable reference to understand the underlying techniques and algorithms used in their implementation.

### Leaflet

Supposedly [leaflet.js](https://leafletjs.com/plugins.html) has it.  OK, where??

## Example

Outline Brush Stroke (to achieve the effect of a continuous brush stroke with just the outline).

Enabling brush-based outlining on the canvas.

He has not been able to provide one working example of what I want, so we're done. :(

```js
drawOnImage();

let size = 25;
let color = "black";

function drawOnImage(image = null) {
  let canvasElement = document.getElementById("myCanvas");
  let context = canvasElement.getContext("2d");

  let isDrawing = false;

  canvasElement.onmousedown = (e) => {
    isDrawing = true;
    startDrawing(e.clientX, e.clientY);
  };

  canvasElement.onmousemove = (e) => {
    if (isDrawing) {
      continueDrawing(e.clientX, e.clientY);
    }
  };

  canvasElement.onmouseup = () => {
    isDrawing = false;
  };

  function startDrawing(x, y) {
    context.beginPath();
    context.moveTo(x, y);
  }

  function continueDrawing(x, y) {
    context.lineTo(x, y);
    context.lineWidth = size / 4; // Adjust the line thickness as desired
    context.strokeStyle = color;
    context.stroke();
  }
}
```

### Spark Joy

This is just a small line example to play with.

```js
function fat_line() {
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  ctx.lineWidth = 20; // Adjust the line width as needed
  ctx.strokeStyle = 'black'; // Set stroke color to black
  // ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // Transparent fill
  ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // White fill

  ctx.beginPath();
  ctx.moveTo(50, 50); // Starting point of the line
  ctx.lineTo(250, 50); // Ending point of the line

  ctx.stroke();
}
```

## Where is the qupath implementation?

ack -iwl brush
**qupath-gui-fx/src/main/java/**
qupath/lib/gui/prefs/PathPrefs.java
qupath/lib/gui/viewer/tools/PathTools.java
qupath/lib/gui/viewer/tools/QuPathPenManager.java
qupath/lib/gui/viewer/tools/BrushTool.java
qupath/lib/gui/QuPathGUI.java
qupath/lib/gui/panes/PreferencePane.java

**BrushTool.java** &ndash; I read the darn thing, but it doesn't make any sense, where is the !@##$ drawing stuff??

qupath-gui-fx/src/main/java/qupath/lib/gui/QuPathGUI.java

```java
/**
 * Brush tool action
 */
@ActionAccelerator("b")
@ActionDescription("Click and drag to paint with a brush. " +
    "By default, the size of the region being drawn depends upon the zoom level in the viewer.")
public final Action BRUSH_TOOL = getToolAction(PathTools.BRUSH);
```

qupath-gui-fx/build/docs/javadoc/qupath/lib/gui/QuPathGUI.DefaultActions.html

build/docs-merged/javadoc/qupath/lib/gui/QuPathGUI.DefaultActions.html

### Hollow Brush!

[How To Make an OUTLINE BRUSH In Procreate](https://youtu.be/VPZJTXhg5po)

[How to Paint with Code: Creating Your Brushes](https://library.superhi.com/posts/how-to-paint-with-code-creating-paintbrushes)

### Articles

[Best Image Annotation Tools of 2023](https://www.v7labs.com/blog/best-image-annotation-tools)

[Medical Image Annotation](https://www.v7labs.com/medical-imaging-annotation)

[How to Paint with Code: Creating Your Brushes](https://library.superhi.com/posts/how-to-paint-with-code-creating-paintbrushes)

### Keywords

* "stroke outlining"?
* "outline brush"?

<br>

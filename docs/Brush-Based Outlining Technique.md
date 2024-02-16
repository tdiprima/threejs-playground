## Brush-Based Outlining Technique

The technique you're referring to, where the inside of the brush is clear and the circumference of the brush is used to draw an outline, is commonly known as **"brush-based outlining"** or **"brush-based annotation."** It is a widely used approach in various image annotation and segmentation tasks.

If you're developing a web-based application, you might use JavaScript and HTML5 canvas for the drawing functionality.

Alternatively, if you're working with a specific graphics library or framework, you can consult their documentation for more guidance on handling mouse events and drawing operations.

It's worth noting that [QuPath](https://github.com/qupath/qupath) is open source, so you can explore its source code on GitHub to see how they have implemented their brush-based outlining tool. This can serve as a valuable reference to understand the underlying techniques and algorithms used in their implementation.

# Leaflet Plugin

[leaflet-paintpolygon](https://github.com/tcoupin/leaflet-paintpolygon.git)

<span style="color:blue;font-size:larger;">He has not been able to provide one working example of what I want, so we're done. :(</span>

## Where is the qupath implementation?

```sh
ack -iwl brush
qupath-gui-fx/src/main/java/ # ****
qupath/lib/gui/prefs/PathPrefs.java
qupath/lib/gui/viewer/tools/PathTools.java
qupath/lib/gui/viewer/tools/QuPathPenManager.java
qupath/lib/gui/viewer/tools/BrushTool.java
qupath/lib/gui/QuPathGUI.java
qupath/lib/gui/panes/PreferencePane.java
```

**BrushTool.java** &mdash; I read the darn thing, but it doesn't make any sense, where is the drawing stuff?

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

### Keywords

* "stroke outlining"?
* "outline brush"?
* hollow brush

<span style="color:lime;font-size:larger;">First, draw with CircleGeometry. Then, store the center point and radius. Next,  use JSTS to calculate the union. Then visualize the union with a line.  Finally, remove all the circles.</span>

<br>

## Thursday, February 1, 2024

<span style="color:#59acf3;font-size:larger;">merged_circle.html</span> asks for 2 overlapping circles, then get the perimiter, then outline the perimeter in red as a sanity check.

<!--
Using the three.js javascript library, how would I draw a 2D circular geometry?
Now if I drew another circle that overlapped with this one, is there a function that can merge the geometries of Circle A and Circle B?
-->

https://www.nayuki.io/page/convex-hull-algorithm

https://github.com/mauriciopoppe/quickhull3d

This looks promising: https://github.com/bjornharrtell/jsts

https://bjornharrtell.github.io/jsts/

It's a java script port of Java JTS.

```js
var union = a.union(b)
```

and it supports WKT...yes...this looks very promising

## JSTS

<span style="color:blue;font-size:larger;">Using JSTS.js, create two green circle geometries, A and B, and then show the Union of A and B with a blue line.</span>

To achieve this task, you can follow these steps:

1. Include the JSTS library in your HTML file by adding the following script tag

    ```html
    <script src="https://unpkg.com/jsts/dist/jsts.min.js"></script>
    ```

2. Add an HTML canvas element to draw the circles and the union line

3. Create a JavaScript script that defines the two circle geometries, calculates their union, and draws them on the canvas

<span style="color:#59acf3;font-size:larger;">jsts1.html</span>

This script creates two green circles (geometries A and B) and calculates their union. The union's boundary is then drawn with a blue line on the canvas. Note that you might need to adjust the circle's center coordinates and radius values depending on the size and layout of your canvas.

## JSTS and three

To translate the given script to Three.js, using `CircleGeometry` for rendering circles and potentially using `jsts.js` for calculating the union of circles (and then displaying the union with a blue line), you'll follow these steps:

1. **Create Circle Geometries in Three.js**: Use `THREE.CircleGeometry` to create geometries for circles A and B.

2. **Use JSTS for Union Calculation**: Although JSTS operates on 2D geometries and is typically used with coordinate data, you can still use its logic to calculate the union of the circles. Since `THREE.CircleGeometry` is for rendering and doesn't directly provide a method to calculate geometrical unions, you'll simulate the circles' positions and radii in JSTS for the union calculation, similar to your original script.

3. **Render Union Outline in Three.js**: Use `THREE.Line` or `THREE.LineSegments` with `THREE.BufferGeometry` to render the union's outline calculated by JSTS.

Here's a conceptual translation into Three.js, keeping in mind that you'll need both Three.js and JSTS libraries loaded in your environment:

<span style="color:#59acf3;font-size:larger;">jsts2.html</span>

### Key Points:

- **Circle Representation**: In Three.js, circles are represented as `THREE.CircleGeometry` and added as `THREE.Mesh` objects to the scene. They are visual representations and do not directly correspond to geometrical shapes in computational geometry terms.

- **Union Calculation**: The union calculation is done using JSTS, similarly to your original script. Note that JSTS operates on geometrical data, not on Three.js objects. Therefore, you simulate the circles in JSTS for the union calculation and then visualize the result in Three.js.

- **Union Visualization**: The union's outline calculated by

 JSTS is visualized using `THREE.LineLoop` in Three.js, based on the coordinates obtained from JSTS's union result.

This approach demonstrates how to combine JSTS for computational geometry with Three.js for visualization, translating 2D geometric operations into a 3D visualization context.


## Deleting the circles on mouseup

<span style="color:#59acf3;font-size:larger;">blue-dot.html</span>

To delete the circles from the scene when the mouse button is released (`mouseup` event), you can modify the `stopDrawing` function to not only calculate and draw the union but also clear the circles that were drawn during the session. Since you're adding each drawn circle to a `THREE.Group` (`brushShapeGroup`), you can simply remove all children from this group as part of the `mouseup` event handling. Here's how you can do it:

### Update the `stopDrawing` Function

In the `stopDrawing` function, after calculating and potentially drawing the union, remove all children from `brushShapeGroup`. This can be done by repeatedly calling `.remove()` on the group for each of its children until it has no children left, or by setting its `children` array to an empty array. Here's an updated version of `stopDrawing` incorporating this logic:

```javascript
function stopDrawing() {
    drawing = false;
    const unionGeometry = calculateUnion(); // Calculate the union of all drawn circles
    if (unionGeometry) {
        drawUnion(unionGeometry); // Visualize the union
    }
    circles = []; // Reset circle data for the next drawing session

    // Remove all circles from the scene
    while(brushShapeGroup.children.length > 0){
        brushShapeGroup.remove(brushShapeGroup.children[0]);
    }
}
```

This approach removes each circle added to `brushShapeGroup` during the drawing phase, effectively clearing the drawn circles from the scene once the mouse button is released.

### Considerations

- **Performance**: If you're dealing with a very large number of circles, this removal process is efficient enough for most cases. However, if performance becomes an issue, other strategies, like object pooling (reusing geometries, materials, and meshes rather than creating and destroying them), might be considered.
- **Scene Management**: This method removes the circles from the scene, but it doesn't free up the memory associated with the geometries and materials used by those circles. If your application creates and destroys a lot of geometries and materials, you might also want to explicitly dispose of those resources to avoid memory leaks. Here's how you could extend the removal loop to include disposal:

```javascript
while (brushShapeGroup.children.length > 0) {
    let child = brushShapeGroup.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
    brushShapeGroup.remove(child);
}
```

- **Resetting `brushShapeGroup`**: After clearing the circles, `brushShapeGroup` is ready for the next drawing session. There's no need to recreate it unless you specifically want to remove and recreate the group for some reason.

By following these steps, you'll ensure that the drawn circles are removed from the scene when the user finishes drawing, keeping the scene clean for subsequent actions.


## From Scratch

To create a feature allowing users to draw a polygon by merging circles in real-time, with the merged areas having a transparent blue fill and the interior being clear, you can follow these steps:

- **Capture User Input**:
  - Listen for mouse or touch events on a canvas.
  - Allow users to place circles on the canvas, storing each circle's position and radius.

- **Merge Circles Dynamically**:
  - Use computational geometry to calculate the union of all circles drawn by the user.
  - This may involve approximating circles as polygons and merging these polygons.

- **Calculate and Render the Outline**:
  - After merging, calculate the outline of the resulting shape.
  - This can be done by tracing the outer edges of the merged geometry.

- **Fill and Transparency**:
  - Render the merged shape with a transparent blue fill using Three.js materials with `opacity` and `transparent` properties set accordingly.

- **Clear the Interior**:
  - To ensure the interior remains clear, focus on rendering only the outline or edges of the shape.
  - Use `EdgesGeometry` and `LineBasicMaterial` in Three.js to create and render the outline.

- **Use of Shaders**:
  - Implement custom shaders with Three.js for more complex visual effects, like dynamically highlighting edges or creating specific fill patterns.

- **Optimization and Updates**:
  - Continuously update the geometry as new circles are added by the user.
  - Optimize real-time rendering performance, especially when recalculating the merged shape and its outline.

- **Libraries and Tools**:
  - Consider using external computational geometry libraries if necessary for efficient merging and union calculations.
  - Explore Three.js examples for custom shader materials and edge rendering techniques.

This approach combines user interaction, dynamic geometry computation, and advanced rendering techniques to create a visually interactive and intuitive drawing tool.


## Computational Geometry Libraries

Note that this example assumes both circles lie on the same plane (Z=0) and uses 2D coordinates for JSTS calculations. If you need to work with truly 3D geometries, you'll need to use a 3D geometry library, such as [three.js-csg](https://github.com/manthrax/THREE-CSGMesh), which offers CSG (Constructive Solid Geometry) operations for Three.js geometries.

Here's a basic example of creating a circular shape with a hole...
For more complex shapes, especially when dealing with merged geometries from arbitrary sources, you might need a computational geometry library that supports boolean operations like union, intersection, and difference. These operations can help you define the resulting shape with the desired holes by performing a difference operation between the outer shape and an inner shape.

Libraries like `CSG.js` (Constructive Solid Geometry) can perform these operations, but integrating them with Three.js might require converting between Three.js geometries and the library's format. After performing the operation, you would convert the result back to a Three.js geometry to be rendered.

**Dynamically Merge Circles into a Polygon:** As the user adds circles, dynamically calculate the union of these circles to create a single, complex shape. This involves computational geometry operations not natively supported by Three.js but can be achieved using external libraries that perform boolean operations on shapes (e.g., CSG.js for Constructive Solid Geometry) or custom algorithms designed to handle circle unions.

## Edges

Use `EdgesGeometry` and `LineBasicMaterial` to create and render the outline.

```js
// Pseudocode for rendering the merged shape outline in Three.js

// Assuming `mergedShapeGeometry` is the geometry of the merged circles
const material = new THREE.MeshBasicMaterial({
  color: 0x0000ff, // Blue color
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide
});

const mergedShape = new THREE.Mesh(mergedShapeGeometry, material);

// To create an outline, you could use `EdgesGeometry` to generate an edge-only geometry
const edges = new THREE.EdgesGeometry(mergedShapeGeometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff }); // White outline
const outline = new THREE.LineSegments(edges, lineMaterial);

scene.add(mergedShape);
scene.add(outline);
```

<br>

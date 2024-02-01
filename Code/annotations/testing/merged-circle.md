## Thursday February 1, 2024

https://www.nayuki.io/page/convex-hull-algorithm

https://github.com/mauriciopoppe/quickhull3d

This looks promising: https://github.com/bjornharrtell/jsts

https://bjornharrtell.github.io/jsts/

It's a java script port of Java JTS.

```js
var union = a.union(b)
```

and it support WKT...yes...this looks very promising

<span style="color:blue;font-size:larger;">using JSTS, create two geometries given the external points in the arrays a and b</span>

To create two geometries using JSTS from points defined in arrays `a` and `b`, you will first need to construct `JSTS` geometry objects from these points. Let's assume `a` and `b` are arrays of coordinates, where each coordinate is an array of two numbers representing x (longitude) and y (latitude) values.
Here's a step-by-step guide to achieve this, m'lord:

1. **Include JSTS in Your Project**: First, ensure JSTS is included in your project. If you're using Node.js, you can install it via npm. For browser-based projects, include JSTS with a script tag.

   Via npm:

   ```bash
   npm install jsts
   ```

   In HTML:

   ```html
   <script src="https://unpkg.com/jsts/dist/jsts.min.js"></script>
   ```

2. **Create Geometries from Points**:

   ```javascript
   // Assuming 'a' and 'b' are arrays of [x, y] coordinates
   var a = [[x1, y1], [x2, y2], ...];
   var b = [[x3, y3], [x4, y4], ...];
   // Initialize JSTS geometry factory
   var geometryFactory = new jsts.geom.GeometryFactory();
   // Function to convert a point array to a JSTS LinearRing
   function toLinearRing(pointArray) {
     let coordinates = pointArray.map(point => new jsts.geom.Coordinate(point[0], point[1]));
     return geometryFactory.createLinearRing(coordinates);
   }
   // Create JSTS LinearRings from the point arrays
   var linearRingA = toLinearRing(a);
   var linearRingB = toLinearRing(b);
   // Create polygon geometries from the LinearRings
   var polygonA = geometryFactory.createPolygon(linearRingA);
   var polygonB = geometryFactory.createPolygon(linearRingB);
   ```

3. **Handling Polygon Closure**: Ensure that your point arrays `a` and `b` form closed loops. The first and last points of each array should be the same to represent a closed polygon.

4. **Use the Geometries**: Once you have `polygonA` and `polygonB`, you can use them for various geometric operations supported by JSTS, such as intersection, union, difference, etc.
This example assumes that the arrays `a` and `b` are properly formatted and contain valid coordinate pairs for constructing polygons. JSTS operations can be quite complex and powerful, allowing for a wide range of spatial computations and analyses.

<span style="color:blue;font-size:larger;">Yeah. Right.</span>

<span style="color:blue;font-size:larger;">Using JSTS.js, create two green circle geometries, A and B, and then show the Union of A and B with a blue line.</span>

To achieve this task, you can follow these steps:

1. Include the JSTS library in your HTML file by adding the following script tag

2. Add an HTML canvas element to draw the circles and the union line

3. Create a JavaScript script that defines the two circle geometries, calculates their union, and draws them on the canvas

<span style="color:#59acf3;font-size:larger;">jsts1.html</span>

This script creates two green circles (geometries A and B) and calculates their union. The union's boundary is then drawn with a blue line on the canvas. Note that you might need to adjust the circle's center coordinates and radius values depending on the size and layout of your canvas.

<span style="color:blue;font-size:larger;">Can jsts be integrated with three.js in order to do the same thing with 2 overlapping circlegeometries?</span>

Yes, JSTS can be integrated with Three.js to perform similar operations on 3D geometries. However, since JSTS is a 2D geometry library, you'll need to project your 3D geometries to 2D for calculations and then map the results back to 3D space. In this example, I'll show you how to perform a union of two overlapping circles in 3D using Three.js and JSTS:

1. Include the Three.js library and JSTS library in your HTML file:

2. Add a div element to place the Three.js renderer:

3. Create a JavaScript script to set up the 3D scene and integrate JSTS with Three.js:

<span style="color:#59acf3;font-size:larger;">jsts2.html</span>

This script sets up a 3D scene using Three.js, creates two overlapping circle geometries, and calculates their union using JSTS. The union's boundary is then converted into a Three.js shape, and a mesh is created and added to the scene. The camera is positioned, and the scene is rendered.

Note that this example assumes both circles lie on the same plane (Z=0) and uses 2D coordinates for JSTS calculations. If you need to work with truly 3D geometries, you'll need to use a 3D geometry library, such as [three.js-csg](https://github.com/manthrax/THREE-CSGMesh), which offers CSG (Constructive Solid Geometry) operations for Three.js geometries.

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

<br>

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

<br>

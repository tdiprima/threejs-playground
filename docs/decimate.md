## Reduce Points

`fabric.PencilBrush` attribute called `decimate`

In the free drawing brush there is a parameter that will try to do so, removing all the points that are less than one pixel distant from one to another. You can reduce that parameter to 0 for no simplification.

The parameter is called decimation and is default at 0.4 pixels.

<span style="color:#0000dd;">I know I did this manually, but where to find it...</span>

### Straight Outta Fabric.js

```js
/**
 * Discard points that are less than `decimate` pixel distant from each other
 * @type Number
 * @default 0.4
 */
let decimate = 0.4;

/**
 * Decimate points array with the decimate value
 */
function decimatePoints(points, distance) {
  if (points.length <= 2) {
    return points;
  }
  var zoom = this.canvas.getZoom(),
    adjustedDistance = Math.pow(distance / zoom, 2),
    i, l = points.length - 1,
    lastPoint = points[0],
    newPoints = [lastPoint],
    cDistance;
  for (i = 1; i < l - 1; i++) {
    cDistance = Math.pow(lastPoint.x - points[i].x, 2) + Math.pow(lastPoint.y - points[i].y, 2);
    if (cDistance >= adjustedDistance) {
      lastPoint = points[i];
      newPoints.push(lastPoint);
    }
  }
  /**
   * Add the last point from the original line to the end of the array.
   * This ensures decimate doesn't delete the last point on the line, and ensures the line is > 1 point.
   */
  newPoints.push(points[l]);
  return newPoints;
}

/**
 * On mouseup after drawing the path on contextTop canvas
 * we use the points captured to create an new fabric path object
 * and add it to the fabric canvas.
 */
function _finalizeAndAddPath() {
  var ctx = this.canvas.contextTop;
  ctx.closePath();
  if (this.decimate) {
    this._points = this.decimatePoints(this._points, this.decimate);
  }
  var pathData = this.convertPointsToSVGPath(this._points);
  if (this._isEmptySVGPath(pathData)) {
    // do not create 0 width/height paths, as they are
    // rendered inconsistently across browsers
    // Firefox 4, for example, renders a dot,
    // whereas Chrome 10 renders nothing
    this.canvas.requestRenderAll();
    return;
  }

  var path = this.createPath(pathData);
  this.canvas.clearContext(this.canvas.contextTop);
  this.canvas.fire('before:path:created', {
    path: path
  });
  this.canvas.add(path);
  this.canvas.requestRenderAll();
  path.setCoords();
  this._resetShadow();


  // fire event 'path' created
  this.canvas.fire('path:created', {
    path: path
  });
}
```

### I can explain...

```js
const _points0 = fabPath.path.map(item => ({
  x: item[1],
  y: item[2]
}));

// THERE ARE WAY TOO MANY POINTS; REDUCE THEM:
let points = _points0.reduce(
  function(accumulator, currentValue, currentIndex) {
    if (currentIndex % 7 === 0)
      accumulator.push(currentValue);
    return accumulator;
  }, []);
```

## Try it in Three.js

In three.js, there isn't a built-in function specifically dedicated to reducing the number of points in a line based on their proximity. However, you can implement a similar functionality by manually iterating over the points and removing those that are close to each other.

Here's an example of how you could achieve this:

```javascript
function reducePoints(lineGeometry, thresholdDistance) {
  var positions = lineGeometry.attributes.position.array;
  var numPoints = positions.length / 3;

  var indicesToRemove = [];

  for (var i = 0; i < numPoints - 1; i++) {
    var currentPoint = new THREE.Vector3(
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2]
    );

    var nextPoint = new THREE.Vector3(
      positions[(i + 1) * 3],
      positions[(i + 1) * 3 + 1],
      positions[(i + 1) * 3 + 2]
    );

    var distance = currentPoint.distanceTo(nextPoint);

    if (distance < thresholdDistance) {
      indicesToRemove.push(i + 1);
    }
  }

  for (var i = indicesToRemove.length - 1; i >= 0; i--) {
    var indexToRemove = indicesToRemove[i];

    positions.splice(indexToRemove * 3, 3);
  }

  lineGeometry.setDrawRange(0, positions.length / 3);
  lineGeometry.attributes.position.needsUpdate = true;
}
```

<br>

In this example, the `reducePoints` function takes a `lineGeometry` object, representing the geometry of the line, and a `thresholdDistance`, which specifies the minimum distance between points that should be maintained. The function iterates over the points in the geometry and checks the distance between consecutive points. If the distance is less than the threshold, it adds the index of the next point to the `indicesToRemove` array. Finally, it removes the points at the specified indices, updates the draw range of the geometry, and sets the `needsUpdate` flag to true.

Note that this implementation assumes that you're using `THREE.Line` or `THREE.LineSegments` with `THREE.BufferGeometry`. Adjustments may be necessary if you're using a different type of geometry or material.

<br>

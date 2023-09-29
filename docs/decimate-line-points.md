## Decimate Line Points

<span style="color:#59acf3;font-size:larger;">etch-a-sketch/qux.js</span>

If you have a `THREE.Line` geometry in three.js and you want to extract every third set of \(x, y, z\) coordinates (i.e. every third point) from its position attribute, you can achieve this with a loop that iterates over the flat array of points with a step of 9 (since each point consists of three coordinates and you want to extract every third point).

Here's an example of how you might achieve this:

```javascript
let originalArray = line.geometry.attributes.position.array;
let decimatedArray = [];

for (let i = 0; i < originalArray.length; i += 9) {
  decimatedArray.push(originalArray[i], originalArray[i + 1], originalArray[i + 2]);
}

// If you want to create a new THREE.BufferAttribute with the decimated array
let decimatedAttribute = new THREE.BufferAttribute(new Float32Array(decimatedArray), 3);

// If you want to create a new THREE.BufferGeometry with the decimated attribute
let decimatedGeometry = new THREE.BufferGeometry();
decimatedGeometry.setAttribute('position', decimatedAttribute);
```

Explanation of the code:

1. `originalArray` is the flat array of \(x, y, z\) coordinates from your `line.geometry`.
2. An empty `decimatedArray` is initialized to store the decimated points.
3. A `for` loop iterates over `originalArray` with a step of 9. For each iteration, it extracts the \(x, y, z\) coordinates of every third point and pushes them to `decimatedArray`.
4. If you wish, you can create a new `THREE.BufferAttribute` with `decimatedArray` and then set it as the position attribute of a new `THREE.BufferGeometry`.

Remember that the original geometry should contain a sufficient number of points for the decimation to be meaningful. Ensure to adjust your loop's step size and indexing if you change the decimation factor.

```js
// Check the length of the array first
if (points.length <= 3) {
  return points;
}
```

<br>
<hr>
<br>

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

### "I can explain..."

```js
const fabPath = {}; // Path object
const _points0 = fabPath.path.map(item => ({
  x: item[1],
  y: item[2]
}));

// THERE ARE WAY TOO MANY POINTS; REDUCE THEM:
const points = _points0.reduce((accumulator, currentValue, currentIndex) => {
  if (currentIndex % 7 === 0) {
    accumulator.push(currentValue);
  }
  return accumulator;
}, []);

console.log(points.length, points);
```

## Simplify.js

By incorporating a library like `Simplify.js`, you can effectively reduce the number of points while retaining the shape of the line.

<span style="color:#59acf3;font-size:larger;">Ales_Inferno/js/reduce-points.js</span>

## When you get this error

THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.

Make sure that your points array contains the correct number of values (divisible by 3 for x,y,z) and that none of them are NaN to avoid the error.

<br>

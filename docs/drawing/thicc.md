## Line Thickness

**NOTE!** The non-native Line objects don't work in **Chrome.**  It thinks it can't find those files.
(Just *my* repo. Gweat.)  Chrome and regular Firefox don't work.  Firefox Dev and Safari both work.

### Raycasting Issue with Line2

```js
let intersects = raycaster.intersectObjects(scene.children, true)
```

<span style="color:#0000dd;">"Uncaught TypeError: can't access property "count", instanceStart is undefined".</span>

The error suggests that there might be an issue with the objects you're trying to perform raycasting on. Changing `THREE.Line` to `Line2` might be the cause of the problem.

**`Line2` is not a native object type** in Three.js but rather a separate extension library called `THREE.Line2`.

<mark>It's possible that `Line2` objects don't have the necessary properties for raycasting that are expected by the `raycaster.intersectObjects()` method.</mark>

1. Use `THREE.Line` instead: Revert your code back to using `THREE.Line` objects instead of `Line2`. This way, you can rely on the built-in raycasting functionality provided by Three.js.

2. Implement custom raycasting for `Line2` objects: If you really need to use `Line2` objects and their unique features, you can create a custom raycasting function specifically designed to handle `Line2` objects. You would need to iterate over the vertices of each line segment and perform ray-plane intersection tests to determine if the ray intersects the line segment.

3. Check for compatibility issues: Make sure that you're using the correct version of `Line2` and that it is compatible with the version of Three.js you're using. There might be compatibility issues if you're using an outdated version of Three.js or if the `Line2` library is not compatible with your Three.js version.

I would recommend trying option 1 first, as it is the simplest solution. If `Line2` is a requirement for your project, you can explore option 2 or check for updated versions of the library that are compatible with your Three.js version.

## LineSegmentsGeometry

<span style="color:#0000dd;">I couldn't change the line width thickness using Line, so I switched to Line2.  If there's an easy way to still use Line and LineBasicMaterial and be able to have a thicker line, that would be ideal.</span>

Buddy, of course, replies with "THREE.Line", so I tell him `linewidth` is known not to work.

You are correct that the <mark>**`linewidth` property does not work reliably**</mark> in Three.js, particularly in modern WebGL contexts.

If you need to achieve thicker lines in Three.js, there are a couple of alternative approaches you can consider:

1. **Shader-based thick lines**: You can create custom shaders to render thick lines in Three.js. This approach involves using `BufferGeometry` to define the line segments and creating a custom shader to render the line with the desired thickness. Here's an example of how you can achieve thick lines using shaders: [Shader-based Thick Lines in Three.js](https://threejsfundamentals.org/threejs/lessons/threejs-lines.html)

2. **LineSegments**: Instead of using `Line` or `Line2`, you can use `LineSegments` in combination with `LineBasicMaterial`. `LineSegments` allows you to define individual line segments instead of a continuous line. Each segment can have its own color...

```javascript
// Create a LineSegmentsGeometry with your line segments
let geometry = new THREE.LineSegmentsGeometry();
geometry.setPositions([...]); // Set your line segment vertices

// Create a LineBasicMaterial
let material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 5 });

// Create a LineSegments using the geometry and material
let line = new THREE.LineSegments(geometry, material);

// Add the line to your scene
scene.add(line);
```

<br>
In this approach, you define each line segment separately, allowing you to have varying thickness <span style="color:#ff0000;">(wrong! unless we're setting it up incorrectly. what a pain.)</span> and color for different segments.

**Shader-based** thick lines provide more flexibility but require more advanced knowledge of shaders.

**LineSegments** offer a simpler solution, but are limited to defining separate line segments. Choose the approach that best suits your requirements and level of expertise.

## Three JS LineBasicMaterial how to draw simple fat line in 3D axis

[Simple?](https://stackoverflow.com/questions/57509888/three-js-linebasicmaterial-how-to-draw-simple-fat-line-in-3d-axis)

```js
new THREE.LineBasicMaterial({ color, linewidth: 5 });
```

doesn't work.

I need a simple method for 3D (rotating scene): `drawLine(measurement1, measurement2, color)` with `linewidth` more then 1px.

<span style="color:#0000dd;font-size:larger;">It does not work since WebGL line primitives are always rendered as 1px wide lines.</span>

**However,** three.js provides the possibility to render so called wide or fat lines based on triangles. So using the classes `LineGeometry`, `LineMaterial` and `Line2` should solve your issue.

[Fat Lines Demo](https://threejs.org/examples/webgl_lines_fat)

<span style="color:#ff6a5a;font-size:larger;">And we're back to square 1.  I can't use Line2.</span>

[Adding thickness to lines](https://stackoverflow.com/questions/70531225/adding-thickness-to-lines-in-threejs)

And you can't use `BufferGeometry` to create the instance of `Line2`. You have to use `LineGeometry` instead.
<br>


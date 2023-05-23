## three.js Errors: Camera & Objects

kool3.js

I'm getting the following errors in three.js.  what does it mean?

```
THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.

THREE.Object3D.add: object not an instance of THREE.Object3D.
Object { x: 0, y: 0, z: 0 }
```

<br>

These errors indicate that there are issues with the objects being passed as arguments in your three.js code.

The first error, "**THREE.WebGLRenderer.render**: camera is not an instance of THREE.Camera," suggests that you are passing an object that is not an instance of THREE.Camera as the camera argument in the render method of the WebGLRenderer.

Make sure that you have created a THREE.Camera object and that you are passing it correctly as the camera argument. You can create a new instance of the camera object using one of the available camera types in three.js, such as THREE.PerspectiveCamera or THREE.OrthographicCamera.

The second error, "**THREE.Object3D.add**: object not an instance of THREE.Object3D," indicates that you are trying to add an object that is not an instance of THREE.Object3D to a THREE.Object3D container.

Make sure that you are creating instances of the Object3D class and adding them to other Object3D instances or using them as the base class for other objects. You can create a new instance of the Object3D class using **`new THREE.Object3D()`**.

<span style="font-size:larger;color:red;">I'm getting this error on mousedown.  But I'm not adding anything on mousedown! 💢</span>

## Object3D Error on Mousedown

The error message you're encountering in your three.js script indicates that you're trying to add an object that is not an instance of `THREE.Object3D` to another `THREE.Object3D` container.

Although you mentioned that you're not directly using the `add` method on mousedown, it's possible that you have an event listener or a function being triggered by the mousedown event that attempts to perform this operation indirectly.

```js
function onDocumentMouseDown() { ... }
```

Thank you for providing the code. Based on the provided code, the error message you mentioned does **not seem to be related to the mousedown event.**

The error you're encountering is likely happening elsewhere in your code where you are performing operations related to adding objects to `THREE.Object3D` containers.

In the code snippet you provided, the mousedown event listener assigns a camera object (`camera1`, `camera2`, `camera3`, or `camera4`) to the **`selectedCamera`** variable based on the position of the mouse. However, there are no operations related to adding objects to `THREE.Object3D` containers in this code.

Investigate code that **interacts** with the **`parentScene`** or **`target`** objects, or any other relevant code that could potentially be involved in **adding** objects to the scene.

## onDocumentMouseMove

```js
// I provided all code...
```

Thank you for providing the complete code. Upon reviewing it, I noticed a potential issue that could cause the error you're encountering. The issue lies in the `onDocumentMouseMove` function.

In the `onDocumentMouseMove` function, you rotate the `selectedCamera` based on mouse movement. However, at the end of the function, you set `selectedCamera` to `null`, which prevents the rotation from being applied continuously. This might lead to unexpected behavior and potentially trigger the error you mentioned.

<span style="color:red;font-size:larger;">I disagree. It was the omission of that line that caused similar code to not work properly.</span>

To fix this issue, you can remove the line `selectedCamera = null;` at the end of the `onDocumentMouseMove` function. This way, the camera rotation will continue to be applied as long as the mouse is moving.

The camera rotation should work as intended when the mouse is moved while a camera is selected.

## After this, I give up.

The error message you mentioned is not directly related to the code you provided, and it seems to be originating from another part of your application. The error message indicates that you're attempting to add an object that is not an instance of `THREE.Object3D` <mark>**to a `THREE.Object3D` container.**</mark>

To troubleshoot:

1. Double-check all the places in your code where you are adding objects to `THREE.Object3D` containers, such as the **`parentScene`, `scene1`, `scene2`, `scene3`, `scene4`, and `target`.**

2. Make sure that you're only adding **instances** of `THREE.Object3D` or its **subclasses** (e.g., `THREE.Mesh`, `THREE.Group`) to these containers. Verify that you're not inadvertently trying to add other objects that do not inherit from `THREE.Object3D`.

3. Review any **external libraries** or **custom code** that might be interacting with the three.js components. Ensure that they are correctly instantiating and adding objects to the appropriate containers.

4. Check if you're using any **third-party** extensions or plugins for three.js and verify that they are compatible with the version of three.js you are using.

5. Inspect the JavaScript **console** for any other error messages or warnings that might provide additional context about the issue.

## How can I check if an object inherits from THREE.Object3D?

<span style="color:#0000dd;font-weight:bold;">Sólo dime. Estoy cansada.</span>

The `instanceof` operator allows you to determine if an object is an **instance** of a particular class or if it **inherits** from that class.

In the case of `THREE.Object3D`, you can use the following code to check if an object is an instance of or inherits from it:

```js
if (object instanceof THREE.Object3D) {
  // The object is an instance of or inherits from THREE.Object3D
} else {
  // The object does not inherit from THREE.Object3D
}
```

Here's an example of how you can use this check when adding objects to `THREE.Object3D` containers:

```js
const container = new THREE.Object3D();

// Check if the object is an instance of or inherits from THREE.Object3D
if (object instanceof THREE.Object3D) {
  container.add(object);
} else {
  console.error('Object is not an instance of or does not inherit from THREE.Object3D:', object);
}
```

<br>
<span style="color:#0000dd;font-weight:bold;font-size:larger;">Everything inherits from THREE.Object3D.</span>

<br>

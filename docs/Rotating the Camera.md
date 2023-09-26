## Rotating the Camera

My three.js code detects a selected camera, etc.

esqueletos/uno.js, pan\_and\_zoom-3.html (543919f)

Why are we rotating by `(0, 1, 0)`, and `(1, 0, 0)`?

```js
function onDocumentMouseMove(event) {
  event.preventDefault();

  if (selectedCamera) {
    // Retrieve the movement distance of the mouse in the horizontal (X) and vertical (Y) directions
    const deltaX = event.movementX;
    const deltaY = event.movementY;

    // Calculate the rotation angles based on the mouse movement and the window size
    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    const phi = (deltaY / window.innerHeight) * Math.PI * 2;

    // Rotate the selected camera
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta); // around the world Y-axis (0, 1, 0) by the horizontal angle (theta)
    selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi); // around the world X-axis (1, 0, 0) by the vertical angle (phi)
  }
}
```

<br>
The code is responsible for rotating the selected camera in response to mouse movement.

1. The code first checks if a camera is selected (`if (selectedCamera)`), ensuring that the subsequent code only executes **when a camera is available.**

2. The `deltaX` and `deltaY` variables store the **movement distance of the mouse cursor** in the horizontal and vertical directions, respectively. This information is typically provided by the `event` object, which could be an instance of `MouseEvent` or a similar event object.

3. The code calculates the **rotation angles `theta` and `phi`** based on the mouse movement and the size of the window. The `deltaX` and `deltaY` values are divided by the window width and height, respectively, and then multiplied by `2 * Math.PI` to convert them into **radians.**

    ```js
    // The rotation angle in radians around the Y-axis
    const theta = (deltaX / window.innerWidth) * Math.PI * 2;
    ```

    <br>

    In this section of the code, `deltaX` represents the horizontal movement of the mouse cursor, and it is divided by the width of the window (`window.innerWidth`) to obtain a normalized value between -1 and 1.

    Then this normalized value is multiplied by `2 * Math.PI` to convert it to radians.

    The rotation is then applied to the camera using rotateOnWorldAxis.

4. The `rotateOnWorldAxis` method is used to rotate the camera around specified axes. The first rotation (`selectedCamera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), theta)`) rotates the camera around the world Y-axis (0, 1, 0) by the angle `theta`. This controls the **horizontal rotation or panning** of the camera.

5. The second rotation (`selectedCamera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), phi)`) rotates the camera around the world X-axis (1, 0, 0) by the angle `phi`. This controls the **vertical rotation or tilting** of the camera.

By combining these rotations, the code allows the selected camera to respond to mouse movements by panning and tilting, providing an interactive camera control mechanism. 

The specific axes (0, 1, 0) and (1, 0, 0) are used to define the rotation directions around the Y and X axes, respectively, resulting in the desired camera movement behavior.

The **rotation around the Y-axis** changes the camera's horizontal orientation or heading, allowing it to pan left or right.

The **rotation around the X-axis** changes the camera's vertical orientation or pitch, allowing it to tilt up or down.

<br>

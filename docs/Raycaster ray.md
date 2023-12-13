## Raycaster ray

[Raycaster](https://threejs.org/docs/#api/en/core/Raycaster)

```js
let raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);

let intersectionPoint = new THREE.Vector3();
raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)), intersectionPoint);
```

Raycasting is a common technique in 3D graphics for calculating the intersection of a ray with objects in 3D space.

1. **Creating a Raycaster**:

   ```javascript
   let raycaster = new THREE.Raycaster();
   ```

   This line initializes a new `Raycaster` object. In three.js, a `Raycaster` is used to perform raycasting, which essentially means shooting a ray from a certain point in space and determining what objects in the 3D scene it intersects with.

2. **Setting Raycaster's Origin and Direction**:

   ```javascript
   raycaster.setFromCamera(mouse, camera);
   ```

   This line configures the `raycaster` to cast a ray from the perspective of the camera through a point in 2D space (usually the mouse position). The `mouse` variable is expected to be a `Vector2` representing the mouse's position in normalized device coordinates (NDC), where the coordinates range from -1 to 1, both horizontally and vertically, with (0, 0) being the center of the screen.

3. **Defining an Intersection Point**:

   ```javascript
   let intersectionPoint = new THREE.Vector3();
   ```

   Here, a new `Vector3` is created to store the coordinates of the point where the ray intersects a plane in 3D space. 

4. **Calculating the Intersection with a Plane**:

   ```javascript
   raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1)), intersectionPoint);
   ```

   In this line, the `intersectPlane` method is called on the `ray` of the `raycaster`. This method is used to compute the point at which the ray intersects a given plane. The plane is defined by `new THREE.Plane(new THREE.Vector3(0, 0, 1))`, which represents a plane in the 3D space. The normal of this plane is `(0, 0, 1)`, indicating that the plane is oriented in such a way that it's perpendicular to the z-axis. The `intersectionPoint` variable is passed to the method, and it will be updated with the coordinates of the intersection point if the ray intersects the plane.

Overall, this code is used to calculate where a ray, originating from the camera and passing through the mouse's position in the 3D scene, intersects with a specific plane. This is often used in applications like 3D editors or games to select or manipulate objects in a 3D environment based on mouse input.

<br>

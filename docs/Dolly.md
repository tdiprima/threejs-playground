## Dolly Operations in Three.js

OrbitControls uses the dolly method behind the scenes.

<span style="color:blue;font-size:larger;">When might one manually use the "dolly" method controls.dolly(...)?</span>

Great question! While the OrbitControls library handles the dolly operation automatically based on user input, there might be situations where you'd want to manually use the `dolly` method provided by the OrbitControls instance, `controls.dolly(...)`. Here are a few scenarios where you might find it useful:

1. **Programmatic Control:** If you want to control the camera movement programmatically without relying on user input, you can use the `dolly` method. For example, you might want to create a scripted animation where the camera moves closer to or farther away from a specific object or point in the scene at a certain speed or time interval.

    <span style="color:lime;">Like the "opening" to the military base example.</span>

2. **Triggered Events:** You can use the `dolly` method in response to specific events or interactions in your application. For instance, you might have buttons or UI elements that, when clicked, trigger the camera to dolly in or out to predefined positions or distances.

    <span style="color:lime;">Like zoom to 10x, 20x, etc.</span>

3. **Custom Controls:** If you're building a custom camera control system or extending the functionality of the OrbitControls library, you might utilize the `dolly` method to implement specialized camera movements. This could include complex camera paths, following specific curves or trajectories, or integrating additional logic and constraints.

    <span style="color:lime;">Like our custom camera stuff when trying to mimic multi-viewer.</span>

By manually invoking the `dolly` method, you have fine-grained control over the camera's dolly operation, enabling you to create specific camera movements or respond to events in a customized manner. It gives you the flexibility to integrate camera adjustments seamlessly into your application or to implement unique camera behaviors tailored to your specific use case.

Remember, the `dolly` method takes parameters that define how much to dolly and in which direction. For example, `controls.dolly(1)` would dolly the camera closer to the target point, while `controls.dolly(-1)` would move it farther away. The magnitude of the value determines the speed or distance of the dolly operation.

<br>

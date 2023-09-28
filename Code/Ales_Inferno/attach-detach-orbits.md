## Detach/Reattach Orbit Controls

To disconnect and reconnect the two `OrbitControls`, you can add a toggle button that changes the behavior of the controls. Here's an updated version of your code with the detach and reattach functionality:

<span style="color:#59acf3;font-size:larger;">lox.js</span>

In this updated code, we added a `detachControls` variable to act as a flag to determine whether the controls should be detached or not. We also introduced a `toggleControlsDetachment` function that toggles the `detachControls` flag and enables or disables the controls accordingly.

To use the detach functionality, you can add an HTML button element with the id "toggleButton" to your webpage. When the button is clicked, the `toggleControlsDetachment` function is called, which will detach or reattach the controls based on the

 current state of the `detachControls` flag.

Note that when the controls are detached, they won't respond to any changes, such as panning, zooming, or rotating. When you reattach them, they will continue following each other's movements as before.

## Una

I understand your requirement. If you want to retain the ability to control the detached control while the other control remains static, you can modify the code to selectively disable the controls based on the `detachControls` flag. Here's an updated version of the code that allows you to control the active control even when detached:

<span style="color:#59acf3;font-size:larger;">bagel.js</span>

In this updated code, I added an `activeControlIndex` variable

to keep track of the currently active control. The `switchActiveControl` function allows you to switch between controls by updating the `activeControlIndex` and enabling the corresponding control while disabling the other control.

When the controls are detached (`detachControls` is `true`), each control's `enabled` property is set based on whether it is the active control or not. Only the active control is enabled, allowing you to control it while the other control remains static.

You can add two HTML buttons with ids "control1Button" and "control2Button" to switch between controls. When clicked, the corresponding control is activated, allowing you to interact with it. The toggle button (`toggleButton`) can be used to detach or reattach the controls.

Now you can control the active control even when the controls are detached, and the other control will remain static.

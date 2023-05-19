## Detecting mouse inactivity

There is no built-in JavaScript event handler that specifically listens for when the mouse stops moving on the screen. However, you can achieve this functionality by combining multiple events and implementing a custom solution.

One approach is to use the **`mousemove`** event along with a **timer** to track when the mouse stops moving.

```javascript
var mouseTimer;

document.addEventListener('mousemove', function() {
  clearTimeout(mouseTimer);
  
  mouseTimer = setTimeout(function() {
    // Mouse has stopped moving, perform your desired action here
    console.log('Mouse stopped moving');
  }, 200); // Adjust the delay as per your requirements
});
```

<br>

The `mousemove` event is attached to the `document` object.

Whenever the mouse moves, the `clearTimeout` function is called to clear any previously set timer.

Then, a new timer is set using `setTimeout` to execute a function after a specified delay (200 milliseconds in this case).

If no subsequent mouse movement occurs within that delay, the specified function is triggered.

<br>

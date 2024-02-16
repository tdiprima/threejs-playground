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

The `mousemove` event is attached to the `document` object.

Whenever the mouse moves, the `clearTimeout` function is called to clear any previously set timer.

Then, a new timer is set using `setTimeout` to execute a function after a specified delay (200 milliseconds in this case).

If no subsequent mouse movement occurs within that delay, the specified function is triggered.

## Set Timeout

`setTimeout` allows you to delay the execution of a piece of code by a specified number of milliseconds. You pass it two arguments: a function to be executed after the delay, and the delay itself in milliseconds.

Here's how it works:

1. You give `setTimeout` a function, which is the task you want to perform after the delay.
2. You specify how long to wait before executing that function, in milliseconds (1000 milliseconds = 1 second).
3. JavaScript waits for the specified delay, then executes the function.

Example:

```javascript
setTimeout(function() {
  console.log('Hello after 3 seconds');
}, 3000);
```

This code will wait for 3 seconds, then print "Hello after 3 seconds" to the console.

## Clear Timeout

`clearTimeout` is used to cancel a timeout set with `setTimeout` before it executes. When you set a timeout, `setTimeout` returns an identifier for that timeout. You can use this identifier with `clearTimeout` to stop the timeout from happening if it hasn't already occurred.

Here's how to use it:

1. Store the identifier returned by `setTimeout` in a variable.
2. Call `clearTimeout`, passing it the identifier, to cancel the timeout.

Example:

```javascript
// Set a timeout and store its identifier
var timeoutId = setTimeout(function() {
  console.log('This will not be printed if clearTimeout works');
}, 3000);

// Cancel the timeout before it occurs
clearTimeout(timeoutId);
```

In this example, the message inside the `setTimeout` will never be printed because the timeout is cancelled with `clearTimeout` before it can occur.

<br>

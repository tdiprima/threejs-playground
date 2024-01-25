## Dynamic Method Invocation

```js
// Add or remove event listeners
const method = isDrawing ? 'addEventListener' : 'removeEventListener';
renderer.domElement[method]("mousedown", onMouseDown, false);
renderer.domElement[method]("mousemove", onMouseMove, false);
renderer.domElement[method]("mouseup", onMouseUp, false);
renderer.domElement[method]("dblclick", onDoubleClick, false);
```

The technique demonstrated in the JavaScript code snippet you provided is often referred to as "Dynamic Method Invocation" or "Conditional Method Invocation." It's a programming pattern where the method to be invoked (in this case, `addEventListener` or `removeEventListener`) is determined at runtime based on certain conditions.

Here's a breakdown of how it works in your example:

1. **Determining the Method**: The method to be used (`addEventListener` or `removeEventListener`) is chosen based on the value of `isDrawing`. This is a form of conditional logic, but instead of using a traditional `if...else` structure, the method name is stored in a variable (`method`).

2. **Method Invocation**: Once the method is determined, it's invoked on `renderer.domElement` with the required parameters. Since `method` is a string representing the method name, using bracket notation (`[method]`) allows dynamically choosing between `addEventListener` and `removeEventListener`.

This technique is useful for reducing code duplication when the only difference in a set of operations is the method being called. It's a more concise and potentially more readable way of writing conditional logic that performs similar actions with only minor differences (in this case, whether to add or remove event listeners).

It's important to note that while this pattern can be very handy, it should be used judiciously. Overusing it or using it in complex scenarios can make the code harder to understand and maintain.

<br>

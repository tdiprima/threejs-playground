## Rest Parameter Syntax

<span style="color:blue;font-weight:bold;font-size:larger;">What is ...args?</span>

```js
class ClearingLogger {
  constructor(elem) {
    this.elem = elem;
    this.lines = [];
  }

  log(...args) {
    this.lines.push([...args].join(' '));
  }

  render() {
    this.elem.textContent = this.lines.join('\n');
    this.lines = [];
  }
}
```

In your JavaScript code, `...args` is an example of the rest parameter syntax. This syntax allows you to represent an indefinite number of arguments as an array. In the context of your `log` method within the `ClearingLogger` class, it works like this:

1. **Gathering Arguments**: The `...args` in the `log` method collects all the arguments passed to the method into a single array. For instance, if you call `logger.log('Hello', 'World', '!')`, inside the `log` method, `args` would be an array `['Hello', 'World', '!']`.

2. **Flexibility**: This allows the `log` method to accept any number of arguments, providing flexibility in how many items you can pass to it. This is particularly useful for a logging function where the number of items to log may vary.

3. **Array Operations**: Inside the `log` method, `[...args].join(' ')` is used. This creates a new array from `args` (though in this case, it's not strictly necessary to spread `args` into a new array, as `args` is already an array) and then joins its elements into a string, separating them with spaces. This string is then pushed onto the `this.lines` array.

4. **Example Usage**: If you call `logger.log('Error:', err.message)`, the `log` method will receive 'Error:' and `err.message` as part of the `args` array, join them into a single string 'Error: [error message]', and push that string to the `this.lines` array.

The `...args` syntax is a modern and versatile feature in JavaScript, making functions more flexible and capable of handling varying numbers of arguments.

<br>

## Automatically turn off

Yeah, that technique is often referred to as "toggle" behavior or "radio button" functionality, depending on the context. If you're talking about a group of buttons where only one can be active at a time (like in a set of options), that's very much like radio buttons in HTML. When applied to a custom UI with buttons (maybe not traditional form elements), you might implement it by toggling classes or states in JavaScript to ensure only one button is "active" at any given moment. 

In a more general sense, especially with custom UI elements where you might not be using form elements directly, this could be part of a pattern often called "exclusive selection" or "mutually exclusive options."

## Managing

<span style="color:blue;font-size:larger;">Too clunky?</span>

Not at all! Managing the state of HTML buttons to create mutually exclusive selections is pretty common and can be smoothly done with JavaScript, especially since you're comfortable with it. Here's a quick and clean way to implement that with HTML buttons and JavaScript, assuming you're not already using radio buttons for some reason:

1. **HTML Setup**: Give all related buttons the same class for easy selection and an attribute to identify them (like `data-group="group1"`).
2. **JavaScript**: Add an event listener to all buttons in the group. When one is clicked, turn all buttons off, then turn the clicked one on.

Here’s a small example:

```html
<button class="btn-group" data-group="group1">Option 1</button>
<button class="btn-group" data-group="group1">Option 2</button>
<button class="btn-group" data-group="group1">Option 3</button>
```

```js
// Select all buttons in the group
const buttons = document.querySelectorAll('.btn-group[data-group="group1"]');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Turn all buttons off
    buttons.forEach(btn => btn.classList.remove('active'));
    // Turn the clicked one on
    button.classList.add('active');
  });
});
```

And some basic CSS for visual feedback:

```css
.btn-group.active {
  background-color: #4CAF50; /* Green */
  color: white;
}
```

This is pretty straightforward and shouldn’t feel clunky at all. It keeps your UI responsive and user-friendly!

## Select data-group

```html
<button class="btn-group" data-group="group1">Option 1</button>
<button class="btn-group btnOn" data-group="group1">Option 2</button>
<button class="btn-group" data-group="group1">Option 3</button>
```

```js
// Select all buttons in the specific group
const buttons = document.querySelectorAll('[data-group="group1"]');

buttons.forEach(button => {
  button.addEventListener('click', function() {
    // Check if the button already has the 'btnOn' class
    if (this.classList.contains('btnOn')) {
      // Logic to turn the button off if it's already on
      this.classList.remove('btnOn');
      console.log(this.textContent + ' was turned off');
    } else {
      // Turn all buttons off
      buttons.forEach(btn => btn.classList.remove('btnOn'));
      // Turn the clicked one on
      this.classList.add('btnOn');
      console.log(this.textContent + ' was turned on');
    }
  });
});
```

## Select button

```js
// Selects all <button> elements in the document
const buttons = document.querySelectorAll('button');

// Iterates over the NodeList of buttons
buttons.forEach(button => {
  // Add event listener or other logic for each button
  button.addEventListener('click', () => {
    console.log('Button clicked:', button.textContent);
  });
});
```

<br>

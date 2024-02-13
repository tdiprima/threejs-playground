<span style="color:blue;font-size:larger;">There's a navigation bar on top, so the location where the square shows up is different from the location I click at.  How do I adjust for this?</span>

```js
// Original: X / width; Y / height
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
```

To adjust for the offset caused by a navigation bar or any other element on the page, you need to take into account the position of the canvas element relative to the viewport. When calculating the mouse position, subtract the offset of the canvas from the mouse's client coordinates.

Here's how you can modify the `onMouseClick` function to account for the canvas offset:

1. **Get the Canvas Element and Its Offset:** Assuming you have a single canvas element for your Three.js scene, you can get it by using `document.querySelector('canvas')`. To get the offset, use the `getBoundingClientRect()` method, which provides the size of the element and its position relative to the viewport.

2. **Adjust Mouse Coordinates:** Subtract the top and left offsets of the canvas from the `clientX` and `clientY` of the mouse event.

Here's the updated code:

```javascript
function onMouseClick(event) {
  // Get the canvas element and its bounding rectangle
  const canvas = document.querySelector('canvas');
  const rect = canvas.getBoundingClientRect();

  // Adjust mouse position for canvas offset
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

window.addEventListener('click', onMouseClick);
```

This adjustment ensures that the mouse coordinates are calculated relative to the canvas element, taking into account any page layout elements like navigation bars.

<br>

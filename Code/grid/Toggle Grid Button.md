## Toggle Grid Button

To make your button a toggle for adding and removing the grid in your Three.js scene, you can modify your code to keep track of whether the grid is currently displayed. You can do this by maintaining a boolean variable, for instance, `isGridAdded`, which will be `true` when the grid is added and `false` when it is removed.

Additionally, you'll need to modify the `addGrid` function to handle both adding and removing the grid. Here is a revised version of your code with these changes:

```javascript
let isGridAdded = false;
let grid;

document.getElementById("addGrid").addEventListener("click", function() {
  if (isGridAdded) {
    removeGrid();
  } else {
    addGrid(planeGeom);
  }
  isGridAdded = !isGridAdded; // Toggle the state
});

// PlaneGeometry...

// addGrid...
grid = new THREE.LineSegments(gridGeometry, gridMaterial);
  
function removeGrid() {
  if (grid) {
    scene.remove(grid);
    grid.geometry.dispose();
    grid.material.dispose();
    grid = undefined;
  }
}
```

In this updated code:

- The `isGridAdded` variable keeps track of the grid's state (added or removed).
- The `addGrid` function adds the grid to the scene.
- The `removeGrid` function removes the grid from the scene and disposes of its resources.
- The event listener for the button checks the state of `isGridAdded` and calls the appropriate function to add or remove the grid, and then toggles the state of `isGridAdded`.

<br>

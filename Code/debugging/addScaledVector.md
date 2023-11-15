## Understanding addScaledVector

<span style="color:blue;font-weight:bold;font-size:larger;">It's how we update the position of the mesh in the render (or "animate") function.</span>

```js
// createThing()
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

things.push({
  mesh,
  timer: 2,
  velocity: new THREE.Vector3(rand(-5, 5), rand(-5, 5), rand(-5, 5)),
});

let then = 0;

// render(now)
now *= 0.001;  // convert to seconds
let deltaTime = now - then;
then = now;

// For each thing...
mesh.position.addScaledVector(thing.velocity, deltaTime);
```

Imagine you have a toy car (which is your mesh in Three.js). You can move this toy car in different directions: forward, backward, left, right, up, or down. In Three.js, this movement is represented by changing the position of the mesh.

The `mesh.position.addScaledVector` function is a bit like saying, "Move my toy car in a certain direction and by a certain amount." Let's break it down:

1. **mesh.position**: This is like the current location of your toy car on a big map. It tells you where the car is right now.

2. **addScaledVector**: This is a bit like saying, "I want to move my car in a certain direction (like forward or to the left) and by a certain distance (like 5 steps forward or 3 steps to the left)." 

   - **Vector**: In Three.js, a vector is a way to describe a direction and how far you should go in that direction. Think of it as an arrow pointing somewhere. This arrow tells your mesh (the toy car) which way to go.
   - **Scaled**: This means you can make the movement bigger or smaller. For example, if your vector says "move 1 step forward," scaling it by 5 would mean "move 5 steps forward" instead.

When you use `mesh.position.addScaledVector`, you're basically telling your mesh to move from its current position in a specific direction and by a specific amount.

This is useful in animations or <mark>**when you want to move objects based on certain conditions,**</mark> like user input or a simulation.

The reason it's used in the render or animate function is that you often want to ***keep updating the position of your mesh as your scene keeps redrawing.***

This way, you can make your toy car (the mesh) move smoothly across the 3D world, just like in a video game or a simulation!

<br>

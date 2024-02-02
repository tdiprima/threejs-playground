## Understanding addScaledVector

It's how we update the position of the mesh in the render (or "animate") function.

<span style="color:#59acf3;font-size:larger;">loving_katana.html</span>

```js
// function createThing()
let mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

things.push({
  mesh,
  timer: 2,
  velocity: new THREE.Vector3(rand(-5, 5), rand(-5, 5), rand(-5, 5)),
});

let then = 0;

// function render(now)
now *= 0.001;  // convert to seconds
let deltaTime = now - then;
then = now;

// For each thing...
mesh.position.addScaledVector(thing.velocity, deltaTime);
```

You have your `mesh.position`, right now.

When you use `mesh.position.addScaledVector`, you're basically telling your mesh to move from its current position in a specific direction and by a specific amount.

A vector is a way to describe a direction and how far you should go in that direction. Think of it as an arrow pointing somewhere. This arrow tells your mesh which way to go.  And then the scale means you can make the movement bigger or smaller.

This is useful in animations or when you want to move objects based on certain conditions, like user input or a **simulation**.

The reason it's used in the render or animate function is that you often want to ***keep updating the position of your mesh as your scene keeps redrawing.***


## V and S

<span style="color:blue;font-size:larger;">addScaledVector ( v : Vector3, s : Float )</span>

In three.js, when you use the `addScaledVector` function, you're working with two main things: a vector `v` and a number `s`.

- `v` is like an arrow pointing somewhere in space. It shows a direction and how far you should go in that direction.
- `s` is a number that you use to make the arrow longer or shorter. If `s` is bigger than 1, your arrow gets longer. If `s` is between 0 and 1, your arrow gets shorter. If `s` is negative, your arrow flips to point in the opposite direction and its length changes based on the value of `s`.

When you add a scaled vector to another vector, you first change the length of the `v` arrow based on `s`, and then you move the starting point of your original arrow by the new length and direction of `v`. It's like saying, "Start here, then take `v` steps in its direction, but first make each step `s` times bigger or smaller." This way, you end up somewhere new based on both the direction and size of `v` and the scaling factor `s`.

### Apply it...

- `v` (Vector): This is the vector that you want to scale before adding it to another vector.

- `s` (Float): This is the scale factor that you want to apply to vector `v` before adding it.

When you call `addScaledVector(v, s)` on a vector (let's call it vector `a`), it scales the vector `v` by the scalar `s` and then adds the resulting vector to `a`. Mathematically, if `a` is the original vector on which the method is called, the operation performed is:

<i>a = a + (v * s)</i>

<span style="color:lime;font-size:larger;">So it's like position + whatever we came up with.</span>

This operation is often used in physics calculations, animations, or anywhere vector math is needed to determine positions, velocities, or directions by combining scaled vector additions in a compact and efficient manner.

<br>

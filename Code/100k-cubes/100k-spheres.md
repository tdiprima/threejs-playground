## Rendering 100k spheres, instantiating and draw calls

Using `THREE.InstancedGeometry` to render a lot of things without going below 60fps.

[Good explanation](https://velasquezdaniel.com/blog/rendering-100k-spheres-instantianing-and-draw-calls/)

One big draw call is going to be significantly faster than 10 small draw calls of the same size. This is because the CPU only needs to communicate just once with the GPU.

We can reduce draw calls by merging all 7,000 geometries into a single geometry.

[Sandbox](https://codesandbox.io/s/github/Anemolo/100k-objects-with-Instanced-Geometries)

```sh
npm i
npm run start
```

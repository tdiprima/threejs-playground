## Layering and Filtering

See code example, layering-and-filtering.html

In this example, we create a base image and a transparent image layer using `THREE.PlaneGeometry` and `THREE.MeshBasicMaterial`. The transparent material has the `transparent` property set to `true` and an `opacity` of `0.5` to make it semi-transparent.

To apply the color filter, we create a custom shader material (`THREE.ShaderMaterial`) that takes the transparent image texture and a filter color as uniforms. The vertex shader simply passes the texture coordinates, and the fragment shader applies the color filter to the texel color.

Finally, we set the colorization material as the material for the transparent mesh, and we render the scene using a combination of `requestAnimationFrame` and the `OrbitControls` for camera interaction.

## Explicar

```js
let colorizationMaterial = new THREE.ShaderMaterial({ ... });
// And vertex and fragment shaders
```

The `ShaderMaterial` constructor is passed an object that contains various properties defining the material. In this case, it has two properties:

   - `uniforms`: An object that defines the uniforms (input values) that can be accessed within the vertex and fragment shaders. It contains two uniforms:
     - `myTexture`: A uniform of type `sampler2D` (2D texture) with an initial value of `transparentTexture`.
     - `filterColor`: A uniform of type `vec3` (3D vector) with an initial value of `filterColor`.

   - `vertexShader`: A string containing the vertex shader code. This shader is responsible for processing each vertex of the geometry. In this code, it sets the varying variable `vUv` to the vertex's UV coordinates (texture coordinates) and calculates the final position of the vertex using the projection and model-view matrices.

   - `fragmentShader`: A string containing the fragment shader code. This shader is responsible for determining the color of each pixel of the geometry. In this code, it declares the uniforms `myTexture` and `filterColor` as inputs. It samples the texture (`myTexture`) at the UV coordinates (`vUv`), multiplies the sampled color with the `filterColor`, and assigns the result to `gl_FragColor`, which represents the final color of the pixel.


## Err0r

<span style="color:#0000dd;">"Must have a compiled fragment shader attached."  All I had to do is rename the "texture".  Holy</span> 💩

## Etc.

```glsl
// You could try changing:
texel.rgb *= filterColor;
```

```glsl
// to:
texel.rgb *= filterColor.rgb;
// But it's the same thing.
```

[WebGL2 Breaking Custom Shader](https://discourse.threejs.org/t/webgl2-breaking-custom-shader/16603)

[WebGL2 from WebGL1](https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html)

<br>

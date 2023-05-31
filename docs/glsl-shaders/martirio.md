## The mix function

The `mix` function is a built-in function in GLSL (the shading language used in WebGL). It is not specific to the GSAP library.

The `mix` function in GLSL performs a linear interpolation between two values based on a specified interpolation factor. 

Syntax:

```glsl
mix(value1, value2, interpolationFactor)
```

- `value1` and `value2` are the values to interpolate between.
- `interpolationFactor` is a value ranging from 0.0 to 1.0 that determines the weight of `value2` in the interpolation. A value of 0.0 results in `value1`, while a value of 1.0 results in `value2`. Values in between produce a linear interpolation between the two values.

In the provided code example, the `mix` function is used to smoothly transition between colors by specifying different colors as `value1` and `value2` based on the current hue value within the respective range.

### GSAP (GreenSock Animation Platform) library

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
```

### Wut?

THREE.WebGLProgram: Program Info Log: WARNING: **Output of vertex shader** 'webgl\_37cc066937ccaa46' not read by fragment shader.

The warning you're seeing is related to the vertex shader's output not being used in the fragment shader. It indicates that the output variable `vUv` defined in the vertex shader is not being read or utilized in the fragment shader.

To resolve this warning, you can remove the `vUv` variable from the vertex shader since it's not needed in the provided code snippet. See?

```glsl
// varying vec2 vUv;
void main() {
  // vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## "Interpolate" and "Transpose"

No, "interpolate" and "transpose" are not synonyms, and they refer to different concepts.

**"Interpolate"** refers to the process of **estimating** values between two known values based on a linear or non-linear relationship. It involves determining intermediate values within a range to achieve a smooth transition or progression.

**"Transpose,"** on the other hand, is a term used in linear algebra and matrix operations. It refers to the operation of **rearranging** the rows and columns of a matrix, effectively flipping it along its diagonal. The transpose of a matrix is obtained by **swapping** its rows with its columns.

### Wut wut?

Scripts "build/three.js" and "build/three.min.js" are deprecated with r150+, and will be removed with r160. Please use ES Modules or alternatives: https://threejs.org/docs/index.html#manual/en/introduction/Installation three.js:1:9

<br>

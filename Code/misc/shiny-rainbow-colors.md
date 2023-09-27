## Iridescence

Iridescence refers to the property of certain surfaces to exhibit a play of colors that change with the angle of observation or the angle of incident light. It often gives the appearance of a spectrum of colors, similar to those seen in a rainbow. This effect is caused by the interference and diffraction of light waves as they interact with the surface structure of the material. Some examples of naturally iridescent objects include certain gemstones and butterfly wings.

## Create an iridescent sphere

You can use a combination of **materials** and **shaders** in Three.js.

```javascript
// shiny-rainbow-colors.html
let geometry = new THREE.SphereGeometry(1, 32, 32);

let material = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
});
```

In the code above, we create a sphere geometry using `THREE.SphereGeometry` and a custom shader material using `THREE.ShaderMaterial`.

The vertex and fragment shaders define the behavior of the material.

You'll also need to define the vertex and fragment shaders in your HTML code:

```html
<script id="vertexShader" type="x-shader/x-vertex">...</script>
<script id="fragmentShader" type="x-shader/x-fragment">...</script>
```

<br>
In this example, we use a simple shading algorithm that combines the base color, ambient color, and the intensity of the light to calculate the final color of each fragment.

The iridescent effect is achieved by adding an iridescent color based on the current time to the final color.

## ERR0R

The error indicates that the `vNormal` varying variable used in the fragment shader is **not declared** in the vertex shader.

To fix this error, you need to **pass the normal attribute** from the vertex shader to the fragment shader.

```html
<script id="vertexShader" type="x-shader/x-vertex">
  varying vec3 vNormal; // add this

  void main() {
    vNormal = normalize(normalMatrix * normal); // and this
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
</script>
```

By adding the `varying vec3 vNormal;` declaration at the beginning of the vertex shader and assigning the normalized normal vector to `vNormal`, you ensure that the normal information is passed to the fragment shader.

Now, the `vNormal` varying variable will be recognized in the fragment shader, resolving the error you encountered.

<br>

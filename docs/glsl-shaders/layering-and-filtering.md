## Layering and Filtering

TL;DR &ndash; see bottom of file.

Certainly! Here's a code example that demonstrates layering and filtering using Three.js:

```javascript
// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a base image
var baseTexture = new THREE.TextureLoader().load('path/to/baseImage.jpg');
var baseMaterial = new THREE.MeshBasicMaterial({ map: baseTexture });
var baseGeometry = new THREE.PlaneGeometry(5, 5); // Adjust the size as needed
var baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(baseMesh);

// Create a transparent image layer
var transparentTexture = new THREE.TextureLoader().load('path/to/transparentImage.png');
var transparentMaterial = new THREE.MeshBasicMaterial({ map: transparentTexture, transparent: true, opacity: 0.5 });
var transparentGeometry = new THREE.PlaneGeometry(5, 5); // Adjust the size as needed
var transparentMesh = new THREE.Mesh(transparentGeometry, transparentMaterial);
scene.add(transparentMesh);

// Create a color filter
var filterColor = new THREE.Color(1, 0, 0); // Red color filter

// Create a custom shader material for colorization
var colorizationMaterial = new THREE.ShaderMaterial({
  uniforms: {
    texture: { value: transparentTexture },
    filterColor: { value: filterColor },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D texture;
    uniform vec3 filterColor;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(texture, vUv);
      texel.rgb *= filterColor;
      gl_FragColor = texel;
    }
  `
});

// Apply the colorization material to the transparent mesh
transparentMesh.material = colorizationMaterial;

// Set up the camera position and controls
camera.position.z = 10;
var controls = new THREE.OrbitControls(camera, renderer.domElement);

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

<br>

In this example, we create a base image and a transparent image layer using `THREE.PlaneGeometry` and `THREE.MeshBasicMaterial`. The transparent material has the `transparent` property set to `true` and an `opacity` of `0.5` to make it semi-transparent.

To apply the color filter, we create a custom shader material (`THREE.ShaderMaterial`) that takes the transparent image texture and a filter color as uniforms. The vertex shader simply passes the texture coordinates, and the fragment shader applies the color filter to the texel color.

Finally, we set the colorization material as the material for the transparent mesh, and we render the scene using a combination of `requestAnimationFrame` and the `OrbitControls` for camera interaction.

You would need to replace the paths to the base image and transparent image with your own image paths. Feel free to adjust the sizes, positions, and other parameters as needed to fit your specific use case.

Note that this is a basic example to demonstrate the concept of layering and filtering with Three.js. Depending on your specific requirements, you may need to modify and extend this code further.

## llorar y lluvia

Explain this bit of code:

```js
let colorizationMaterial = new THREE.ShaderMaterial({
    uniforms: {
      myTexture: { value: transparentTexture },
      filterColor: { value: filterColor }
    },
    vertexShader: `code...`,
    fragmentShader: `code...`
  });
```

```glsl
// vertexShader
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

```glsl
// fragmentShader
uniform sampler2D myTexture;
uniform vec3 filterColor;
varying vec2 vUv;
void main() {
  vec4 texel = texture2D(myTexture, vUv);
  texel.rgb *= filterColor.rgb;
  gl_FragColor = texel;
}
```

Certainly! Let's break it down step by step:

1. First, a new instance of `THREE.ShaderMaterial` is created and assigned to the variable `colorizationMaterial`. `ShaderMaterial` is a class in three.js that allows you to **create custom materials** by specifying vertex and fragment shaders.

2. The `ShaderMaterial` constructor is passed an object that contains various properties defining the material. In this case, it has two properties:
   - `uniforms`: An object that defines the uniforms **(input values)** that can be accessed within the vertex and fragment shaders. It contains two uniforms:
     - `myTexture`: A uniform of type `sampler2D` (2D texture) with an initial value of `transparentTexture`.
     - `filterColor`: A uniform of type `vec3` (3D vector) with an initial value of `filterColor`.
   - `vertexShader`: A string containing the vertex shader code. This shader is responsible for **processing each vertex of the geometry.** In this code, it sets the varying variable `vUv` to the vertex's UV coordinates (texture coordinates) and calculates the final position of the vertex using the projection and model-view matrices.
   - `fragmentShader`: A string containing the fragment shader code. This shader is responsible for **determining the color of each pixel of the geometry.** In this code, it declares the uniforms `myTexture` and `filterColor` as inputs. It samples the texture (`myTexture`) at the UV coordinates (`vUv`), multiplies the sampled color with the `filterColor`, and assigns the result to `gl_FragColor`, which represents the final color of the pixel.

By creating this `ShaderMaterial` and providing the custom vertex and fragment shaders, you can define your own logic for how the geometry should be rendered and shaded. In this case, the material takes a texture as input (`myTexture`) and applies a color filter (`filterColor`) to it. The resulting color is then used as the final color of each pixel in the geometry.

## HTML?

If you are defining your shaders directly in the JavaScript code, you don't need to add anything additional to the HTML file. The shaders are included as string literals within the THREE.ShaderMaterial definition in your JavaScript code, and they don't require any separate HTML tags.

But...

The HTML part of the code for the vertex shader and fragment shader can be written using `<script>` tags in your HTML file. Here's an example of how you can include the shaders in your HTML:

```html
<body>
  <script id="vertexShader" type="x-shader/x-vertex">
    // code
  </script>
  <script id="fragmentShader" type="x-shader/x-fragment">
    // code
  </script>
</body>
```

<br>

In the above HTML code, the vertex shader is defined inside the `<script>` tag with the `id="vertexShader"` attribute and the type set to `"x-shader/x-vertex"`. Similarly, the fragment shader is defined inside the `<script>` tag with the `id="fragmentShader"` attribute and the type set to `"x-shader/x-fragment"`.

You can then access the shaders in your JavaScript code by using `document.getElementById()` to retrieve the shader source code:

```javascript
// Get the vertex shader source code
var vertexShaderSource = document.getElementById('vertexShader').textContent;

// Get the fragment shader source code
var fragmentShaderSource = document.getElementById('fragmentShader').textContent;
```

<br>

<span style="color:red;font-size:larger;">Fine...</span>

## Must have a compiled fragment shader attached

<span style="color:#0000dd;">All I had to do is rename the texture.  Holy</span> 💩

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

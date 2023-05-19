## Iridescence

Iridescence refers to the property of certain surfaces to exhibit a play of colors that change with the angle of observation or the angle of incident light. It often gives the appearance of a spectrum of colors, similar to those seen in a rainbow. This effect is caused by the interference and diffraction of light waves as they interact with the surface structure of the material. Some examples of naturally iridescent objects include certain gemstones and butterfly wings.

## Create an iridescent sphere

You can use a combination of **materials** and **shaders** in Three.js.

```javascript
// Create a scene
var scene = new THREE.Scene();

// Create a camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere geometry
var geometry = new THREE.SphereGeometry(1, 32, 32);

// Create a custom shader material
var material = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent
});

// Create a sphere mesh with the geometry and material
var sphere = new THREE.Mesh(geometry, material);

// Add the sphere to the scene
scene.add(sphere);

// Create an animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Rotate the sphere
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
```

<br>

In the code above, we create a **sphere geometry** using `THREE.SphereGeometry` and a **custom shader** material using `THREE.ShaderMaterial`.

The **vertex** and **fragment** shaders define the behavior of the material.

You'll also need to **define** the vertex and fragment shaders in your HTML code:

```html
<script id="vertexShader" type="x-shader/x-vertex">
  // TODO: FIX!  SEE BELOW.
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
</script>

<script id="fragmentShader" type="x-shader/x-fragment">
  uniform float time;
  varying vec3 vNormal;

  void main() {
    vec3 light = vec3(1.0, 1.0, 1.0);   // Light direction
    vec3 ambient = vec3(0.2, 0.2, 0.2); // Ambient color
    vec3 color = vec3(0.8, 0.8, 0.8);   // Base color

    float intensity = dot(vNormal, normalize(light));
    vec3 iridescentColor = vec3(sin(time), sin(time + 2.094), sin(time + 4.188)) * 0.5 + 0.5;

    vec3 finalColor = ambient + color * intensity + iridescentColor;
    gl_FragColor = vec4(finalColor, 1.0);
  }
</script>
```

<br>

In this example, we use a **simple shading algorithm** that combines the base color, ambient color, and the intensity of the light to calculate the final color of each fragment.

The iridescent effect is achieved by adding an iridescent color based on the current **time** to the final color.

# ERR0R

The error you're encountering indicates that the `vNormal` varying variable used in the fragment shader is **not declared** in the vertex shader.

To fix this error, you need to **pass the normal attribute** from the vertex shader to the fragment shader.

```glsl
<script id="vertexShader" type="x-shader/x-vertex">
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
</script>
```

By adding the `varying vec3 vNormal;` declaration at the beginning of the vertex shader and assigning the normalized normal vector to `vNormal`, you ensure that the normal information is passed to the fragment shader.

Now, the `vNormal` varying variable will be recognized in the fragment shader, resolving the error you encountered.

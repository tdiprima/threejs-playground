## Three.js + Leaflet Overlay

Combining Leaflet.js with Three.js can be a powerful way to create interactive 3D maps with overlays and additional features. In this example, I'll show you how to set up a basic Three.js application with a Leaflet map overlay. We'll assume you have basic knowledge of both Three.js and Leaflet.js.

1. **CSS and HTML**

    ```css
    body {
      overflow: hidden;
      margin: 0;
    }

    #map {
      position: absolute;
      z-index: 0;
      top: 0;
      bottom: 0;
      width: 100%;
    }

    #webgl-container {
      position: absolute;
      z-index: 1;
      top: 0;
      bottom: 0;
      width: 100%;
    }
    ```

    ```html
    <title>Three.js with Leaflet Overlay</title>
    <body>
      <div id="map"></div>
      <div id="webgl-container"></div>

      <!-- Add Three.js and Leaflet.js libraries -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    </body>
    ```

    <br>

2. Create your Three.js **scene** and **render loop**

    ```javascript
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    // Sample cube in the scene
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
    animate();
    ```

    <br>

3. Set up your **Leaflet map** and **overlay**

    ```javascript
    // Leaflet map setup
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Overlay a Three.js scene on the Leaflet map
    const overlay = L.canvasOverlay()
      .drawing(drawWebGL)
      .addTo(map);

    function drawWebGL(canvasOverlay, params) {
      // Get the Leaflet map overlay canvas and create a Three.js scene on it
      const canvas = canvasOverlay.canvas();
      const context = canvas.getContext('webgl');
      const gl = context || canvas.getContext('experimental-webgl');

      // Your Three.js scene setup using the same canvas for rendering
      // You can use Three.js to render any 3D content, like points, lines, or meshes.
      // For simplicity, we'll just render a cube on the map.
      // Make sure to update the cube position accordingly to the map coordinates.

      // This function will be called every time the map is panned or zoomed.
    }

    // Call the drawWebGL function to initialize the Three.js scene on the Leaflet map
    drawWebGL(overlay);
    ```

<br>

Please note that the above code is a simplified example. You can create more complex scenes in Three.js and overlay them on the Leaflet map as needed. Remember to **adjust the `drawWebGL` function** to include your actual Three.js scene setup, rendering, and update logic.

Also, keep in mind that integrating Leaflet.js and Three.js can have **performance implications**, especially on mobile devices. Consider **optimizing** your code and using lower-poly models or point clouds if you encounter performance issues with complex 3D scenes.

## Heh?

A "lower-poly model" and a "point cloud" are both representations of 3D data used in computer graphics and visualization.

### Lower-poly model

A "lower-poly model" refers to a 3D model that is constructed using a relatively small number of polygons (also known as faces or triangles) compared to a high-poly model. **Polygons are the building blocks** of 3D models and are used to represent the surfaces of objects in computer graphics. Each polygon is defined by its vertices (corner points) and can represent a flat or curved surface.

The **level of detail** in a 3D model is determined by the number of polygons it contains.
    
**High-poly models** have a large number of polygons, providing a more detailed and smooth appearance but requiring greater computational resources to render.
    
**Lower-poly models** have fewer polygons, resulting in a simpler representation with less detail but being more computationally efficient to render.

Lower-poly models are commonly used in real-time applications, such as video games, virtual reality environments, and interactive 3D web applications, where performance and responsiveness are crucial.

### Point cloud

A "point cloud" is a set of data points in 3D space, typically representing the **surface of an object** or a scene. Each point in the point cloud represents a specific position in 3D space and may also include additional attributes, such as color or intensity.

Point clouds can be obtained from various sources, including 3D scanners, Lidar (Light Detection and Ranging) systems, photogrammetry, and other 3D sensing technologies.

Unlike polygonal models, point clouds do not have defined surfaces or connectivity between points. They represent the shape and structure of objects by capturing a large number of individual points that **collectively form** a cloud-like representation.

Point clouds are used in applications such as 3D reconstruction, environmental modeling, autonomous vehicles, and virtual reality. They can be further processed to create 3D models, extract features, or analyze the geometry of objects in the captured scene.

In some cases, point clouds can be used as an **alternative** to lower-poly models in certain visualization scenarios.

They offer a different approach to **representing 3D data**, particularly when dealing with large-scale environments or detailed real-world scenes.

However, rendering and processing point clouds can be **computationally intensive**, so optimizations and simplifications are often applied to improve performance.

<br>

## Circle Flood-Fill

<span style="color:blue;font-size:larger;">I want to draw a polygon with a circle in three.js.  Is there any way to flood-fill the interior of the circles with transparent, so that only the outer boundary of the connecting circles remain?</span>

To achieve the effect of creating polygonal shapes with circles where the interior of the circles is transparent and only the outer boundary remains visible, you'll need to modify your Three.js code to use a different approach. Since Three.js doesn't directly support flood-filling or similar operations, you have to creatively use the available features.

One way to achieve this effect is to use a stencil buffer approach. The stencil buffer allows you to control the drawing of pixels based on the content of another buffer. In your case, you can use it to mask out the inner parts of the circles. Here's a conceptual outline of how you might implement this:

1. **Enable Stencil Buffer in the Renderer**: When creating your WebGLRenderer, ensure that the stencil buffer is enabled.

2. **Create Stencil Masks for Circles**: Each time you draw a circle, you also draw a stencil mask in the shape of the circle. This mask will prevent the drawing of anything in the area of the circle when the stencil test is enabled.

3. **Draw Circles with Stencil Test Enabled**: When drawing the circles, enable the stencil test so that the drawing only occurs in areas not masked by the stencil.

Here's an outline of how you could modify your existing code:

1. **Enable the Stencil Buffer**:
   ```javascript
   const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
   ```

2. **Modify the `drawBrush` function**:
   - Before drawing the circle, configure the stencil buffer to write a value (e.g., 1) where the circle will be drawn.
   - Draw the circle as usual, but the stencil operation will mark the pixels inside the circle.
   - Change the stencil function to prevent drawing where the stencil value is 1.

This approach requires a good understanding of how the stencil buffer works in WebGL. The implementation can be quite complex, especially when dealing with overlapping shapes and ensuring the correct parts of the shapes are filled or unfilled.

Since Three.js is a high-level library, some of these low-level operations can be challenging to implement directly. It might be easier to achieve this effect using shaders or by pre-computing the geometry of the shapes you want to draw.

Given the complexity of this task, I recommend looking into more detailed resources on WebGL's stencil operations or considering alternative approaches to achieving your desired visual effect.

## Simplest alternative approach?

For a simpler alternative to achieve the effect of drawing polygons with circles in Three.js, where only the outer boundaries of the overlapping circles are visible, you can use a custom shader material. This approach involves using a fragment shader to discard pixels that are inside the circles, leaving only the edges visible.

Here is a complete example to illustrate this approach:

<span style="color:#59acf3;font-size:larger;">shaders.html</span>

In this example:

- A `ShaderMaterial` is created with a custom fragment shader. The shader discards pixels that are inside a certain distance from the center, creating a circle's edge effect.
- A plane geometry is used to apply this shader. The circle is rendered on this plane.
- The `brushSize` uniform controls the thickness of the circle's edge.

This is a simplified example, and you might need to adjust the shader and the rest of the code to fit your specific requirements. Also, note that handling multiple circles or complex interactions would require more advanced shader programming and potentially managing multiple materials or geometries.

## Second opinion?

For an interactive drawing application in Three.js where the user draws on the screen using circles, and only the outer boundaries of these circles are visible, a good approach is to use a combination of mesh drawing and a custom shader for the material. The idea is to dynamically create a mesh as the user draws, and then apply a shader material to this mesh to render only the outer edges of the circles.

Here is a step-by-step guide and complete example code for such an approach:

1. **Set Up Basic Three.js Scene**:
   - Create a scene, camera, and renderer.
   - Add a plane or a large quad as your drawing canvas.

2. **Handle Mouse Events for Drawing**:
   - Listen to mouse events for starting, continuing, and ending the drawing.
   - Convert mouse coordinates to 3D space.

3. **Create and Update Mesh as User Draws**:
   - Dynamically create and update a mesh (or line geometry) as the user moves the mouse.
   - Store the positions where the user has drawn.

4. **Apply a Custom Shader Material**:
   - Use a fragment shader to discard pixels inside the circle's radius, leaving only the edges.
   - The shader can be applied to the entire drawing mesh.

5. **Render the Scene and Update on User Interaction**.

Here's the complete example code:

<span style="color:#59acf3;font-size:larger;">black-dot.html</span>

In this example, the user can draw on the scene by clicking and dragging the mouse. Each time the mouse moves while drawing, a new circle mesh with the custom shader material is added to the group. The shader material renders only the edges of these circles.

You can adjust the brush size and other parameters to achieve the desired effect. Keep in mind

 that this is a basic implementation, and depending on the complexity of your application, you may need to optimize or modify this approach.

<br>

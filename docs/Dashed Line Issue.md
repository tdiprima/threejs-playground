## Dashed Line Issue Solution

<span style="color:#0000dd;">I free-draw on an image.  If I move the image using orbit controls, the drawn line looks dashed.</span>

The issue you're experiencing with the drawn line appearing dashed after moving the image using orbit controls in your Three.js program is likely due to the line being affected by the **antialiasing** settings of the renderer.

When the image is moved, the line's position is <span style="color:#4a00b4;">sub-pixel aligned</span>, causing it to be rendered with antialiasing applied, which can result in a dashed or blurred appearance.

To avoid this, you can try adjusting the antialiasing settings of the renderer or use an alternative approach. Here are a couple of potential solutions you can try:

1. **Disable antialiasing for the line** ✅

   ```javascript
   let lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
   lineMaterial.polygonOffset = true;
   lineMaterial.polygonOffsetFactor = -1;
   lineMaterial.depthTest = false;
   lineMaterial.depthWrite = false;
   lineMaterial.transparent = true;
   lineMaterial.alphaTest = 0.5; // Adjust this value as needed
   
   let line = new THREE.Line(lineGeometry, lineMaterial);
   scene.add(line);
   ```

    <br>
   This approach involves tweaking the **line material properties** to make it appear more solid. The `polygonOffset` property ensures that the line is rendered slightly closer to the camera than other geometry, helping to avoid z-fighting artifacts.

2. **Use an alternative line rendering technique**

   Instead of using `THREE.Line`, you can use a `THREE.Mesh` with a narrow box geometry to simulate a solid line. This technique can often produce better results when antialiasing is enabled.

   ```javascript
   let lineGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
   let lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
   
   let line = new THREE.Mesh(lineGeometry, lineMaterial);
   // Set the position, rotation, and scale of the line as needed
   scene.add(line);
   ```

   <br>
   By using a **thin box geometry** and a **mesh material** instead of a line material, you can achieve a solid line appearance without being affected by the antialiasing settings.

Feel free to experiment with these approaches to see which one works best for your specific case.

## sub-pixel aligned ?:(

Imagine you have a picture made up of tiny little squares called pixels. Each pixel is like a small dot that has a specific color. When you draw a line on the picture, the line needs to follow the positions of these pixels.

Now, sometimes when you move the picture around, the line might end up **in between two pixels.** It's like trying to draw a line that goes right in the middle of two dots. When this happens, the computer needs to decide how to display the line on the screen since it can't color the exact middle of two pixels.

To solve this, the computer uses a technique called **antialiasing.** It tries to make the line appear smooth by partially coloring the pixels around the line. This can give the line a slightly blurry or dashed look.

**In your program,** when you draw a line and then move the picture using orbit controls, the line's position might end up between pixels, and the antialiasing is applied to make it look smooth. However, this can cause the line to appear dashed instead.

To avoid this, you can try the solutions I mentioned earlier to make the line **look more solid** and prevent it from being affected by the antialiasing settings.

<br>

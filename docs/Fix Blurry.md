## Fix blurry image

If the images loaded into your Three.js `PlaneGeometry` are appearing blurry, there are a few potential causes and solutions you can try:

1. **Image resolution:** Check the resolution of your images. If they have a low resolution, they might appear blurry when stretched across the `PlaneGeometry`. Try using higher-resolution images that **match the size** of the `PlaneGeometry`.

    ```sh
    identify -verbose Victoriosa.jpg | grep "Resolution:"
    
    identify -format "%x x %y" Victoriosa.jpg
    
    # Look for "density", "DPI", or "resolution".
    file Victoriosa.jpg
    ```

2. **Texture filtering:** Adjust the texture filtering settings to improve image quality. By default, Three.js uses **bilinear filtering**, which can cause blurriness when scaling images. You can try changing the filtering mode to achieve better results. For example, you can use `THREE.NearestFilter` for **pixelated** results or `THREE.LinearFilter` for **smoother** results.

    **Set the filtering mode:**

    ```javascript
    const texture = new THREE.TextureLoader().load('path/to/image.jpg');
    // Adjust the filtering mode
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    ```

    Experiment with different filter options to find the one that suits your needs.

3. **Adjusting texture repeat:** If your `PlaneGeometry` is larger than the image dimensions, the image will **repeat** or **stretch** across the geometry. This can cause blurriness. Ensure that the **dimensions** of your `PlaneGeometry` **match** the image size or adjust the texture repeat behavior. You can use the `repeat` property of the texture to control how the image is mapped onto the geometry:

    ```javascript
    // Set repeat values according to your needs
    texture.repeat.set(1, 1);
    ```

4. **Render settings:** If your scene has antialiasing disabled, it can lead to visual artifacts and make the image appear blurry. Ensure that you have `antialiasing` enabled in your `renderer` configuration:

    ```javascript
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    ```

5. **High-resolution display:** If you're viewing your application on a high-resolution display, the blurriness might be an artifact of the display scaling. In such cases, you can try **adjusting the pixel ratio** to enhance the sharpness:

    ```javascript
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    ```

Experiment with different pixel ratios to achieve the desired result.

By addressing these potential causes and adjusting the relevant settings, you should be able to **improve the image quality** and **reduce blurriness** in your application.

## Fix blurry text

<span style="color:#0000dd;">Text geometry.  Depending on where it is on the screen, it could look blurry... like the font is intentionally doubled.
It's called something in css &ndash; check "colors" somewhere...</span>

```js
textGeometry = new TextGeometry(message, {
  font: font,
  size: 0.2, // <-
  height: 0.1 // <-
});
```

<br>

<span style="color:#0000dd;">One of the options <- fixed it, not this.  But just in case I need it for something else &ndash;</span>

The issue you're referring to is known as **"subpixel rendering"** or **"font antialiasing."** In certain cases, when the text is positioned at non-integer pixel coordinates, the browser's rendering engine may attempt to antialias the edges of the text by blending the font color with the background color. This can result in a blurry or doubled appearance.

<span style="color:#0000dd;">This issue not to be confused with the "dashed line issue."  Even tho they're similar.</span>

To ensure that the text appears sharp and clear, regardless of its position on the screen, you can apply the following CSS rule to the container element that holds your three.js canvas:

```css
.container-element {
  transform: translateZ(0);
}
```

<br>

By using the `translateZ(0)` transform, you trigger a hardware acceleration feature in most modern web browsers that forces the element to be rendered using the GPU. This helps eliminate subpixel rendering and produces crisper text.

Keep in mind that the `.container-element` should be replaced with the actual class or ID of the element containing your three.js canvas.

Applying this CSS rule should improve the rendering quality of your text geometry.

<br>


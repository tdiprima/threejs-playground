## Get pixel data canvas

<span style="color:blue;font-size:larger;">User
Is there a way to get pixel data from canvas.toDataURL("image/png");</span>

Yes, you can get pixel data from a canvas converted to a data URL by first drawing the image back onto a canvas element and then using the `getImageData` method. Here's a step-by-step approach:

1. Create a new `Image` object and set its `src` to the data URL.
2. Once the image is loaded, draw it onto a canvas.
3. Use `getImageData` to extract pixel data from the canvas.

Here's a code example:

```javascript
// Assume dataURL is your canvas.toDataURL("image/png");
const dataURL = 'your_data_url_here';

// Create a new image object
const img = new Image();
img.src = dataURL;

img.onload = function() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Get the pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data; // An array of [r, g, b, a] values for each pixel

    // Do something with the pixels...
};
```

Make sure the canvas origin (or the data URL origin) is the same as your script's origin to avoid security errors due to the same-origin policy. If the data URL is generated from a canvas in the same document, this shouldn't be a problem.

<span style="color:blue;font-size:larger;">Yeah, so after `ctx.drawImage` you do `ctx.getImageData` and `imageData.data`.</span>

See [download3.html]()

And [here](https://discourse.threejs.org/t/solved-extract-pixels-data-from-datatexture/), just in case.

<br>

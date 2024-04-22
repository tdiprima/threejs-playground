## OpenCV

OpenCV (Open Source Computer Vision Library) is a library of programming functions mainly aimed at real-time computer vision, and it's a powerful tool for image processing tasks.

Make sure you have included OpenCV.js in your project. You can either download it and host it yourself or use a CDN. More information can be found on the [OpenCV.js tutorial page](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html).

## If opencv says it's not defined, do this

The error "Uncaught ReferenceError: cv is not defined" indicates that the code is trying to access the `cv` object before it's available. This can happen when the script containing `cv['onRuntimeInitialized']=onOpenCvReady;` runs before the OpenCV.js script has been loaded and executed.

To fix this, you should modify the script to ensure that it doesn't try to set `cv['onRuntimeInitialized']` until after the OpenCV.js library has been loaded. One way to do this is to move this line inside a function that's called by the `onload` event of the OpenCV.js script tag. Here's how you can adjust your HTML:

```php
<!DOCTYPE html>
<html lang="en">
<head>
  <title>OpenCV.js findContours and drawContours Example</title>
  <style>
    #canvasOutput {
      width: 100%;
      height: 80vh;
      border: 1px solid black;
    }
  </style>
</head>
<body>
<h1>OpenCV.js findContours and drawContours Example</h1>

<div>
  <img id="inputImage" src="/images/image3.jpg" alt="Input image">
</div>
<br>
<div>
  <canvas id="canvasOutput"></canvas>
</div>

<script async src="opencv.js" onload="onOpenCvLoad();" onerror="console.error('Error loading opencv.js');"></script>
<script>
  function onOpenCvLoad() {
    cv['onRuntimeInitialized'] = onOpenCvReady;
  }

  function onOpenCvReady() {
    // OpenCV.js is ready. Place your OpenCV related code here.
    console.log("OpenCV.js is ready.");
    const src = cv.imread('inputImage');
    // ... rest of your code ...
  }
</script>
</body>
</html>
```

In this revised code:

- The `onOpenCvLoad` function is called when the `opencv.js` script finishes loading (due to the `onload` attribute in the script tag).
- Inside `onOpenCvLoad`, we set `cv['onRuntimeInitialized']` to `onOpenCvReady`. This ensures that `cv['onRuntimeInitialized']` is not set until after the OpenCV.js library is loaded.
- `onOpenCvReady` is then executed once OpenCV.js is fully initialized.

This should resolve the "cv is not defined" error and ensure that your OpenCV.js code runs at the correct time.

```html
<script async src="https://docs.opencv.org/master/opencv.js" onload="onOpenCvReady();" onerror="console.error('Error loading opencv.js');"></script>
```
<br>

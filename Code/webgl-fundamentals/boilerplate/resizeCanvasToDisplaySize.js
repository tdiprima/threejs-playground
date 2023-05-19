/**
 * Resize Canvas
 * https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
 * @param canvas
 * @return {boolean}
 */
function resizeCanvasToDisplaySize(canvas) {
  let displayWidth, displayHeight;

  // Lookup the size the browser is displaying the canvas in CSS pixels.
  // displayWidth  = canvas.clientWidth;
  // displayHeight = canvas.clientHeight;

  let dpr = window.devicePixelRatio;
  // displayWidth = Math.round(canvas.clientWidth * dpr);
  // displayHeight = Math.round(canvas.clientHeight * dpr);

  let {width, height} = canvas.getBoundingClientRect();
  displayWidth = Math.round(width * dpr);
  displayHeight = Math.round(height * dpr);

  // Check if the canvas is not the same size.
  let needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

// function drawScene()...
// resizeCanvasToDisplaySize(gl.canvas);

// The WebGL version loops over the vertices, but the math WE SUPPLIED
// is in GLSL and is executed by the GPU.
function main() {
  let cubeVertices = [
    -1, -1, -1,
    1, -1, -1,
    1,  1, -1,
    -1,  1, -1,
    -1, -1,  1,
    1, -1,  1,
    1,  1,  1,
    -1,  1,  1,
  ];

  let indices = [
    0, 1,
    1, 2,
    2, 3,
    3, 0,
    4, 5,
    5, 6,
    6, 7,
    7, 4,
    0, 4,
    1, 5,
    2, 6,
    3, 7,
  ];

  let canvas = document.querySelector("#c");
  let gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  let buffer;

  let program = createProgramFromScripts(
    gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  gl.useProgram(program);

  let positionLoc = gl.getAttribLocation(program, "a_position");
  let worldViewProjectionLoc =
    gl.getUniformLocation(program, "u_worldViewProjection");

  /* Buffers are arrays of binary data you upload to the GPU */

  // ARRAY_BUFFER, Float32
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cubeVertices),
    gl.STATIC_DRAW);

  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

  // ELEMENT_ARRAY_BUFFER, Uint16
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW);

  function render(clock) {
    clock *= 0.001; // speed

    // WebGL canvas
    resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);

    let fieldOfView = Math.PI * 0.25;
    let aspect = canvas.clientWidth / canvas.clientHeight;
    let projection = perspective(fieldOfView, aspect, 0.0001, 500);
    let radius = 5;
    let eye = [Math.sin(clock) * radius, 2, Math.cos(clock) * radius]; // +2
    let target = [0, 0, 0];
    let up = [0, 1, 0];
    let camera = lookAt(eye, target, up);
    let view = inverse(camera);

    let worldViewProjection = multiply(projection, view);

    /* Uniforms are global variables you set before you execute your shader program. */

    gl.uniformMatrix4fv(
      worldViewProjectionLoc, false, worldViewProjection);

    gl.drawElements(gl.LINES, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();

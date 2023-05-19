/* INITIALIZATION CODE */

// Look up our canvas element
let canvas = document.querySelector("#c");

// Create a WebGLRenderingContext
let gl = canvas.getContext("webgl");
if (!gl) {
  // no webgl for you!
  // alert("Unable to set up WebGL. Your browser or computer may not support it.");
  // return;
}

/**
 * Create Shader
 *
 * @param {object} gl - WebGLRenderingContext
 * @param {number} type - The type of shader, VERTEX_SHADER or FRAGMENT_SHADER.
 * @param {string} source - shader code
 * @return {WebGLShader} - WebGLShader object
 */
function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  // !success. Something went wrong during compilation.
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

// Get the strings for our GLSL shaders
let vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
let fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

// Create a shader, upload the GLSL source, and compile the shader
let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

/**
 * Create Program
 *
 * @param {object} gl - WebGLRenderingContext
 * @param {object} vertexShader - WebGLShader
 * @param {object} fragmentShader - WebGLShader
 * @return {object} program - WebGLProgram
 */
function createProgram(gl, vertexShader, fragmentShader) {
  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  // !success. Something went wrong with the link.
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Link the two shaders into a program
let program = createProgram(gl, vertexShader, fragmentShader);

/* Now that we've created a GLSL program on the GPU we need to supply data to it. */

// Look up where the vertex data needs to go.
let positionAttributeLocation = gl.getAttribLocation(program, "a_position");

// Attributes get their data from buffers; so we need to create a buffer.
let positionBuffer = gl.createBuffer();

// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer).
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Put three 2D clip space points in the buffer
let positions = [
  0, 0,
  0, 0.5,
  0.7, 0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

/* RENDERING CODE */

// Before we draw we should resize the canvas to match its display size.
resizeCanvasToDisplaySize(gl.canvas);

// We need to tell WebGL how to convert from the clip space values, back into pixels.
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Tell WebGL which shader program to execute.
gl.useProgram(program);

/* Tell WebGL how to take data from the buffer, and supply it to the attribute in the shader. */

// First, turn the attribute on.
gl.enableVertexAttribArray(positionAttributeLocation);

/* Then we need to specify how to pull the data out */

// Bind the position buffer.
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
let size = 2;          // 2 components per iteration
let type = gl.FLOAT;   // the data is 32bit floats
var normalize = false; // don't normalize the data
let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
var offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation, size, type, normalize, stride, offset);

// Finally - draw!
let primitiveType = gl.TRIANGLES;
let count = 3;
gl.drawArrays(primitiveType, offset, count);

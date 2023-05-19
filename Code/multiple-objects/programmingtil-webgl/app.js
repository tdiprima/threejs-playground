(function(global) {
  let canvas;
  let gl;
  let program;

  glUtils.SL.init({
    callback: function() {
      main();
    }
  });

  function main() {
    // Register Callbacks
    window.addEventListener("resize", resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    let vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    let fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);

    program = glUtils.createProgram(gl, vertexShader, fragmentShader);

    gl.useProgram(program);

    resizer();
  }

  // draw!
  function draw() {
    // renderer info
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Write the positions of vertices to a vertex shader
    // drawPoint();
    // drawLine();
    // drawTriangle();

    let pointsVertices = new Float32Array([-0.5, -0.5]);
    let linesVertices = new Float32Array([-0.25, -0.25, -0.5, +0.5]);
    let triangleVertices = new Float32Array([+0.5, -0.5, 0.0, 0.25, +0.5, 0.0]);
    drawA(gl.POINTS, pointsVertices);
    drawA(gl.LINES, linesVertices);
    drawA(gl.TRIANGLES, triangleVertices);
  }

  function drawPoint() {
    let n = initPointBuffers();
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    gl.drawArrays(gl.POINTS, 0, n);
  }

  function initPointBuffers() {
    let vertices = new Float32Array([-0.5, -0.5]);
    let n = 1;

    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(program, "aPosition");
    if (aPosition < 0) {
      console.log("Failed to get the storage location of aPosition");
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function drawLine() {
    let n = initLineBuffers();
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    gl.drawArrays(gl.LINES, 0, n);
  }

  function initLineBuffers() {
    let vertices = new Float32Array([-0.25, -0.25, -0.25, +0.5]);
    let n = 2;

    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(program, "aPosition");
    if (aPosition < 0) {
      console.log("Failed to get the storage location of aPosition");
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function drawTriangle() {
    let n = initTriangleBuffers();
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    gl.drawArrays(gl.TRIANGLES, 0, n);
  }

  function initTriangleBuffers() {
    let vertices = new Float32Array([+0.5, -0.5, 0.0, 0.0, +0.5, 0.0]);
    let n = 3;

    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(program, "aPosition");
    if (aPosition < 0) {
      console.log("Failed to get the storage location of aPosition");
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  // Generic format
  function drawA(type, vertices) {
    let n = initBuffers(vertices);
    if (n < 0) {
      console.log("Failed to set the positions of the vertices");
      return;
    }
    gl.drawArrays(type, 0, n);
  }

  function initBuffers(vertices) {
    let n = vertices.length / 2;

    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let aPosition = gl.getAttribLocation(program, "aPosition");
    if (aPosition < 0) {
      console.log("Failed to get the storage location of aPosition");
      return -1;
    }

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return n;
  }

  function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw();
  }
})(window || this);

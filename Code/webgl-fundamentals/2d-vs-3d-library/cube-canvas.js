// The Canvas version loops over the vertices, does the math WE SUPPLIED
// and draws some lines in 2D.
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
  let ctx = canvas.getContext("2d");

  function render(clock) {
    clock *= 0.0005; // speed

    let scale = 2;

    // HTML5 canvas
    resizeCanvasToDisplaySize(ctx.canvas, window.devicePixelRatio);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(canvas.width / scale, canvas.height / scale);
    // ctx.lineWidth = scale / canvas.width;
    ctx.lineWidth = 0.005;
    ctx.strokeStyle = "#ff5733"; // Outrageous Orange
    // ctx.strokeStyle = "#fe0080"; // Rose

    let fieldOfView = Math.PI * 0.25;
    let aspect = canvas.clientWidth / canvas.clientHeight;
    let projection = perspective(fieldOfView, aspect, 1, 500);
    let radius = 5;
    let eye = [Math.sin(clock) * radius, -2, Math.cos(clock) * radius]; // -2
    let target = [0, 0, 0];
    let up = [0, 1, 0];
    let camera = lookAt(eye, target, up);
    let view = inverse(camera);

    let worldViewProjection = multiply(projection, view);

    drawLines(cubeVertices, indices, worldViewProjection);
    ctx.restore();
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  function drawLines(cubeVertices, indices, worldViewProjection) {
    ctx.beginPath();

    // transform points
    let points = [];

    for (let ii = 0; ii < cubeVertices.length; ii += 3) {
      points.push(
        transformPoint(worldViewProjection, [cubeVertices[ii + 0], cubeVertices[ii + 1], cubeVertices[ii + 2]])
      );
    }

    for (let ii = 0; ii < indices.length; ii += 2) {
      let p0 = points[indices[ii + 0]];
      let p1 = points[indices[ii + 1]];
      ctx.moveTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
    }
    ctx.stroke();
  }
}

main();

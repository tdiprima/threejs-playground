  // Button event listeners
  let rectangleButton = document.getElementById("rectangle");
  let ellipseButton = document.getElementById("ellipse");
  let polygonButton = document.getElementById("polygon");

  // Button click handlers
  rectangleButton.addEventListener("click", function () {
    handler("rectangle");
  });

  ellipseButton.addEventListener("click", function () {
    handler("ellipse");
  });

  polygonButton.addEventListener("click", function () {
    handler("polygon");
    points = [];
  });

  function handler(type) {
    // Toggle drawing mode
    isDrawing = !isDrawing;
    console.log(isDrawing ? "drawing on" : "drawing off");

    // Add or remove event listeners
    const method = isDrawing ? 'addEventListener' : 'removeEventListener';
    renderer.domElement[method]("mousedown", onMouseDown, false);
    renderer.domElement[method]("mousemove", onMouseMove, false);
    renderer.domElement[method]("mouseup", onMouseUp, false);
    renderer.domElement[method]("dblclick", onDoubleClick, false);

    typeOfShape = type;
    initGeometry(); // Initialize geometry when button is clicked
  }


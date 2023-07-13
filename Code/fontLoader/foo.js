// todo: esqueleto, 1 text mesh
// The user can add text annotations to the image by clicking on the
// plane and entering text in the input field.

// objects to handle the text annotations
let textGeometry, textMaterial, textMesh;

// initialize text geometry and material
textGeometry = new THREE.TextGeometry("fubar", {
  font: font,
  size: 0.5,
  height: 0.05
});

// todo: hello font color
// textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

// initialize text mesh
textMesh = new THREE.Mesh(textGeometry, textMaterial);
textMesh.visible = false;
scene.add(textMesh);

// handle adding text annotation
function startAddingText() {
  // show text mesh
  textMesh.visible = true;

  // set the textMesh position to the intersection point
  textMesh.position.copy(intersection.point);

  // set default text
  textMesh.geometry = new THREE.TextGeometry("Type your text here", {
    font: font,
    size: 0.5,
    height: 0.05
  });

  // set the textMesh rotation to the camera rotation
  textMesh.rotation.copy(camera.rotation);

  // add text mesh to scene
  scene.add(textMesh);

  // set flag to indicate that we are adding a text annotation
  addingText = true;
}

// handle updating text annotation
function updateTextAnnotation() {
  // update the textMesh geometry based on the user input
  let text = document.getElementById("text-input").value;

  textMesh.geometry = new THREE.TextGeometry(text, {
    font: font,
    size: 0.5,
    height: 0.05
  });
}

// function to end adding text annotation
function endAddingText() {
  // hide text mesh
  textMesh.visible = false;

  // add the text annotation to the annotations array
  annotations.push({
    type: "text",
    text: textMesh.geometry.parameters.text,
    position: textMesh.position.clone(),
    rotation: textMesh.rotation.clone()
  });

  // remove the textMesh from the scene
  scene.remove(textMesh);

  // clear text input field
  document.getElementById("text-input").value = "";

  // set flag to indicate that we are not adding a text annotation
  addingText = false;
}

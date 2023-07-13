// todo: esqueleto, multiple text meshes

// initialize text geometry and material
let textGeometry = new THREE.TextGeometry("fubar", {
  font: font,
  size: 0.5,
  height: 0.05
});

let textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

// hold the text meshes for each text annotation
let textMeshes = [];

// handle adding text annotation
function startAddingText() {
  // create new text mesh
  let textMesh = new THREE.Mesh(textGeometry, textMaterial);

  // set its position and rotation
  textMesh.position.copy(intersection.point);
  textMesh.rotation.copy(camera.rotation);

  // set default text
  textMesh.geometry = new THREE.TextGeometry("Type your text here", {
    font: font,
    size: 0.5,
    height: 0.05
  });

  // add text mesh to scene
  scene.add(textMesh);

  // add text mesh to textMeshes array
  textMeshes.push(textMesh);

  // set flag to indicate that we are adding a text annotation
  addingText = true;
}

// handle updating text annotation
function updateTextAnnotation() {
  // update the most recently added text mesh with user input
  let text = document.getElementById("text-input").value;
  let textMesh = textMeshes[textMeshes.length - 1];

  textMesh.geometry = new THREE.TextGeometry(text, {
    font: font,
    size: 0.5,
    height: 0.05
  });
}

// function to end adding text annotation
function endAddingText() {
  // add text annotation to annotations array
  let textMesh = textMeshes[textMeshes.length - 1];
  annotations.push({
    type: "text",
    text: textMesh.geometry.parameters.text,
    position: textMesh.position.clone(),
    rotation: textMesh.rotation.clone()
  });

  // clear text input field
  document.getElementById("text-input").value = "";

  // set flag to indicate that we are not adding a text annotation
  addingText = false;
}

// function to remove the most recently added text annotation
function removeLastTextAnnotation() {
  let textMesh = textMeshes.pop();
  scene.remove(textMesh);
  annotations.pop();
}

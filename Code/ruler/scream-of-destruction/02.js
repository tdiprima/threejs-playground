import * as THREE from "three";
import { FontLoader } from "/jsm/loaders/FontLoader.js";
import { TextGeometry } from "/jsm/geometries/TextGeometry.js";

let message = "";

let fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", function (font) {
  let line, text;
  let isDrawing = false;

  let scene = new THREE.Scene();

  let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  let lineGeometry, lineMaterial;

  renderer.domElement.addEventListener('mousedown', onMouseDown, false);
  renderer.domElement.addEventListener('mousemove', onMouseMove, false);
  renderer.domElement.addEventListener('mouseup', onMouseUp, false);

  function onMouseDown(event) {
    isDrawing = true;
    let startPoint = getMouseCoordinates(event);
    let startVector = new THREE.Vector3(startPoint.x, startPoint.y, 0);

    lineGeometry = new THREE.BufferGeometry();
    lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      // depthWrite: false
    });

    lineGeometry.setFromPoints([startVector, startVector]);
    line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
  }

  function onMouseMove(event) {
    if (!isDrawing) return;

    let endPoint = getMouseCoordinates(event);
    let endVector = new THREE.Vector3(endPoint.x, endPoint.y, 0);

    line.geometry.setFromPoints([lineGeometry.attributes.position.array[0], endVector]);

    if (text) scene.remove(text);

    let length = Calculate.lineLength(
      lineGeometry.attributes.position.array[0],
      lineGeometry.attributes.position.array[1],
      endVector.x,
      endVector.y
    ).toFixed(2);

    message = `Length: ${length}`;
    console.log(`%c${message}`, "color: #ccff00;");

    let textGeometry = new TextGeometry(message, {
      font: font,
      size: 0.1,
      height: 0.1
    });

    let textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.copy(endVector);
    scene.add(text);

    renderer.render(scene, camera);
  }

  function onMouseUp() {
    isDrawing = false;
    console.log(`%c${message}`, "color: #ccff00;");
  }

  function getMouseCoordinates(event) {
    let mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      let point = intersects[0].point;
      return { x: point.x, y: point.y };
    }

    return { x: 0, y: 0 };
  }

  const Calculate = {
    lineLength(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
  };

  (function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  })();
});
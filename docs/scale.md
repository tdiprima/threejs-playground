Have a look at [image\_line\_coords.html]() for three.js to image coordinate conversion as well.

```js
let planeGeom = new THREE.PlaneGeometry(4, 4); // You play with this for the size
let tex = new THREE.TextureLoader().load(imgSrc, (tex) => {
  tex.needsUpdate = true;

  const imageWidth = tex.image.width;
  const imageHeight = tex.image.height;
  const aspectRatio = imageHeight / imageWidth;

  let planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: tex
  });

  let plane = new THREE.Mesh(planeGeom, planeMaterial);
  plane.scale.set(1.0, aspectRatio, 1.0); // This is how you scale it to fit the image
  scene.add(plane);
});
```

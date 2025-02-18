function Simulation(renderer, width, height) {
  this.width = width;
  this.height = height;
  this.renderer = renderer;
  this.targetPos = 0;

  this.data = new Float32Array(this.width * this.height * 4);

  let r = 1;
  for (let i = 0, l = this.width * this.height; i < l; i++) {
    const phi = Math.random() * 2 * Math.PI;
    const costheta = Math.random() * 2 - 1;
    const theta = Math.acos(costheta);
    r = 0.85 + 0.15 * Math.random();

    this.data[i * 4] = r * Math.sin(theta) * Math.cos(phi);
    this.data[i * 4 + 1] = r * Math.sin(theta) * Math.sin(phi);
    this.data[i * 4 + 2] = r * Math.cos(theta);
    this.data[i * 4 + 3] = Math.random() * 100; // frames life
  }

  let floatType = isMobile.apple.device ? THREE.HalfFloatType : THREE.FloatType;

  this.texture = new THREE.DataTexture(this.data, this.width, this.height, THREE.RGBAFormat, THREE.FloatType);
  this.texture.minFilter = THREE.NearestFilter;
  this.texture.magFilter = THREE.NearestFilter;
  this.texture.needsUpdate = true;

  this.rtTexturePos = new THREE.WebGLRenderTarget(this.width, this.height, {
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: floatType,
    stencilBuffer: false,
    depthBuffer: false,
    generateMipmaps: false
  });

  this.targets = [this.rtTexturePos, this.rtTexturePos.clone()];

  this.simulationShader = new THREE.ShaderMaterial({
    uniforms: {
      active: { type: 'f', value: 1 },
      width: { type: 'f', value: this.width },
      height: { type: 'f', value: this.height },
      oPositions: { type: 't', value: this.texture },
      tPositions: { type: 't', value: null },
      timer: { type: 'f', value: 0 },
      delta: { type: 'f', value: 0 },
      speed: { type: 'f', value: 0.5 },
      reset: { type: 'f', value: 0 },
      offset: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
      genScale: { type: 'f', value: 1 },
      factor: { type: 'f', value: 0.5 },
      evolution: { type: 'f', value: 0.5 },
      inverseModelViewMatrix: { type: 'm4', value: new THREE.Matrix4() },
      radius: { type: 'f', value: 2 }
    },

    vertexShader: document.getElementById('texture_vertex_simulation_shader').textContent,
    fragmentShader: document.getElementById('texture_fragment_simulation_shader').textContent,
    side: THREE.DoubleSide
  });

  this.simulationShader.uniforms.tPositions.value = this.texture;

  this.rtScene = new THREE.Scene();

  this.rtCamera = new THREE.OrthographicCamera(
    -this.width / 2,
    this.width / 2,
    -this.height / 2,
    this.height / 2,
    -500,
    1000
  );

  this.rtQuad = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(this.width, this.height),
    this.simulationShader
  );

  this.rtScene.add(this.rtQuad);

  this.renderer.render(this.rtScene, this.rtCamera, this.rtTexturePos);

  this.plane = new THREE.Mesh(
    new THREE.PlaneGeometry(64, 64),
    new THREE.MeshBasicMaterial({ map: this.rtTexturePos, side: THREE.DoubleSide })
  );
  // scene.add( this.plane );
}

Simulation.prototype.render = function(time, delta) {
  this.simulationShader.uniforms.timer.value = time;
  this.simulationShader.uniforms.delta.value = delta;

  this.simulationShader.uniforms.tPositions.value = this.targets[this.targetPos];
  this.targetPos = 1 - this.targetPos;
  this.renderer.render(this.rtScene, this.rtCamera, this.targets[this.targetPos]);
};

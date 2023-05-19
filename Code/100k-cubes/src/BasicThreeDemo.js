/**
 * Set up scene, camera, renderer.
 */
import './styles.css';
import * as THREE from 'three';
import Stats from 'stats.js'; // standalone package from mrdoob
// OR:
// import Stats from '/jsm/libs/stats.module.js';

export class BasicThreeDemo {
  /**
   * Constructor
   * @param container - DIV element
   */
  constructor(container) {
    this.container = container;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      stencil: false
    });

    this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
    this.renderer.setPixelRatio(Math.max(1.5, window.devicePixelRatio));

    // This class provides a simple info box that will help you monitor your code performance.
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    container.append(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 10000);
    this.camera.position.z = 50;
    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock();
    this.disposed = false;
    this.tick = this.tick.bind(this);
    this.init = this.init.bind(this);
    this.setSize = this.setSize.bind(this);
  }

  init() {
    this.tick();
  }

  /**
   * This loops over and over
   * @param width
   * @param height
   * @param updateStyle
   */
  setSize(width, height, updateStyle) {
    // Why are we hard-coding false instead of using updateStyle?
    this.renderer.setSize(width, height, false);
  }

  onResize() {}

  dispose() {
    this.disposed = true;
  }

  update() {}

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  tick() {
    if (this.disposed) return;
    if (resizeRendererToDisplaySize(this.renderer, this.setSize)) {
      let canvas = this.renderer.domElement;
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.onResize();
    }
    this.stats.begin();
    this.update();
    this.render();
    this.stats.end();
    requestAnimationFrame(this.tick);
  }
}

/**
 * This loops over and over
 * @param renderer
 * @param setSize
 * @return {boolean}
 */
function resizeRendererToDisplaySize(renderer, setSize) {
  let canvas = renderer.domElement;
  let width = canvas.clientWidth;
  let height = canvas.clientHeight;
  let needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    setSize(width, height, false);
  }
  return needResize;
}

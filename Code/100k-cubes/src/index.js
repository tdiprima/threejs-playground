/**
 * Set up event listeners & configuration.
 */
import debounce from 'debounce';
import { App } from './App';

const lessCount = 500;
const moreCount = 2000;

// TODO: CHANGE COUNT
// const initCount = 2000; // 60 fps
const initCount = 50000; // 100K, 30-45 fps
// const initCount = 500000; // 1M, 15fps (using *cubes*)

let config = {
  // instances per thingy
  nInstances: initCount,
  useCube: true,
  scale: 1
};
// 27,000 60fps
// 58,000 30fps
// also consider that the spheres have a lot of vertices

let container = document.getElementById('app');
let myApp = new App(container, config);
myApp.init();

let less = document.getElementById('less');
let more = document.getElementById('more');

let evenLess = document.getElementById('even-less');
let evenMore = document.getElementById('even-more');

let countEle = document.getElementById('count');
let switchEle = document.getElementById('switch');

// https://github.com/component/debounce
// Useful for implementing behavior that should only happen after a repeated action has completed.
let restart = debounce(myApp.restart, 400);

// The blue and red line of spheres are two separate meshes.
// Each one has nInstances. Then, the final count is nInstances * 2.
countEle.innerText = (config.nInstances * 2).toString();

let addInstances = count => {
  config.nInstances += count;
  config.nInstances = Math.max(lessCount, config.nInstances);

  countEle.innerText = (config.nInstances * 2).toString();

  let scale = 1 - Math.min(1, (config.nInstances - lessCount) / 50000) * 0.8;
  config.scale = scale;
  restart();
};

let handleLess = () => {
  addInstances(-lessCount);
};

let handleEvenLess = () => {
  addInstances(-moreCount);
};

let handleMore = () => {
  addInstances(lessCount);
};

let handleEvenMore = () => {
  addInstances(moreCount);
};

let handleSwitch = () => {
  config.useCube = !config.useCube;
  if (config.useCube) {
    switchEle.innerText = 'Use Spheres';
  } else {
    switchEle.innerText = 'Use Cubes';
  }
  restart();
};
switchEle.addEventListener('click', handleSwitch);

less.addEventListener('click', handleLess);
more.addEventListener('click', handleMore);

evenLess.addEventListener('click', handleEvenLess);
evenMore.addEventListener('click', handleEvenMore);

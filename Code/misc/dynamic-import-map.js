// Dynamic Import Map Setup
// Example dev flag, replace with your actual logic
const dev = true; // Or false based on your environment detection logic

// Define your import map base on the dev flag
const importMap = {
  imports: {
    "three": dev ? "/path-to-dev-threejs/three.module.js" : "/path-to-prod-threejs/three.module.js",
    "three/addons/": dev ? "/path-to-dev-threejs/examples/jsm/" : "/path-to-prod-threejs/examples/jsm/",
    "zephyr": "./zephyr.js"
  }
};

// Create a script element for the import map
const script = document.createElement('script');
script.type = 'importmap';
script.textContent = JSON.stringify(importMap);

// Append the script to the head to make it available
document.head.appendChild(script);

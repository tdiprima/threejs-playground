import {
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  AudioListener,
  AudioLoader,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CubeTextureLoader,
  DirectionalLight,
  Group,
  Line,
  LineBasicMaterial,
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PositionalAudio,
  RGBAFormat,
  Scene,
  PCFSoftShadowMap,
  sRGBEncoding,
  TextureLoader,
  Quaternion,
  WebGLRenderer
} from "./mod139/build/three.module.js";

import Stats from "./mod139/examples/jsm/libs/stats.module.js";

import { GLTFLoader } from "./mod139/examples/jsm/loaders/GLTFLoader.js";

import { Lensflare, LensflareElement } from "./mod139/examples/jsm/objects/Lensflare.js";

/* FILES */
const PROPELLER = "fx/prop.jpg";
const CLOUDS = ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"];
const LENSFLARE = "sky/fx/lensflare1.png";
const HEXANGLE = "sky/fx/hexangle.png";
const UNDERCAST = "sky/fx/undercast.png";
const AIRCRAFT_MODEL = "fm2_flyt_caf_npa.glb";
const ROTATED_MODEL = "fm2_flyt_vcp_npa.glb";
const WAV1 = "fm2.wav";
const WAV2 = "fm2_prop.wav";

let envMap = 0;
let AC_Head = 0;
let AC_Bank = 0;
let AC_Ptch = 0;

/* = AC.FLYT VARIABLES ======================================================= */

// Used for moving undercast
let DLTime = 1 / 60;
let SpdUPH = 200;
let SpdUPS = (SpdUPH * 5280) / 3600; // Aircraft Speed (FPS)
let SpdDLT = SpdUPS * DLTime; // Aircraft Speed (DLT)
let PSpdZV;
let MSpdZV,
  MSpdXV;
let MPosZV,
  MPosYV,
  MPosXV;
MPosYV = 1000;

/* = ACdataUS.FM2.txt VARIABLES ============================================== */

let USorSI = "US"; // Units of Measurement (US or SI)
let TrmAdj = 2.5; // Elevator Trim Adjustment

/* = INPUT VALUES ============================================================ */

// Aircraft Information
let ACBank = 0; // Initial Bank
let ACPtch = 0; // Initial Pitch
let ACHead = 10; // Initial Heading
let PwrPct = 0.8; // Initial Power
let ACType = "fm2"; // Name of subdirectory where model is stored
let ACFile = AIRCRAFT_MODEL; // Name of aircraft model file
let VCFile = ROTATED_MODEL; // Name of aircraft model file (rotated blender file)

// Background
let SBName = "cloudy2"; // Skybox directory name

// Light
let LgtLat = 55; // Vertical position of light/sun
let LgtLon = 220; // Compass direction of light/sun
let LFFlag = 1; // Lensflare flag (1 = lensflare on)

// Sound
let sndF01 = WAV1; // File
let sndV01 = 0.3; // Volume
let sndF02 = WAV2; // File (own engine)
let sndV02 = 0.1; // Volume

// Stats
let StsFlg = 1; // Stats ((0 = off, 1 = on)
let stats = 0;

/* = FIXED VALUES =========================================================== */

// Aircraft
let ACPath = `models/${ACType}/`;

// Controls
let BnkSpd = 0.5; // Bank Speed
let PitSpd = 0.5; // Pitch Speed

// Aircraft Animations
let anmfps = 24; // Blender FPS

// Background
let bakclr = 0; // Default background color (black)

// Moving Undercast
let UCFlag = 1; // Moving undercast
// Size of each square = GrdSpc by GrdSpc, radius = GrdSpc/2
let GrdRow = 31; // Rows (use odd number)
let GrdCol = GrdRow; // Cols
let GrdNum = GrdRow * GrdCol; // Size of array
let GrdSpc = 5280; // Size of square (5280 = 1 mile / 1 section)
let GrdIdn = [0]; // Ground ID
GrdIdn[GrdNum - 1] = 0;
let GrdPtr = [0]; // Ground Address
GrdPtr[GrdNum - 1] = 0;
let GrndXV = [0]; // Ground X Value
GrndXV[GrdNum - 1] = 0;
let GrndZV = [0]; // Ground Z Value
GrndZV[GrdNum - 1] = 0;

// Light
let LgtClr = 0xffffff; // Color of light/sun (default)
let LgtInt = 1; // Default intensity of light/sun (default)
let LgtDst = 1000;

// Camera - Lat/Lon = direction the camera is pointing relative to aircraft (straight ahead = 0/0)
let SkyLim = 10000; // Max viewing distance
let CamLat = -10; // (+/-90)
let CamLtX = 45; // Max lat
let CamLon = 300; // (0-360)
let CamLnX = 110; // Max lon (Internal View Only)
let CamDst = 60; // Distance from axis of rotation
let CamDif = 0.05; // In/out speed
let CamMax = CamDst * 1.2; // Maximum distance
let CamMin = CamDst * 0.8; // Minimum distance

// Math Predefined
let PieVal = Math.PI; // PI
let DegRad = PieVal / 180; // Convert Degrees to Radians
let RadDeg = 180 / PieVal; // Convert Radians to Degrees

/* = VARIABLES =============================================================== */

// Key Inputs
let InpACB = 0;
let InpPPP = 0;
let InpYaw = 0;

// Aircraft Information
let ACLftD = 0;
let ACBDif = 0;
let PPPDif = 0;
let YawDif = 0;
let GrFlag = 0;
let ACPAdj = 0;

// Miscellaneous
let ACBrad; // radians
let ACHSpd = 0; // Turn Speed

// Aircraft Animations

// Mixers - Aircraft
let mxProp = 0; // Propeller
let mxRudr = 0; // Rudder
let mxElev = 0; // Elevator
let mxAilL = 0; // AileronL
let mxAilR = 0; // AileronR
let mxFlpL = 0; // FlapL
let mxFlpR = 0; // FlapR
let mxWhHL = 0; // WheelL Hinge
let mxWhHR = 0; // WheelR Hinge
let mxWhBL = 0; // WheelL StrutB
let mxWhBR = 0; // WheelR StrutB
let mxWhTL = 0; // WheelL StrutT
let mxWhTR = 0; // WheelR StrutT
let mxWhSL = 0; // WheelL Shock
let mxWhSR = 0; // WheelR Shock
let mxWhUL = 0; // WheelL Upper
let mxWhUR = 0; // WheelR Upper
let mxCanp = 0; // Canopy
let mxHook = 0; // Tailhook

// Mixers - Virtual Cockpit
let mxVCPr = 0; // Propeller
let mxVCAL = 0; // AileronL
let mxVCAR = 0; // AileronR
let mxVCCn = 0; // Canopy
let mxVCGH = 0; // Gauge - Compass Heading
let mxVCGA = 0; // Gauge - AI Arrow
let mxVCGB = 0; // Gauge - AI Bank
let mxVCGP = 0; // Gauge - AI Pitch
let mxVCPA = 0; // Pointer - Altitude
let mxVCPB = 0; // Pointer - Altitude X 1000
let mxVCPS = 0; // Pointer - MPH
let mxVCPT = 0; // Pointer - Turn Indicator
let HdgOld = 0; // Old Heading
let mxVCPC = 0; // Pointer - Ball
let mxVCPV = 0; // Pointer - VSI
let AltOld = 0; // Old Altitude
let mxVCPM = 0; // Manifold Pressure
let mxVCPR = 0; // Pointer - RPM
let mxVCPH = 0; // Pointer - Heading
let mxVCLH = 0; // Left Hand
let mxVCLA = 0; // Left Arm
let mxVCRP = 0; // Right Hand - Pitch
let mxVCRB = 0; // Right Hand - Bank
let mxVCRA = 0; // Right Arm - Pitch and Bank
let mxVCRL = 0; // Rudder Left
let mxVCRR = 0; // Rudder Right
let mxVCLL = 0; // Leg Left
let mxVCLR = 0; // Leg Right
let mxVCHD = 0; // Pilot Head

// All range from 0 to 360 with center at 180
let spnprp = 180; // SpinProp 	degrees = 0 to 360
let rudder = 180; // Rudder 		degrees = +/- 360
let elvatr = 180; // Elevator 	degrees = +/- 360
let aillft = 180; // AileronL 	degrees = +/- 360
let ailrgt = 180; // AileronR 	degrees = +/- 360
let flppos = 180; // Flaps 		degrees = 0 to 180
let lngpos = 0; // Landing Gear degrees = 0 to 180
let canpos = 180; // Canopy 		degrees = 0 to 180
let thkpos = 180; // Tailhook 	degrees = 0 to 180
let cmphdg = 0; // Compass Heading
let atiarr = 180; // Attitude - Arrow
let atibnk = 0; // Attitude - Bank
let atipit = 180; // Attitude - Pitch
let altft0 = 0; // Altitude - feet
let altft1 = 0; // Altitude - feet X 1000
let spdmph = 0; // Speed - MPH
let vsifpm = 0; // Vertical Speed - fpm
let manprs = 0; // Manifold Pressure
let rpmprp = 0; // Propeller RPM
let hdgdif = 180; // Change in heading
let yawval = 180; // Slip indicator
let stkpit = 180; // Joystick pitch
let stkpcm = 0; // cumulative
let stkbnk = 180; // Joystick bank
let stkbcm = 0; // cumulative
let vchead = 0; // Pilot head

// Gear and Flap
let LGFlag = 0; // Gear Flag (up/down)
let lngspd = 0; // Change in Landing Gear
let FpFlag = 0; // Flap Flag (up/down)
let flpspd = 0; // Change in Flaps
let CnFlag = 0; // Canopy Flag (up/down)
let canspd = 0; // Change in Canopy
let THFlag = 0; // Tailhook (up/down)
let thkspd = 0; // Change in Canopy

// Sound
let SndFlg = 0;

// Camera
let CamDs0,
  CamLt0,
  CamLn0; // Store external info
let onPointerDownX,
  onPointerDownY,
  onPointerDownLon,
  onPointerDownLat;

// General
let mesh,
  geometry,
  material,
  texture,
  fname;

// Flags
let PawsOn = 0;
let VCFlag = 0; // Default = external view
let CamVOn = 0;
let RefLOn = 0;
let PanFlg = 0; // Panning

/* = KEYBOARD ASSIGNMENTS ==================================================== */
let K_BnkL = 37; // Bank Left (left arrow)
let K_BnkR = 39; // Bank Right (right arrow)
let K_PitU = 40; // Pitch up (down arrow)
let K_PitD = 38; // Pitch down (up arrow)
let K_YawL = 90; // Yaw Left (z)
let K_YawR = 88; // Yaw Right (x)
let K_Flap = 70; // Flaps (f)
let K_Gear = 71; // Landing gear (g)
let K_Hook = 72; // Tailhook (h)
let K_Canp = 67; // Canopy (c)
let K_Soun = 83; // Toggle Sound (s)

/* = THREE.JS VARIABLES ====================================================== */
let container = document.getElementById("container");
let scene = new Scene();
scene.background = new Color(bakclr);
let renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.autoUpdate = true;
renderer.receiveShadow = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Light
let DirLight = new DirectionalLight(LgtClr, LgtInt);
DirLight.castShadow = true;
DirLight.target.position.set(0, 0, 0);
DirLight.shadow.bias = -0.00005; // Default = 0 - causes lines;
DirLight.shadow.mapSize.width = 8192;
DirLight.shadow.mapSize.height = 8192;
DirLight.shadow.camera.near = 0.0001;
DirLight.shadow.camera.far = 1025;
DirLight.shadow.camera.left = -25;
DirLight.shadow.camera.right = 25;
DirLight.shadow.camera.top = 25;
DirLight.shadow.camera.bottom = -25;
scene.add(DirLight);

let AmbLight = new AmbientLight(LgtClr, 0.075);
scene.add(AmbLight);

// Sounds
let listener = new AudioListener();
let sound1 = new PositionalAudio(listener);
let sound2 = new PositionalAudio(listener);

// Camera
let camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, SkyLim);
camera.rotation.order = "YXZ";
camera.position.z = -CamDst;
camera.rotation.y = 180 * DegRad; // Looking in
let CamObj = new Object3D();
CamObj.rotation.order = "YXZ";
CamObj.add(camera);

// Inputs
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);
renderer.domElement.addEventListener("mousedown", onMouseDown, false);
renderer.domElement.addEventListener("mouseup", onMouseUp, false);
renderer.domElement.addEventListener("mousemove", onMouseMove, false);
renderer.domElement.addEventListener("mousewheel", onMouseWheel, {
  capture: false,
  passive: false
});
renderer.domElement.addEventListener("touchstart", onTouchStart, false);
renderer.domElement.addEventListener("touchmove", onTouchMove, false);
document.getElementById("PAW")
  .addEventListener("click", togglePause, false);
document.getElementById("SND")
  .addEventListener("click", toggleSound, false);
document.getElementById("CAM")
  .addEventListener("click", toggleCamera, false);
document.getElementById("REF")
  .addEventListener("click", toggleRefLin, false);
document.getElementById("LGB")
  .addEventListener("click", toggleLGear, false);
document.getElementById("FLP")
  .addEventListener("click", toggleFlaps, false);
document.getElementById("CAN")
  .addEventListener("click", toggleCanopy, false);
document.getElementById("HUK")
  .addEventListener("click", toggleHook, false);
document.getElementById("FST")
  .addEventListener("click", toggleSpdU, false);
document.getElementById("PTD")
  .addEventListener("click", togglePitD, false);
document.getElementById("SLO")
  .addEventListener("click", toggleSpdD, false);
document.getElementById("BKL")
  .addEventListener("click", toggleBnkL, false);
document.getElementById("CTR")
  .addEventListener("click", toggleCntr, false);
document.getElementById("BKR")
  .addEventListener("click", toggleBnkR, false);
document.getElementById("PTU")
  .addEventListener("click", togglePitU, false);
document.getElementById("YWL")
  .addEventListener("click", toggleYawL, false);
document.getElementById("YWR")
  .addEventListener("click", toggleYawR, false);
window.addEventListener("resize", onWindowResize, false);

// Loading Manager
// Create a loading manager to set RESOURCES_LOADED when appropriate.
// Pass loadingManager to all resource loaders.
let loadingManager = new LoadingManager();
let RESOURCES_LOADED = false;
loadingManager.onLoad = function() {
  console.log("loaded all resources");
  RESOURCES_LOADED = true;
};

let txtrloader = new TextureLoader(loadingManager);
let gltfLoader = new GLTFLoader(loadingManager);
let audioLoader = new AudioLoader(loadingManager);

// Wait Screen
let loadingScreen = {
  scene: new Scene(),
  camera: new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100),
  box: 0
};

let boxrot = 0; // keep = 0

/* = 3D OBJECTS AND LINKS ==================================================== */
let CtrObj = new Object3D();
scene.add(CtrObj);
CtrObj.add(CamObj); // Default camera mounting
CtrObj.rotation.y = Mod360(-ACHead) * DegRad;

// Aircraft Mount
let AirAxe = new Object3D();
scene.add(AirAxe);
AirAxe.rotation.order = "YXZ";
AirAxe.rotation.z = Mod360(360 - ACBank) * DegRad; // Bank
AirAxe.rotation.x = Mod360(ACPtch) * DegRad; // Pitch
AirAxe.rotation.y = Mod360(-ACHead) * DegRad; // Heading

// Aircraft
let AirPBY = new Object3D();
AirAxe.add(AirPBY);
AirPBY.rotation.order = "YXZ";
AirPBY.add(sound1); // Attach engine sound to aircraft
AirPBY.add(sound2); // Attach prop sound to aircraft

// VC Camera Mounting
let AirGrp = new Group();
AirGrp.castShadow = true;
AirGrp.receiveShadow = true;
AirPBY.add(AirGrp);
let CamPVC = new Object3D();
CamPVC.rotation.order = "YXZ";
CamPVC.position.y = 3.5; // Distance up
CamPVC.position.z = 2.6; // Distance forward
AirGrp.add(CamPVC);

let ACMine = 0; // My Aircraft (loaded)
let VCMine = 0; // My Virtual Cockpit (loaded)

// Reference Lines - Pitch and Yaw
let RefObj = new Object3D();
RefObj.rotation.order = "YXZ";
AirGrp.add(RefObj);
RefObj.visible = false;

// Reference Lines - Horizon
let HrzObj = new Object3D();
HrzObj.rotation.order = "YXZ";
CtrObj.add(HrzObj);
HrzObj.visible = false;

let quaternion = new Quaternion();

/* = HTML OVERLAY TEXT ======================================================= */

let AC_HeadElement = document.getElementById("AC_Head");
let AC_HeadNode = document.createTextNode("");
AC_HeadElement.appendChild(AC_HeadNode);
let AC_BankElement = document.getElementById("AC_Bank");
let AC_BankNode = document.createTextNode("");
AC_BankElement.appendChild(AC_BankNode);
let AC_PtchElement = document.getElementById("AC_Ptch");
let AC_PtchNode = document.createTextNode("");
AC_PtchElement.appendChild(AC_PtchNode);

/* = Main Program ============================================================ */

initAll();
rendAll();

/* 1 Initialize ============================================================== */

function initAll() {
  WaitScreen(); // load loading screen
  loadSkyBox(); // load skybox
  loadLights(); // init lights
  loadACMine(); // load airplane exterior
  loadVCMine(); // load virtual cockpit
  loadRefLin(); // Load reference lines
  if (UCFlag > 0) loadGround(); // load undercast
  initSounds(); // load sounds
  if (StsFlg > 0) {
    // show stats
    stats = new Stats();
    stats.setMode(0); // FPS only
    stats.domElement.style.cssText = "position:absolute;top:95%;left:90%;";
    container.appendChild(stats.dom);
  }
}

/* Load LWait Screen ========================================================= */

function WaitScreen() {
  // Set up the loading screen scene.
  // It can be treated just like our main scene.
  geometry = new PlaneGeometry(1, 1);
  texture = txtrloader.load(PROPELLER);
  material = new MeshBasicMaterial({ map: texture });
  loadingScreen.box = new Mesh(geometry, material);
  loadingScreen.box.rotation.set(PieVal, 0, 0);
  loadingScreen.box.position.set(0, 0, 5);
  loadingScreen.camera.lookAt(loadingScreen.box.position);
  loadingScreen.scene.add(loadingScreen.box);
}

/* Load SkyBox =============================================================== */

// Load SkyBox
function loadSkyBox() {
  let fpath = `sky/box/${SBName}/`;
  envMap = new CubeTextureLoader(loadingManager).setPath(fpath)
    .load(CLOUDS);
  envMap.format = RGBAFormat;
  envMap.encoding = sRGBEncoding; // to counter gammaFactor lightening
  scene.background = envMap;
}

/* Load Lights =============================================================== */

function loadLights() {
  // Latitude
  let Y = LgtDst * Math.sin(LgtLat * DegRad);
  let Z = LgtDst * Math.cos(LgtLat * DegRad);

  // Longitude
  let X = Z * Math.sin(LgtLon * DegRad);
  Z = -Z * Math.cos(LgtLon * DegRad);

  // Set
  DirLight.position.set(X, Y, Z);

  // Lens Flare
  if (LFFlag > 0) {
    // Load Textures
    let t0 = txtrloader.load(LENSFLARE);
    let t1 = txtrloader.load(HEXANGLE);

    // Activate
    let LF = new Lensflare();
    LF.addElement(new LensflareElement(t0, 512, 0));
    LF.addElement(new LensflareElement(t1, 32, 0.2));
    LF.addElement(new LensflareElement(t1, 64, 0.5));
    LF.addElement(new LensflareElement(t1, 256, 0.9));

    // Latitude
    let Y = 5000 * Math.sin(LgtLat * DegRad);
    let Z = 5000 * Math.cos(LgtLat * DegRad);

    // Longitude
    let X = Z * Math.sin(LgtLon * DegRad);
    Z = -Z * Math.cos(LgtLon * DegRad);

    // Set
    LF.position.set(X, Y, Z);
    scene.add(LF);
  }
}

/* Load External Aircraft Model ============================================== */

function loadACMine() {
  fname = ACPath + ACFile;
  gltfLoader.load(fname, gltf => {
    // The OnLoad function
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        child.material.envMap = envMap;
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (child.name === "propeller" || child.name === "canopy1glass" || child.name === "canopy2glass") {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    ACMine = gltf.scene;
    ACMine.rotation.order = "YXZ";
    /* Animations ------------------------------------------------------------- */
    // Propeller
    let clip = AnimationClip.findByName(gltf.animations, "propellerAction");
    mxProp = new AnimationMixer(ACMine);
    let actun = mxProp.clipAction(clip);
    actun.play();
    if (mxProp) mxProp.setTime(spnprp / anmfps);
    // Rudder
    mxRudr = new AnimationMixer(ACMine);
    clip = AnimationClip.findByName(gltf.animations, "rudderAction");
    actun = mxRudr.clipAction(clip);
    actun.play();
    if (mxRudr) mxRudr.setTime(rudder / anmfps);
    // Elevator
    clip = AnimationClip.findByName(gltf.animations, "elevatorAction");
    mxElev = new AnimationMixer(ACMine);
    actun = mxElev.clipAction(clip);
    actun.play();
    if (mxElev) mxElev.setTime(elvatr / anmfps);
    // AileronL
    clip = AnimationClip.findByName(gltf.animations, "aileronLAction");
    mxAilL = new AnimationMixer(ACMine);
    actun = mxAilL.clipAction(clip);
    actun.play();
    if (mxAilL) mxAilL.setTime(aillft / anmfps);
    // AileronR
    clip = AnimationClip.findByName(gltf.animations, "aileronRAction");
    mxAilR = new AnimationMixer(ACMine);
    actun = mxAilR.clipAction(clip);
    actun.play();
    if (mxAilR) mxAilR.setTime(ailrgt / anmfps);
    // Flap Left
    clip = AnimationClip.findByName(gltf.animations, "flapLAction");
    mxFlpL = new AnimationMixer(ACMine);
    actun = mxFlpL.clipAction(clip);
    actun.play();
    if (mxFlpL) mxFlpL.setTime(flppos / anmfps);
    // Flap Right
    clip = AnimationClip.findByName(gltf.animations, "flapRAction");
    mxFlpR = new AnimationMixer(ACMine);
    actun = mxFlpR.clipAction(clip);
    actun.play();
    if (mxFlpR) mxFlpR.setTime(flppos / anmfps);
    // WheelL Hinge
    if (GrFlag === 0) lngpos = 180;
    clip = AnimationClip.findByName(gltf.animations, "wheel_linkLAction");
    mxWhHL = new AnimationMixer(ACMine);
    actun = mxWhHL.clipAction(clip);
    actun.play();
    if (mxWhHL) mxWhHL.setTime(lngpos / anmfps);
    // WheelR Hinge
    clip = AnimationClip.findByName(gltf.animations, "wheel_linkRAction");
    mxWhHR = new AnimationMixer(ACMine);
    actun = mxWhHR.clipAction(clip);
    actun.play();
    if (mxWhHR) mxWhHR.setTime(lngpos / anmfps);
    // WheelL Strut Low
    clip = AnimationClip.findByName(gltf.animations, "wheel_strutLLAction");
    mxWhBL = new AnimationMixer(ACMine);
    actun = mxWhBL.clipAction(clip);
    actun.play();
    if (mxWhBL) mxWhBL.setTime(lngpos / anmfps);
    // WheelR Strut Low
    clip = AnimationClip.findByName(gltf.animations, "wheel_strutLRAction");
    mxWhBR = new AnimationMixer(ACMine);
    actun = mxWhBR.clipAction(clip);
    actun.play();
    if (mxWhBR) mxWhBR.setTime(lngpos / anmfps);
    // WheelL Strut Top
    clip = AnimationClip.findByName(gltf.animations, "wheel_strutTLAction");
    mxWhTL = new AnimationMixer(ACMine);
    actun = mxWhTL.clipAction(clip);
    actun.play();
    if (mxWhTL) mxWhTL.setTime(lngpos / anmfps);
    // WheelR Strut Top
    clip = AnimationClip.findByName(gltf.animations, "wheel_strutTRAction");
    mxWhTR = new AnimationMixer(ACMine);
    actun = mxWhTR.clipAction(clip);
    actun.play();
    if (mxWhTR) mxWhTR.setTime(lngpos / anmfps);
    // WheelL Shock
    clip = AnimationClip.findByName(gltf.animations, "wheel_shockLAction");
    mxWhSL = new AnimationMixer(ACMine);
    actun = mxWhSL.clipAction(clip);
    actun.play();
    if (mxWhSL) mxWhSL.setTime(lngpos / anmfps);
    // WheelR Shock
    clip = AnimationClip.findByName(gltf.animations, "wheel_shockRAction");
    mxWhSR = new AnimationMixer(ACMine);
    actun = mxWhSR.clipAction(clip);
    actun.play();
    if (mxWhSR) mxWhSR.setTime(lngpos / anmfps);
    // WheelL TopTop
    clip = AnimationClip.findByName(gltf.animations, "wheel_toptopLAction");
    mxWhUL = new AnimationMixer(ACMine);
    actun = mxWhUL.clipAction(clip);
    actun.play();
    if (mxWhUL) mxWhUL.setTime(lngpos / anmfps);
    // WheelR TopTop
    clip = AnimationClip.findByName(gltf.animations, "wheel_toptopRAction");
    mxWhUR = new AnimationMixer(ACMine);
    actun = mxWhUR.clipAction(clip);
    actun.play();
    if (mxWhUR) mxWhUR.setTime(lngpos / anmfps);
    // Canopy
    clip = AnimationClip.findByName(gltf.animations, "canopyAction");
    mxCanp = new AnimationMixer(ACMine);
    actun = mxCanp.clipAction(clip);
    actun.play();
    if (mxCanp) mxCanp.setTime(canpos / anmfps);
    // Animation #09 Tailhook
    clip = AnimationClip.findByName(gltf.animations, "tailhookAction");
    mxHook = new AnimationMixer(ACMine);
    actun = mxHook.clipAction(clip);
    actun.play();
    if (mxHook) mxHook.setTime(thkpos / anmfps);
    //
    AirGrp.add(ACMine);
    ACMine.castShadow = true;
    ACMine.receiveShadow = true;
  });
}

/* Load Internal Aircraft Model ============================================== */

function loadVCMine() {
  fname = ACPath + VCFile;
  gltfLoader.load(fname, gltf => {
    VCMine = gltf.scene;
    gltf.scene.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
      if (child.name === "propeller" || child.name === "glass") {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    // Convert from feet to meters
    if (USorSI === "SI") VCMine.scale.set(Ft2Mtr, Ft2Mtr, Ft2Mtr);
    /* Animations ------------------------------------------------------- */
    // Propeller
    let clip = AnimationClip.findByName(gltf.animations, "propellerAction");
    mxVCPr = new AnimationMixer(VCMine);
    let actun = mxVCPr.clipAction(clip);
    actun.play();
    if (mxVCPr) mxVCPr.setTime(spnprp / anmfps);
    // AileronL
    clip = AnimationClip.findByName(gltf.animations, "aileronLAction");
    mxVCAL = new AnimationMixer(VCMine);
    actun = mxVCAL.clipAction(clip);
    actun.play();
    if (mxVCAL) mxVCAL.setTime(aillft / anmfps);
    // AileronR
    clip = AnimationClip.findByName(gltf.animations, "aileronRAction");
    mxVCAR = new AnimationMixer(VCMine);
    actun = mxVCAR.clipAction(clip);
    actun.play();
    if (mxVCAR) mxVCAR.setTime(ailrgt / anmfps);
    // Canopy
    clip = AnimationClip.findByName(gltf.animations, "canopyAction");
    mxVCCn = new AnimationMixer(VCMine);
    actun = mxVCCn.clipAction(clip);
    actun.play();
    if (mxVCCn) mxVCCn.setTime(canpos / anmfps);
    // Gauge - Compass
    clip = AnimationClip.findByName(gltf.animations, "gau_compassAction");
    mxVCGH = new AnimationMixer(VCMine);
    actun = mxVCGH.clipAction(clip);
    actun.play();
    if (mxVCGH) mxVCGH.setTime(cmphdg / anmfps);
    // Gauge - AI - Arrow
    clip = AnimationClip.findByName(gltf.animations, "gau_ai_ptrAction");
    mxVCGA = new AnimationMixer(VCMine);
    actun = mxVCGA.clipAction(clip);
    actun.play();
    if (mxVCGA) mxVCGA.setTime(atiarr / anmfps);
    // Gauge - AI - Bank
    clip = AnimationClip.findByName(gltf.animations, "gau_ai_bankAction");
    mxVCGB = new AnimationMixer(VCMine);
    actun = mxVCGB.clipAction(clip);
    actun.play();
    if (mxVCGB) mxVCGB.setTime(atibnk / anmfps);
    // Gauge - AI - Pitch
    clip = AnimationClip.findByName(gltf.animations, "gau_ai_pitchAction");
    mxVCGP = new AnimationMixer(VCMine);
    actun = mxVCGP.clipAction(clip);
    actun.play();
    if (mxVCGP) mxVCGP.setTime(atipit / anmfps);
    // Pointer - Altitude
    clip = AnimationClip.findByName(gltf.animations, "pointer_alt0Action");
    mxVCPA = new AnimationMixer(VCMine);
    actun = mxVCPA.clipAction(clip);
    actun.play();
    if (mxVCPA) mxVCPA.setTime(altft0 / anmfps);
    // Pointer - Altitude X 1000
    clip = AnimationClip.findByName(gltf.animations, "pointer_alt1Action");
    mxVCPB = new AnimationMixer(VCMine);
    actun = mxVCPB.clipAction(clip);
    actun.play();
    if (mxVCPB) mxVCPB.setTime(altft1 / anmfps);
    // Pointer - Speed
    clip = AnimationClip.findByName(gltf.animations, "pointer_mphAction");
    mxVCPS = new AnimationMixer(VCMine);
    actun = mxVCPS.clipAction(clip);
    actun.play();
    if (mxVCPS) mxVCPS.setTime(spdmph / anmfps);
    // Pointer - Turn Coordinator
    clip = AnimationClip.findByName(gltf.animations, "pointer_tcAction");
    mxVCPT = new AnimationMixer(VCMine);
    actun = mxVCPT.clipAction(clip);
    actun.play();
    if (mxVCPT) mxVCPT.setTime(hdgdif / anmfps);
    // Pointer - Ball
    clip = AnimationClip.findByName(gltf.animations, "pointer_tbAction");
    mxVCPC = new AnimationMixer(VCMine);
    actun = mxVCPC.clipAction(clip);
    actun.play();
    if (mxVCPC) mxVCPC.setTime(yawval / anmfps);
    // Pointer - Vertical Speed
    clip = AnimationClip.findByName(gltf.animations, "pointer_vsiAction");
    mxVCPV = new AnimationMixer(VCMine);
    actun = mxVCPV.clipAction(clip);
    actun.play();
    if (mxVCPV) mxVCPV.setTime(vsifpm / anmfps);
    // Pointer - Manifold Pressure
    clip = AnimationClip.findByName(gltf.animations, "pointer_mpAction");
    mxVCPM = new AnimationMixer(VCMine);
    actun = mxVCPM.clipAction(clip);
    actun.play();
    if (mxVCPM) mxVCPM.setTime(manprs / anmfps);
    // Pointer - RPM
    clip = AnimationClip.findByName(gltf.animations, "pointer_rpmAction");
    mxVCPR = new AnimationMixer(VCMine);
    actun = mxVCPR.clipAction(clip);
    actun.play();
    if (mxVCPR) mxVCPR.setTime(rpmprp / anmfps);
    // Pointer - Compass
    clip = AnimationClip.findByName(gltf.animations, "pointer_hdgAction");
    mxVCPH = new AnimationMixer(VCMine);
    actun = mxVCPH.clipAction(clip);
    actun.play();
    if (mxVCPH) mxVCPH.setTime(cmphdg / anmfps);
    // Pilot - Left Arm
    clip = AnimationClip.findByName(gltf.animations, "pilot_armLAction");
    mxVCLA = new AnimationMixer(VCMine);
    actun = mxVCLA.clipAction(clip);
    actun.play();
    if (mxVCLA) mxVCLA.setTime(manprs / anmfps);
    // Pilot - Left Hand
    clip = AnimationClip.findByName(gltf.animations, "pilot_handLAction");
    mxVCLH = new AnimationMixer(VCMine);
    actun = mxVCLH.clipAction(clip);
    actun.play();
    if (mxVCLH) mxVCLH.setTime(manprs / anmfps);
    // Pilot - Right Hand - Pitch
    clip = AnimationClip.findByName(gltf.animations, "pilot_handRPAction");
    mxVCRP = new AnimationMixer(VCMine);
    actun = mxVCRP.clipAction(clip);
    actun.play();
    if (mxVCRP) mxVCRP.setTime(stkpit / anmfps);
    // Pilot - Right Hand - Bank
    clip = AnimationClip.findByName(gltf.animations, "pilot_handRBAction");
    mxVCRB = new AnimationMixer(VCMine);
    actun = mxVCRB.clipAction(clip);
    actun.play();
    if (mxVCRB) mxVCRB.setTime(stkbnk / anmfps);
    // Pilot - Right Arm - Bank
    clip = AnimationClip.findByName(gltf.animations, "pilot_armRAction");
    mxVCRA = new AnimationMixer(VCMine);
    actun = mxVCRA.clipAction(clip);
    actun.play();
    if (mxVCRA) mxVCRA.setTime(stkbnk / anmfps);
    // Pilot - Rudder - Left
    clip = AnimationClip.findByName(gltf.animations, "pilot_rudderLAction");
    mxVCRL = new AnimationMixer(VCMine);
    actun = mxVCRL.clipAction(clip);
    actun.play();
    if (mxVCRL) mxVCRL.setTime(yawval / anmfps);
    // Pilot - Rudder - Right
    clip = AnimationClip.findByName(gltf.animations, "pilot_rudderRAction");
    mxVCRR = new AnimationMixer(VCMine);
    actun = mxVCRR.clipAction(clip);
    actun.play();
    if (mxVCRR) mxVCRR.setTime(yawval / anmfps);
    // Pilot - Leg - Left
    clip = AnimationClip.findByName(gltf.animations, "pilot_legLAction");
    mxVCLL = new AnimationMixer(VCMine);
    actun = mxVCLL.clipAction(clip);
    actun.play();
    if (mxVCLL) mxVCLL.setTime(yawval / anmfps);
    // Pilot - Leg - Right
    clip = AnimationClip.findByName(gltf.animations, "pilot_legRAction");
    mxVCLR = new AnimationMixer(VCMine);
    actun = mxVCLR.clipAction(clip);
    actun.play();
    if (mxVCLR) mxVCLR.setTime(yawval / anmfps);
    // Pilot - Head
    clip = AnimationClip.findByName(gltf.animations, "pilot_headAction");
    mxVCHD = new AnimationMixer(VCMine);
    actun = mxVCHD.clipAction(clip);
    actun.play();
    if (mxVCHD) mxVCHD.setTime(yawval / anmfps);
    //
    AirGrp.add(VCMine);
    VCMine.visible = false;
    VCMine.castShadow = true;
    VCMine.receiveShadow = true;
  });
}

/* Load Reference Lines ====================================================== */

function loadRefLin() {
  let d = 20;
  // Pitch Plane
  makeCircle(d, 0xff0000);
  mesh.rotation.z = 90 * DegRad;
  RefObj.add(mesh);
  // Yaw Plane
  makeCircle(d, 0x0000ff);
  RefObj.add(mesh);
  // Horizon Plane
  makeCircle(d, 0x00ff00);
  HrzObj.add(mesh);
}

function makeCircle(d, c) {
  // Must deal with right handed coordinate system.  Add 90 to rotation.  Reverse x, not z.
  let positions = [];
  //	positions.push(0, 0, 0);					// Start at 0,0
  for (let i = 0; i <= 360; i++) {
    positions.push(d * Math.cos(i * DegRad), 0, -d * Math.sin(i * DegRad));
  }
  geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  material = new LineBasicMaterial({ color: c });
  mesh = new Line(geometry, material);
}

/* Load Ground =============================================================== */

function loadGround() {
  /* Ground Squares --------------------------------------------------------*/
  // Load Starting ZX Values
  let n = 0;
  let zv = -0.5 * (GrdRow - 1) * GrdSpc;
  let xv = 0;
  // for each row
  for (let i = 0; i < GrdRow; i++) {
    xv = -0.5 * (GrdCol - 1) * GrdSpc;
    // For each column
    for (let j = 0; j < GrdCol; j++) {
      GrndZV[n] = zv;
      GrndXV[n] = xv;
      n += 1;
      xv += GrdSpc;
    }
    zv += GrdSpc;
  }
  /* Create Ground Textures -------------------------------------------------*/
  // For some reason, Box Geometry gives faster FPS than Plane or PlaneBuffer
  geometry = new BoxGeometry(GrdSpc, 0.1, GrdSpc);
  // material = Water (Default)
  fname = UNDERCAST;
  texture = txtrloader.load(fname);
  material = new MeshBasicMaterial({ map: texture });
  material.transparent = true;
  material.opacity = 0.05;
  material.encoding = sRGBEncoding; // to counter gammaFactor lightening
  /* Load Textures and Locations --------------------------------------------*/
  for (let i = 0; i < GrdNum; i++) {
    // Default
    GrdPtr[i] = new Mesh(geometry, material);
    GrdPtr[i].receiveShadow = true;
    scene.add(GrdPtr[i]);
    GrdPtr[i].position.set(GrndXV[i], -MPosYV, GrndZV[i]);
  }
}

/* Load Sounds =============================================================== */

function initSounds() {
  /* My Engine ------------------------------------------------------------ */
  fname = `${ACPath}/fx/${sndF01}`;
  audioLoader.load(fname, buffer => {
    sound1.setBuffer(buffer);
    sound1.setRefDistance(CamDst);
    sound1.setLoop(true);
  });

  /* My Prop -------------------------------------------------------------- */
  fname = `${ACPath}/fx/${sndF02}`;
  audioLoader.load(fname, buffer => {
    sound2.setBuffer(buffer);
    sound2.setRefDistance(CamDst);
    sound2.setLoop(true);
  });
}

/* 2 Render ================================================================== */

function rendAll() {
  // This block runs while resources are loading.
  if (RESOURCES_LOADED === false) {
    requestAnimationFrame(rendAll);
    boxrot = Mod360(boxrot - 3);
    loadingScreen.box.rotation.set(PieVal, 0, boxrot * DegRad);
    renderer.render(loadingScreen.scene, loadingScreen.camera);
    return; // Stop the function here.
  }
  requestAnimationFrame(rendAll);
  if (PawsOn === 0) {
    moveAirPln(); // move and rotate airplane
    if (UCFlag > 0) moveGround(); // Move undercast
    moveSounds();
  }
  moveCamera(); // move and rotate camera position
  chngHUDV(); // change HUD value
  if (StsFlg > 0) stats.update(); // update stats
  // Render
  renderer.render(scene, camera);
}

/* Move and Rotate Airplane ================================================== */

function moveAirPln() {
  // Pitch -----------------------------------------------
  PPPDif = InpPPP; // Change to Pitch Speed
  // Self-centering
  if (PPPDif > -0.001 && PPPDif < 0.001) {
    if (ACPtch === 0) PPPDif = 0;
    if (ACPtch < 5 && ACPtch > -5) PPPDif = -0.01 * ACPtch;
  }
  // Bank ------------------------------------------------
  ACBDif = InpACB; // Change to Bank Speed
  // Self-centering
  if (ACBDif > -0.001 && ACBDif < 0.001) {
    if (ACBank === 0) ACBDif = 0;
    if (ACBank < 7.5) ACBDif = -0.01 * ACBank;
    if (ACBank > 352.5) ACBDif = 0.01 * (360 - ACBank);
  }
  // Yaw
  YawDif = InpYaw;
  // Turn Rate = tan(bank) * G/V = tan(bank) * 32.174 / 300 fps (aprox 200 mph)
  ACBrad = ACBank * DegRad;
  ACHSpd = (Math.tan(ACBrad) * 32.174) / 300;
  if (ACHSpd > 0.2) ACHSpd = 0.2;
  if (ACHSpd < -0.2) ACHSpd = -0.2;
  ACHSpd *= Math.cos(ACPtch * DegRad);
  if (ACBank > 90 && ACBank < 270) ACHSpd = -ACHSpd;
  // Rotate
  roteAirObj();
  animAirObj();
}

// Rotate Aircraft
function roteAirObj() {
  // Make Bank, Pitch and Yaw Rotations to AirAxe and AirPBY
  AirPBY.rotation.z = -ACBDif * DegRad;
  AirPBY.rotation.x = PPPDif * DegRad;
  AirPBY.rotation.y = -YawDif * DegRad;
  // Transfer Combined Rotation to AirAxe
  AirPBY.getWorldQuaternion(quaternion);
  AirAxe.setRotationFromQuaternion(quaternion);
  // Zero Out AirPBY Rotations (so values not doubled)
  AirPBY.rotation.z = 0;
  AirPBY.rotation.x = 0;
  AirPBY.rotation.y = 0;
  // Load Resulting Values into Variables (for display)
  ACBank = Mod360(-AirAxe.rotation.z * RadDeg);
  ACPtch = AirAxe.rotation.x * RadDeg;
  // Update AirAxe Heading for Bank
  ACHead = Mod360(-AirAxe.rotation.y * RadDeg);
  ACHead = Mod360(ACHead + ACHSpd);
  AirAxe.rotation.y = -ACHead * DegRad;
}

// Animate Aircraft
function animAirObj() {
  /* Common Animations ------------------------------------------------------- */
  // Propeller
  let prpspd = 4 * (PwrPct - 0.6); // Range = -2.4 to + 1.6
  spnprp -= prpspd;
  if (spnprp < 0) spnprp = 359; // A complete circle
  // Ailerons
  let ailbnk = ACBDif;
  if (GrFlag > 0) ailbnk = AGBank;
  // Left
  aillft = 180 + ailbnk * 30;
  if (aillft < 151) {
    aillft = 151;
  }// Range = 00 to 60
  else if (aillft > 209) aillft = 209;
  // Right
  ailrgt = 180 - ailbnk * 30;
  if (ailrgt < 151) {
    ailrgt = 151;
  }// Range = 00 to 60
  else if (ailrgt > 209) ailrgt = 209;
  // Flaps
  if (FpFlag > 0) {
    FpFlag = 0; // one read per keypress only
    if (flpspd !== 0) flpspd = -flpspd; // if already in motion
    if (flppos === 0) flpspd = 1; // if full down
    if (flppos === 180) flpspd = -1; // if full up
  }
  if (flpspd !== 0) {
    flppos += flpspd;
    if (flppos > 180) {
      flpspd = 0;
      flppos = 180;
    }
    if (flppos < 0) {
      flpspd = 0;
      flppos = 0;
    }
  }
  let FlpPct = 1 - flppos / 180;
  // Gear
  if (LGFlag > 0 && GrFlag === 0) {
    // only if key pressed while in air
    LGFlag = 0; // one read per keypress only
    if (lngspd !== 0) lngspd = -lngspd; // if already in motion
    if (lngpos === 0) lngspd = 0.4; // if full down
    if (lngpos === 180) lngspd = -0.4; // if full up
  }
  if (lngspd !== 0) {
    lngpos += lngspd;
    if (lngpos > 180) {
      lngspd = 0;
      lngpos = 180;
    }
    if (lngpos < 0) {
      lngspd = 0;
      lngpos = 0;
    }
  }
  let LngPct = 1 - lngpos / 180;
  // Canopy
  if (CnFlag > 0) {
    CnFlag = 0; // one read per keypress only
    if (canspd !== 0) canspd = -canspd; // if already in motion
    if (canpos === 0) canspd = 1; // if full down
    if (canpos === 180) canspd = -1; // if full up
  }
  if (canspd !== 0) {
    canpos += canspd;
    if (canpos > 180) {
      canspd = 0;
      canpos = 180;
    }
    if (canpos < 0) {
      canspd = 0;
      canpos = 0;
    }
  }
  // Tailhook
  if (THFlag > 0) {
    THFlag = 0; // one read per keypress only
    if (thkspd !== 0) thkspd = -thkspd; // if already in motion
    if (thkpos === 0) thkspd = 1; // if full down
    if (thkpos === 180) thkspd = -1; // if full up
  }
  if (thkspd !== 0) {
    thkpos += thkspd;
    if (thkpos > 180) {
      thkspd = 0;
      thkpos = 180;
    }
    if (thkpos < 0) {
      thkspd = 0;
      thkpos = 0;
    }
  }
  /* External View Only --------------------------------------------------- */
  if (VCFlag < 1) {
    // Propeller
    if (mxProp) mxProp.setTime(spnprp / anmfps);
    // Rudder
    rudder = 180 + YawDif * 100;
    if (mxRudr) mxRudr.setTime(rudder / anmfps);
    // Elevator
    elvatr = 180 - (ACLftD * 10 - TrmAdj) * 5;
    if (elvatr < 150) {
      elvatr = 150;
    }// Range = 00 to 60
    else if (elvatr > 209) elvatr = 209;
    if (mxElev) mxElev.setTime(elvatr / anmfps);
    // Ailerons
    if (mxAilL) mxAilL.setTime(aillft / anmfps);
    if (mxAilR) mxAilR.setTime(ailrgt / anmfps);
    // Flaps
    if (flpspd !== 0) {
      if (mxFlpL) mxFlpL.setTime(flppos / anmfps);
      if (mxFlpR) mxFlpR.setTime(flppos / anmfps);
    }
    // Gear
    if (lngspd !== 0) {
      if (mxWhHL) mxWhHL.setTime(lngpos / anmfps);
      if (mxWhHR) mxWhHR.setTime(lngpos / anmfps);
      if (mxWhBL) mxWhBL.setTime(lngpos / anmfps);
      if (mxWhBR) mxWhBR.setTime(lngpos / anmfps);
      if (mxWhTL) mxWhTL.setTime(lngpos / anmfps);
      if (mxWhTR) mxWhTR.setTime(lngpos / anmfps);
      if (mxWhSL) mxWhSL.setTime(lngpos / anmfps);
      if (mxWhSR) mxWhSR.setTime(lngpos / anmfps);
      if (mxWhUL) mxWhUL.setTime(lngpos / anmfps);
      if (mxWhUR) mxWhUR.setTime(lngpos / anmfps);
    }
    // Canopy
    if (canspd !== 0) {
      if (mxCanp) mxCanp.setTime(canpos / anmfps);
    }
    // Tailhook
    if (thkspd !== 0) {
      if (mxHook) mxHook.setTime(thkpos / anmfps);
    }
  } else {
    /* Virtual Cockpit Only ------------------------------------------------- */
    // Propeller
    if (mxVCPr) mxVCPr.setTime(spnprp / anmfps);
    // Ailerons
    if (mxVCAL) mxVCAL.setTime(aillft / anmfps);
    if (mxVCAR) mxVCAR.setTime(ailrgt / anmfps);
    // Canopy
    if (canspd !== 0) {
      if (mxVCCn) mxVCCn.setTime(canpos / anmfps);
    }
    // Gauge - Compass Heading
    cmphdg = Mod360(ACHead);
    if (mxVCGH) mxVCGH.setTime(cmphdg / anmfps);
    // Gauge - AI - Arrow
    atiarr = -PoM360(ACBank);
    if (atiarr > 90) atiarr = 90;
    if (atiarr < -90) atiarr = -90;
    atiarr = (179 * atiarr) / 90 + 180;
    if (mxVCGA) mxVCGA.setTime(atiarr / anmfps);
    // Gauge - AI - Bank
    atibnk = Mod360(-ACBank);
    if (mxVCGB) mxVCGB.setTime(atibnk / anmfps);
    // Gauge - AI - Pitch
    atipit = ACPtch + ACPAdj;
    if (atipit > 45) atipit = 45;
    if (atipit < -45) atipit = -45;
    atipit = (179 * atipit) / 45 + 180;
    if (mxVCGP) mxVCGP.setTime(atipit / anmfps);
    // Pointer - Altitude
    let altthd = MPosYV / 1000; // Round to 1000s
    altthd = Math.trunc(altthd);
    altthd *= 1000;
    altft0 = ((MPosYV - altthd) / 1000) * 360; // Eliminate 1000s
    if (mxVCPA) mxVCPA.setTime(altft0 / anmfps);
    altft1 = (MPosYV / 10000) * 360;
    if (mxVCPB) mxVCPB.setTime(altft1 / anmfps);
    // Pointer - Speed
    spdmph = (SpdUPH / 600) * 360;
    if (mxVCPS) mxVCPS.setTime(spdmph / anmfps);
    // Pointer - Turn Coordinator
    hdgdif = PoM360(Mod360(ACHead - HdgOld)); // Change in heading +/-
    hdgdif /= DLTime; // Change per second
    if (hdgdif > 9) hdgdif = 9; // Std Rate = 3 deg = 10 deg deflation
    if (hdgdif < -9) hdgdif = -9; // Max 9 deg = 30 deg deflection
    hdgdif = (179 * hdgdif) / 9 + 180;
    if (mxVCPT) mxVCPT.setTime(hdgdif / anmfps);
    HdgOld = ACHead;
    // Pointer - Ball
    yawval = InpYaw; // Values = +/- 0.1
    yawval = (179 * yawval) / 0.3 + 180;
    if (mxVCPC) mxVCPC.setTime(yawval / anmfps);
    // Pointer - VSI
    let vsispd = MPosYV - AltOld; // Change in feet (1/60 sec)
    vsifpm = (60 * vsispd) / DLTime; // e.g .05 fpt = 180 fpm
    if (vsifpm > 6000) vsifpm = 6000;
    if (vsifpm < -6000) vsifpm = -6000;
    vsifpm = (vsifpm / 6000) * 179 + 180; // 180 fpm / 600 fpm max =.3
    if (mxVCPV) mxVCPV.setTime(vsifpm / anmfps);
    AltOld = MPosYV;
    // Pointer - Manifold Pressure
    manprs = PwrPct * 359;
    if (mxVCPM) mxVCPM.setTime(manprs / anmfps);
    // Pointer - RPM
    rpmprp = PwrPct * 359;
    if (mxVCPR) mxVCPR.setTime(rpmprp / anmfps);
    // Pointer - Compass Heading
    cmphdg = Mod360(-ACHead);
    if (mxVCPH) mxVCPH.setTime(cmphdg / anmfps);
    // Left Hand and Arm
    if (mxVCLH) mxVCLH.setTime(manprs / anmfps);
    if (mxVCLA) mxVCLA.setTime(manprs / anmfps);
    // Pilot - Right Hand - Pitch
    stkpcm -= stkpit;
    if (stkpcm > 359) stkpcm = 359;
    if (stkpcm < 1) stkpcm = 1;
    if (stkpit === 0) stkpcm = 0.99 * (stkpcm - 180) + 180; // recenter if inactive
    if (mxVCRP) mxVCRP.setTime(stkpcm / anmfps);
    // Pilot - Right Hand - Bank
    stkbcm += stkbnk;
    if (stkbcm > 359) stkbcm = 359;
    if (stkbcm < 1) stkbcm = 1;
    if (stkbnk === 0) stkbnk = 0.99 * (stkbcm - 180) + 180; // recenter if inactive
    if (mxVCRB) mxVCRB.setTime(stkbcm / anmfps);
    // Pilot - Right Arm - Bank
    if (mxVCRA) mxVCRA.setTime(stkbcm / anmfps);
    // Pilot - Rudder
    if (mxVCRL) mxVCRL.setTime(yawval / anmfps);
    if (mxVCRR) mxVCRR.setTime(yawval / anmfps);
    if (mxVCLL) mxVCLL.setTime(yawval / anmfps);
    if (mxVCLR) mxVCLR.setTime(yawval / anmfps);
    // Pilot - Head
    vchead = Mod360(CamLon + 180);
    if (mxVCHD) mxVCHD.setTime(vchead / anmfps);
  }
}

/* Move Ground =============================================================== */

function moveGround() {
  // Compute Speed
  let ACP = ACPtch * DegRad;
  PSpdZV = SpdDLT * Math.abs(Math.cos(ACP)); // Horizontal speed
  //	PSpdYV = SpdDLT * Math.sin(ACP);				// Vertical speed
  let ACH = ACHead * DegRad;
  MSpdZV = PSpdZV * Math.cos(ACH);
  //	MSpdYV = PSpdYV;								// Fixed
  MSpdXV = PSpdZV * Math.sin(ACH);
  MPosZV += MSpdZV;
  //	MPosYV = MPosYV + MSpdYV;						// Fixed
  MPosXV += MSpdXV;
  // Move Squares
  let max = 0.5 * (GrdRow - 1) * GrdSpc;
  let min = -max;
  for (let i = 0; i < GrdNum; i++) {
    // Z
    GrndZV[i] = GrndZV[i] + MSpdZV;
    if (GrndZV[i] > max) GrndZV[i] = min + (GrndZV[i] - max);
    if (GrndZV[i] < min) GrndZV[i] = max - (min - GrndZV[i]);
    // X
    GrndXV[i] = GrndXV[i] - MSpdXV;
    if (GrndXV[i] > max) GrndXV[i] = min + (GrndXV[i] - max);
    if (GrndXV[i] < min) GrndXV[i] = max - (min - GrndXV[i]);
    //
    GrdPtr[i].position.set(GrndXV[i], -MPosYV, GrndZV[i]);
  }
}

/* Move Sounds =============================================================== */

function moveSounds() {
  // My Engine
  sound1.setVolume(sndV01 + PwrPct * 0.05); // Range = .1 to .2
  sound1.setPlaybackRate(1 + PwrPct * 0.5); // Range = 1 to 1.5
  // My Props
  sound2.setVolume(sndV02 + PwrPct * 0.15); // Range = .1 to .4
  sound2.setPlaybackRate(1 + PwrPct * 0.5); // Range = 1 to 1.5
}

/* Move Camera =============================================================== */

// This orbits the camera around the camera axis

function moveCamera() {
  camera.position.z = -CamDst; // length of armature
  if (VCFlag > 0) {
    // In internal view, the camera is facing out - view matches rotation
    // Camera is in front of axis to simulate postion of eyes
    CamObj.rotation.x = Mod360(CamLat) * DegRad;
    CamObj.rotation.y = Mod360(-CamLon) * DegRad;
  } else {
    // In external view, the camera is facing in and the armature is pointing out:
    // * x.rotation = -CamLat
    // * y.rotation = CamLon + 180
    CamObj.rotation.x = Mod360(-CamLat) * DegRad;
    CamObj.rotation.y = Mod360(180 - CamLon) * DegRad;
  }
  // Rotate
  CtrObj.rotation.y = Mod360(-ACHead) * DegRad;
}

/* 4 Math Subroutines ======================================================== */

// Converts degrees to 360
function Mod360(deg) {
  if (deg < 0) {
    deg += 360;
  } else if (deg >= 360) {
    deg -= 360;
  }
  return deg;
}

/* Converts 360 degrees to +/- 180 */
function PoM360(deg) {
  if (deg > 180) deg -= 360;
  return deg;
}

/* Outputs ================================================================== */

// Change HUD Values
function chngHUDV() {
  AC_Head = ACHead; // Heading
  AC_HeadNode.nodeValue = AC_Head.toFixed(0);
  AC_Bank = ACBank;
  AC_BankNode.nodeValue = AC_Bank.toFixed(0); // Bank
  AC_Ptch = ACPtch;
  AC_PtchNode.nodeValue = AC_Ptch.toFixed(0); // Pitch
}

/* 5 Inputs ================================================================= */

//= Mouse Input ================================================================

function onMouseDown(event) {
  event.preventDefault();
  PanFlg = 1;
  onPointerDownX = event.clientX;
  onPointerDownY = event.clientY;
  onPointerDownLon = CamLon;
  onPointerDownLat = CamLat;
}

function onMouseUp(event) {
  PanFlg = 0;
}

function onMouseMove(event) {
  // Panning View
  if (PanFlg > 0) {
    CamLat = (onPointerDownY - event.clientY) * 0.2 + onPointerDownLat;
    CamLat = Math.max(-CamLtX, Math.min(CamLtX, CamLat));
    CamLon = (event.clientX - onPointerDownX) * 0.2 + onPointerDownLon;
    CamLon = Mod360(CamLon);
    if (VCFlag > 0) {
      if (CamLon > 180 && CamLon < 360 - CamLnX) CamLon = 360 - CamLnX;
      if (CamLon < 180 && CamLon > CamLnX) CamLon = CamLnX;
    }
  }
}

function onMouseWheel(event) {
  if (VCFlag < 1) {
    CamDst += event.deltaY * CamDif;
    CamDst = Math.max(CamMin, Math.min(CamMax, CamDst));
  }
}

//= Keyboard Input =============================================================

// Key Down
function onDocumentKeyDown(event) {
  // let keyCode = event.which;
  let keyCode = event.keyCode;
  // Bank Left
  if (keyCode === K_BnkL) InpACB = -BnkSpd;
  // Bank Right
  if (keyCode === K_BnkR) InpACB = BnkSpd;
  // Pitch Up
  if (keyCode === K_PitU) InpPPP = PitSpd;
  // Pitch Down
  if (keyCode === K_PitD) InpPPP = -PitSpd;
  // Yaw Left
  if (keyCode === K_YawL) InpYaw = -0.1;
  // Yaw Right
  if (keyCode === K_YawR) InpYaw = 0.1;
  // Flaps
  if (keyCode === K_Flap) FpFlag = 1;
  // Gear
  if (keyCode === K_Gear) LGFlag = 1;
  // Canopy
  if (keyCode === K_Canp) CnFlag = 1;
  // Tailhook
  if (keyCode === K_Hook) THFlag = 1;
  // Sound
  if (keyCode === K_Soun) {
    if (SndFlg < 1) {
      SndFlg = 1;
      sound1.play();
      sound2.play();
    } else {
      SndFlg = 0;
      sound1.stop();
      sound2.stop();
    }
  }
}

// Key Up
function onDocumentKeyUp(event) {
  let keyCode = event.keyCode;
  // Bank Left
  if (keyCode === K_BnkL) InpACB = 0;
  // Bank Right
  if (keyCode === K_BnkR) InpACB = 0;
  // Pitch Up
  if (keyCode === K_PitU) InpPPP = 0;
  // Pitch Down
  if (keyCode === K_PitD) InpPPP = 0;
  // Yaw Left
  if (keyCode === K_YawL) InpYaw = 0;
  // Yaw Right
  if (keyCode === K_YawR) InpYaw = 0;
  // Flaps
  if (keyCode === K_Flap) FpFlag = 0;
  // Gear
  if (keyCode === K_Gear) LGFlag = 0;
  // Canopy
  if (keyCode === K_Canp) CnFlag = 0;
  // Tail hook
  if (keyCode === K_Hook) THFlag = 0;
}

//= Touch Screen Input =========================================================

function onTouchStart(event) {
  // Single Touch
  if (event.touches.length === 1) {
    event.preventDefault();
    onPointerDownX = event.touches[0].clientX;
    onPointerDownY = event.touches[0].clientY;
    onPointerDownLon = CamLon;
    onPointerDownLat = CamLat;
  }
}

function onTouchMove(event) {
  // Single Touch
  if (event.touches.length === 1) {
    event.preventDefault();
    CamLat = (event.touches[0].clientY - onPointerDownY) * 0.2 + onPointerDownLat;
    CamLat = Math.max(-CamLtX, Math.min(CamLtX, CamLat));
    CamLon = (onPointerDownX - event.touches[0].clientX) * 0.2 + onPointerDownLon;
    CamLon = Mod360(CamLon);
    if (VCFlag > 0) {
      if (CamLon > 180 && CamLon < 360 - CamLnX) CamLon = 360 - CamLnX;
      if (CamLon < 180 && CamLon > CamLnX) CamLon = CamLnX;
    }
  }
}

//= Button Input ===============================================================

// Toggle Pause
function togglePause() {
  if (PawsOn === 0) {
    PawsOn = 1;
  } else {
    PawsOn = 0;
  }
}

// Toggle Sound
function toggleSound() {
  if (SndFlg === 0) {
    SndFlg = 1;
    sound1.play();
    sound2.play();
  } else {
    SndFlg = 0;
    sound1.stop();
    sound2.stop();
  }
}

// Change Camera View
function toggleCamera() {
  // From Level to Linked
  if (CamVOn === 0) {
    CtrObj.remove(CamObj);
    AirPBY.add(CamObj); // Link camera to aircraft
  }

  // From Linked to Cockpit
  if (CamVOn === 1) {
    AirPBY.remove(CamObj);
    CamPVC.add(CamObj);
    VCFlag = 1;
    ACMine.visible = false;
    VCMine.visible = true;
    CamDs0 = CamDst; // Save
    CamLt0 = CamLat;
    CamLn0 = CamLon;
    CamDst = 0.1;
    CamLat = 0;
    CamLon = 0;
    camera.rotation.y = 0; // Looking out

    // Canopy
    if (mxVCCn) mxVCCn.setTime(canpos / anmfps);
  }

  // From Cockpit to Level
  if (CamVOn === 2) {
    CamPVC.remove(CamObj);
    CtrObj.add(CamObj);
    VCFlag = 0;
    ACMine.visible = true;
    VCMine.visible = false;
    CamDst = CamDs0; // Restore
    CamLat = CamLt0;
    CamLon = CamLn0;
    camera.rotation.y = 180 * DegRad; // Looking out

    // Flaps
    if (mxFlpL) mxFlpL.setTime(flppos / anmfps);
    if (mxFlpR) mxFlpR.setTime(flppos / anmfps);

    // Gear
    if (mxWhHL) mxWhHL.setTime(lngpos / anmfps);
    if (mxWhHR) mxWhHR.setTime(lngpos / anmfps);
    if (mxWhBL) mxWhBL.setTime(lngpos / anmfps);
    if (mxWhBR) mxWhBR.setTime(lngpos / anmfps);
    if (mxWhTL) mxWhTL.setTime(lngpos / anmfps);
    if (mxWhTR) mxWhTR.setTime(lngpos / anmfps);
    if (mxWhSL) mxWhSL.setTime(lngpos / anmfps);
    if (mxWhSR) mxWhSR.setTime(lngpos / anmfps);

    // Canopy
    if (mxCanp) mxCanp.setTime(canpos / anmfps);

    // Tailhook
    if (mxHook) mxHook.setTime(thkpos / anmfps);
  }
  CamVOn += 1;
  if (CamVOn === 3) CamVOn = 0;
}

// Toggle Reference Lines
function toggleRefLin() {
  if (RefLOn === 0) {
    RefObj.visible = true;
    HrzObj.visible = true;
    RefLOn = 1;
  } else {
    RefObj.visible = false;
    HrzObj.visible = false;
    RefLOn = 0;
  }
}

// Toggle Landing Gear
function toggleLGear() {
  if (LGFlag === 0) {
    LGFlag = 1;
  } else {
    LGFlag = 0;
  }
}

// Toggle Flaps
function toggleFlaps() {
  if (FpFlag === 0) {
    FpFlag = 1;
  } else {
    FpFlag = 0;
  }
}

// Toggle Canopy
function toggleCanopy() {
  if (CnFlag === 0) {
    CnFlag = 1;
  } else {
    CnFlag = 0;
  }
}

// Toggle Tailhook
function toggleHook() {
  if (THFlag === 0) {
    THFlag = 1;
  } else {
    THFlag = 0;
  }
}

let InpPwr;

function toggleSpdU() {
  InpPwr = 0.001;
}

function togglePitD() {
  if (InpPPP === 0) {
    InpPPP = -PitSpd;
  } else {
    InpPPP = 0;
  }
}

function toggleSpdD() {
  InpPwr = -0.001;
}

function toggleBnkL() {
  if (InpACB === 0) {
    InpACB = -BnkSpd;
  } else {
    InpACB = 0;
  }
}

function toggleCntr() {
  InpPPP = 0;
  InpACB = 0;
  InpYaw = 0;
}

function toggleBnkR() {
  if (InpACB === 0) {
    InpACB = BnkSpd;
  } else {
    InpACB = 0;
  }
}

function toggleYawL() {
  if (InpYaw === 0) {
    InpYaw = -0.1;
  } else {
    InpYaw = 0;
  }
}

function togglePitU() {
  if (InpPPP === 0) {
    InpPPP = PitSpd;
  } else {
    InpPPP = 0;
  }
}

function toggleYawR() {
  if (InpYaw === 0) {
    InpYaw = 0.1;
  } else {
    InpYaw = 0;
  }
}

//= Window Resize Input ========================================================

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/* = CHANGES ================================================================= */
// 220306 - Fixed CamLat/CamLon - is now camera view relative to aircraft

//if (!Detector.webgl) Detector.addGetWebGLMessage();
var SHADOW_MAP_WIDTH = 2048,
  SHADOW_MAP_HEIGHT = 1024;
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -250;
var ANIMATION_GROUPS = 25;
var worldWidth = 256;
var worldDepth = 256;
var camera, controls, scene, renderer;
var container, stats;
var NEAR = 5,
  FAR = 3000;
var entities = [];
var light;
var clock = new THREE.Clock();
var object;
var glitchPass;
var trackedLatitude = 30;
var trackedLongitude = 250;
init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);
  // SCENE CAMERA
  camera = new THREE.PerspectiveCamera(23, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR);
  camera.position.set(700, 50, 1900);
  controls = new THREE.FirstPersonControls(camera);
  controls.lookSpeed = 0.0125;
  controls.movementSpeed = 500;
  controls.noFly = false;
  controls.lookVertical = true;
  controls.constrainVertical = true;
  controls.verticalMin = 1.5;
  controls.verticalMax = 2.0;
  controls.lon = 250;
  controls.lat = 30;
  // SCENE
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xd3d3d3, 1000, FAR);

  var manager = new THREE.LoadingManager();
  var texture = new THREE.Texture();
  var loader = new THREE.ImageLoader(manager);
  // loader.setPath('/static/img/dystopia/')
  // var textureCube = loader.load(['specular.png', 'specular.png', 'specular.png', 'specular.png', 'specular.png', 'specular.png'], function(image) {
  // 	console.log(image);
  // 	texture.image = image;
  //   scene.background = texture;
  // });

  loader.load('/static/img/dystopia/specular.png', function(image) {
    texture.image = image;
    texture.needsUpdate = true;
    scene.background = texture;
  });

  // LIGHTS
  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
  light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2);
  light.position.set(0, 1500, 1000);
  light.target.position.set(0, 0, 0);
  light.castShadow = true;
  light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(50, 1, 700, FAR));
  light.shadow.bias = 0.0001;
  light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
  light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
  scene.add(light);
  createScene();
  // RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  container.appendChild(renderer.domElement);
  renderer.autoClear = false;
  //
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  createGeometry();

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  glitchPass = new THREE.GlitchPass();
  glitchPass.renderToScreen = true;
  composer.addPass(glitchPass);
  console.log(glitchPass);

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  controls.handleResize();
}

function createScene() {
  // GROUND
  var geometry = new THREE.PlaneBufferGeometry(100, 100);
  var manager = new THREE.LoadingManager();
  var texture = new THREE.Texture();
  var loader = new THREE.ImageLoader(manager);
  loader.load('/static/img/dystopia/galaxy.png', function(image) {
    texture.image = image;
    texture.needsUpdate = true;
    //backgroundGeometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    ground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    ground.position.set(0, FLOOR, 0);
    ground.rotation.x = -Math.PI / 2;
    ground.scale.set(100, 100, 100);
    ground.castShadow = false;
    ground.receiveShadow = true;
    scene.add(ground);
  });
}

function createGeometry() {
  object = new THREE.Object3D();
  object.name = 'object_geometry';
  var geometry = new THREE.SphereGeometry(1, 4, 4);
  for (var i = 0; i < 100; i++) {
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), flatShading: true });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(Math.random() * 400);
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
    object.add(mesh);
  }
  scene.add(object);
  console.log(object);
}

function glitchSwitch() {
  glitchPass.goWild = !glitchPass.goWild;
}

function animate() {

  requestAnimationFrame(animate);
  render();
}


function render() {
  var delta = clock.getDelta();
  // if (mixer) mixer.update(delta);
  // for (var i = 0; i < morphs.length; i++) {
  //   morph = morphs[i];
  //   morph.position.x += morph.speed * delta;
  //   if (morph.position.x > 2000) {
  //     morph.position.x = -1000 - Math.random() * 500;
  //   }
  // }
  // if (Math.random()<0.5){
  // 	console.log('Glitch switch');
  // 	glitchSwitch();
  // }
  //console.log(controls);

  let latitude = controls.lat;
  let longitude = controls.lon;
  let mouseX = controls.mouseX;
  let mouseY = controls.mouseY;


  if (Math.abs(latitude - trackedLatitude))

  //console.log(latitude + ',' + longitude);
  controls.update(delta);
  //renderer.clear();
  composer.render();
  //renderer.render(scene, camera);
}
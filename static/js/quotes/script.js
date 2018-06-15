var camera, scene, renderer;
var params = {
  clipIntersection: true,
  planeConstant: 0,
  showHelpers: false
};
var clipPlanes = [
  new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
  new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)
];



$(document).ready(function() {
  init();
  let data = getSentimentData();
  viewDataButton();
  displayData(data);
  visualizeDataSpheres(data);
  setupHelpers();
  setupHelpers();
  window.addEventListener('resize', onWindowResize, false);
  render();
});

function viewDataButton() {
  $('#viewData').click(function() {
    let display = $('.dropdown-content').css('display');
    let displayValue = (display === 'block') ? 'none' : 'block';
    $('.dropdown-content').css('display', displayValue);
  })
}

function getSentimentData() {
  let sentimentData = $('#data').data('sentiment');
  let data = JSON.parse(JSON.stringify(sentimentData));
  console.log(data);
  return data;
}

function displayData(data) {
  for (i in data) {
    $('#data').append('<div>' + JSON.stringify(data[i]) + '</div>');
  }
}

function visualizeDataSpheres(data) {
  var group = new THREE.Group();
  for (i in data) {
    let value = data[i];
    let mesh = meshForTextPolarity(value.text, value.polarity, value.polarity_confidence, value.subjectivity, value.subjectivity_confidence);
    group.add(mesh);
  }
  scene.add(group);
}

function meshForTextPolarity(text, polarity, polarity_confidence, subjectivity, subjectivity_confidence) {
  var polarity_factor = 1;
  if (polarity === 'negative') {
    polarity_factor = 0.5
  } else if (polarity === 'positive') {
    polarity_factor = 1.5
  }

  let polarity_value = polarity_confidence * polarity_factor;
  let radius = polarity_value * 20;
  let geometry = new THREE.SphereBufferGeometry(radius, 48 * polarity_value, 24 * polarity_value);

  console.log('polarity value: ' + polarity_value);
  let color = new THREE.Color(polarity_value, subjectivity_confidence, polarity_confidence);
  console.log(color);

  //new THREE.Color(Math.sin(polarity_confidence) * 0.5 + 0.5, Math.cos(subjectivity_confidence) * 0.5 + 0.5, Math.sin( polarity_value) * 0.5 + 0.5);

  let material = new THREE.MeshLambertMaterial({
    color: color,
    side: THREE.DoubleSide,
    clippingPlanes: clipPlanes,
    clipIntersection: params.clipIntersection,
    wireframe: (polarity === 'negative')
  });
  return new THREE.Mesh(geometry, material);
}

function init() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.localClippingEnabled = true;
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 200);
  camera.position.set(-20, 30, 40);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use only if there is no animation loop
  controls.minDistance = 10;
  controls.maxDistance = 100;
  controls.enablePan = false;
  var light = new THREE.HemisphereLight(0xffffff, 0x080808, 1);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x505050));
}

function setupHelpers() {
  // helpers
  var helpers = new THREE.Group();
  helpers.add(new THREE.AxesHelper(20));
  helpers.add(new THREE.PlaneHelper(clipPlanes[0], 30, 0xff0000));
  helpers.add(new THREE.PlaneHelper(clipPlanes[1], 30, 0x00ff00));
  helpers.add(new THREE.PlaneHelper(clipPlanes[2], 30, 0x0000ff));
  helpers.visible = false;
  scene.add(helpers);
}

function setupGUI() {
  // gui
  var gui = new dat.GUI();
  gui.add(params, 'clipIntersection').name('clip intersection').onChange(function(value) {
    var children = group.children;
    for (var i = 0; i < children.length; i++) {
      children[i].material.clipIntersection = value;
    }
    render();
  });
  gui.add(params, 'planeConstant', -16, 16).step(1).name('plane constant').onChange(function(value) {
    for (var j = 0; j < clipPlanes.length; j++) {
      clipPlanes[j].constant = value;
    }
    render();
  });
  gui.add(params, 'showHelpers').name('show helpers').onChange(function(value) {
    helpers.visible = value;
    render();
  });
  //
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function render() {
  renderer.render(scene, camera);
}
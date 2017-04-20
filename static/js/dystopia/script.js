var webglEl = document.getElementById('webgl');
var width = window.innerWidth,
    height = window.innerHeight;
// Earth params
var radius = 0.1,
    segments = 32,
    rotation = 6;

//comet params
var cometRadius = 0.07

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.position.z = 1.5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
scene.add(new THREE.AmbientLight(0x333333));

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);


var sphere = createEarth(radius, segments); //earth
sphere.rotation.y = rotation;
scene.add(sphere)

var comet = createComet(cometRadius, segments);
comet.rotation.y = rotation;
comet.translateX(0.5);
scene.add(comet);

var controls = new THREE.TrackballControls(camera);


webglEl.appendChild(renderer.domElement);

//top right bottom left
$(document).ready(function() {
    //setTimeout(function() {
    //zoomEarth();
    //three_dEarth();
    animate(); 
    //render();
    //}, 5000)

})


function zoomEarth() {
    $("#earth").animate({
        width: $(document).width() * 3.9 + "px",
        'margin': '-' + $(document).width() * 2.6 + 'px -' + 1.7 * $(document).width() + 'px'
    }, 3000)
}


function createEarth(radius, segments) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('/static/img/dystopia/dystopia_map.png'),
            bumpMap: THREE.ImageUtils.loadTexture('/static/img/dystopia/earthbump1k.jpg'),
            bumpScale: 0.005,
            specularMap: THREE.ImageUtils.loadTexture(''),
            specular: new THREE.Color('grey')
        })
    );
}

function createComet(radius, segments) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('/static/img/dystopia/comet.png'),
            bumpMap: THREE.ImageUtils.loadTexture(''),
            bumpScale: 0.005,
            specularMap: THREE.ImageUtils.loadTexture(''),
            specular: new THREE.Color('grey')
        })
    );
}

function animate() {
    comet.rotation.y+=0.09
    sphere.rotation.y += 0.005;
    //camera.zoom += 0.001;
    camera.updateProjectionMatrix();
    requestAnimationFrame(animate);
    render();
}


function render() {
    //controls.update();
    //sphere.rotation.y += 0.005;
    //clouds.rotation.y += 0.0005;
    //requestAnimationFrame(render);
    renderer.render(scene, camera);
}


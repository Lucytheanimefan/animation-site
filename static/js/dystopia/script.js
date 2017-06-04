var webglEl = document.getElementById('webgl');
var width = window.innerWidth,
    height = window.innerHeight;
// Earth params
var radius = 0.2,
    segments = 32,
    rotation = 6;


//audio
var myAudio = new Audio("/static/sound/comet.mp3");

myAudio.onended = function() {
    setTimeout(function() {
        clearInterval(rotation_animation);
    }, 7000);

}

var cometRadius = 0.1;


//background scene

// Load the background texture
var texture = THREE.ImageUtils.loadTexture('/static/img/dystopia/galaxy.png');
var backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
        map: texture
    }));

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

// Create your background scene
var backgroundScene = new THREE.Scene();
var backgroundCamera = new THREE.Camera();
backgroundScene.add(backgroundCamera);
backgroundScene.add(backgroundMesh);


var scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x333333));

// GLOW SCENE
var cometScene = new THREE.Scene();
cometScene.add(new THREE.AmbientLight(0xffffff));


var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);

camera.position.set(0, .8, 1.5);
camera.up = new THREE.Vector3(1, 1, 1);
camera.lookAt(new THREE.Vector3(0, 0, 0));
/*
camera.position.z = 1.5;
camera.position.y = 0.1;
*/

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
renderer.setClearColor(0xffffff, 0);
renderer.autoClear = false;

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);
scene.add(light);


var cometLight = new THREE.DirectionalLight(0xffffff, 2);
cometLight.position.set(7, 3, 5);
cometLight.shadow.mapSize.width = 300;
cometLight.shadow.mapSize.height = 400;

cometScene.add(cometLight);


var sphere = createEarth(radius, segments); //earth
sphere.rotation.y = rotation;
sphere.receiveShadow = true;
scene.add(sphere);

var comet = createComet(cometRadius, segments);
comet.rotation.y = rotation;
comet.castShadow = true;
comet.translateZ(-0.5);
cometScene.add(comet);


var controls = new THREE.TrackballControls(camera);
var vector = new THREE.Vector3();


webglEl.appendChild(renderer.domElement);

//images
var galaxyImage = new Image();
galaxyImage.src = "/static/img/dystopia/galaxy.png";
var nycImage = new Image();
nycImage.src = "/static/img/dystopia/galaxy.png";
var greatWallImage = new Image();
greatWallImage.src = "/static/img/dystopia/greatwall.png";
var reaperImage = new Image();
reaperImage.src = "/static/img/dystopia/reaper.png";


$(document).ready(function() {
    galaxyImage.onload = function() {
        console.log("galaxy image loaded");
        reaperImage.onload = function() {
            console.log("reaper loaded");
            greatWallImage.onload = function() {
                console.log("great wall image loaded");
                //nycImage.onload = function() {
                    console.log("DOne loading everything :)");
                    myAudio.play();
                    $("body").addClass("stage0");
                    animate();
                    beginFadeBackground();
                //};
            };
        };
    };
})


function zoomEarth() {
    $("#earth").animate({
        width: $(document).width() * 3.9 + "px",
        'margin': '-' + $(document).width() * 2.6 + 'px -' + 1.7 * $(document).width() + 'px'
    }, 3000)
}

var earth;
var comet;

function createEarth(radius, segments) {
    earth = new THREE.SphereGeometry(radius, segments, segments);
    prepareExplodeEarth();
    return new THREE.Mesh(
        earth,
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
    comet = new THREE.SphereGeometry(radius, segments, segments);
    return new THREE.Mesh(
        comet,
        new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('/static/img/dystopia/comet.png'),
            bumpMap: THREE.ImageUtils.loadTexture(''),
            bumpScale: 0.005,
            specularMap: THREE.ImageUtils.loadTexture(''),
            specular: new THREE.Color('grey')
        })
    );
}
var newx = 0
    //var needShatter = true;
var needsMove = true;
var expandRotation = false;
var startTransZ = 0.0004;

function animate(rotation = 0) {
    //TWEEN.update();
    var dist = comet.position.distanceToSquared(sphere.position);
    if (collision(dist) && rotation >= 1700) { //1000 is the golden #
        for (var i = 0; i < earth.vertices.length - 3; i += 2) {
            var rand = Math.random() > 0.5 ? 1 : -1;
            //var rand = 1;

            earth.vertices[i].x += rand * 0.005;
            earth.vertices[i].y += rand * 0.0005;
            earth.vertices[i].z += rand * 0.00005;
            earth.verticesNeedUpdate = true;
            var A = earth.vertices[i + 0]
            var B = earth.vertices[i + 1]
            var C = earth.vertices[i + 2]

            var scale = 1 + Math.random() * 0.05;
            A.multiplyScalar(scale);
            B.multiplyScalar(scale);
            C.multiplyScalar(scale);

        }
    }
    if (expandRotation) {
        comet.translateZ(0.0005);
        comet.translateX(-0.00425);
        comet.rotation.y += 0.001;

    } else {
        comet.translateX(-0.009);

        comet.translateZ(0.0004);
    }
    if (rotation >= 1700 /*&& needsMove*/ && !expandRotation) {
        needsMove = false;
        //comet.translateZ(0.4);
        comet.rotation.y += 0.025;
    } else {
        comet.rotation.y += 0.015;
    }


    sphere.rotation.y += 0.005;
    camera.updateProjectionMatrix();
    rotation_animation = requestAnimationFrame(function() {
        rotation++;
        animate(rotation);
    });
    render();
}

function collision(dist) {
    return (dist <= radius - cometRadius);
}

function prepareExplodeEarth() {
    var explodeModifier = new THREE.ExplodeModifier();
    explodeModifier.modify(earth);
    earth.verticesNeedUpdate = true;
}

THREE.ExplodeModifier = function() {

};

THREE.ExplodeModifier.prototype.modify = function(geometry) {

    var vertices = [];

    for (var i = 0, il = geometry.faces.length; i < il; i++) {

        var n = vertices.length;

        var face = geometry.faces[i];

        var a = face.a;
        var b = face.b;
        var c = face.c;

        var va = geometry.vertices[a];
        var vb = geometry.vertices[b];
        var vc = geometry.vertices[c];

        vertices.push(va.clone());
        vertices.push(vb.clone());
        vertices.push(vc.clone());

        face.a = n;
        face.b = n + 1;
        face.c = n + 2;

    }

    geometry.vertices = vertices;

};

function render() {
    renderer.clear();
    renderer.render(cometScene, camera);
    renderer.render(scene, camera);
}

/*----------------transition background-----------*/



function beginFadeBackground() {
    var counter = 1;
    var refreshIntervalId = setInterval(function() {
        $("body").prop("class", "stage" + counter);
        if (counter === 3) {
            clearInterval(refreshIntervalId);
            setTimeout(function() {
                expandRotation = true;
            }, 2000);

            counter = 1;
        } else {
            counter++;
        }
    }, 11000);
}

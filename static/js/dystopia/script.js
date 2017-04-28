var webglEl = document.getElementById('webgl');
var width = window.innerWidth,
    height = window.innerHeight;
// Earth params
var radius = 0.2,
    segments = 32,
    rotation = 6;

//comet params
var cometRadius = 0.1

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

//$("body").css("background-image","/static/img/dystopia/galaxy.png");
//top right bottom left
$(document).ready(function() {
    $("body").addClass("stage0");
    //$("body").addClass("stage0");
    //setTimeout(function() {
    //zoomEarth();
    //three_dEarth();
    //prepareExplodeEarth();
    
    animate();
    //render();
    //}, 5000)
    beginFadeBackground();

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

function animate(rotation = 0) {
    TWEEN.update();
    var dist = comet.position.distanceToSquared(sphere.position);
    if (collision(dist) && rotation >= 1000) { //1000 is the golden #
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
    comet.translateX(-0.009);
    //comet.rotation.y += 0.015 //*Math.random();
    /*
    } else {
        comet.translateX(-0.009);
        comet.rotation.y += 0.015 //*Math.random();
    }
    */
    /*
    var y = camera.position.y+0.001;
    var z = camera.position.z+0.001;
    var x = camera.position.x+0.001;
    var b=rotation*0.001;
    */
    //camera.position.set(x, y, z);
    //camera.lookAt(new THREE.Vector3(b, 0, 0));
    comet.translateZ(0.0004);

    if (rotation >= 1000 /*&& needsMove*/ ) {
        needsMove = false;
        //comet.translateZ(0.4);
        comet.rotation.y += 0.025;
    } else {
        comet.rotation.y += 0.015;
    }


    sphere.rotation.y += 0.005;
    //newx+=1;
    //cometLight.position.set(newx, newx, newx);
    //camera.zoom += 0.001;
    camera.updateProjectionMatrix();
    window["rotation"] = requestAnimationFrame(function() {
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
    renderer.clear()
        //controls.update();
        //sphere.rotation.y += 0.005;
        //clouds.rotation.y += 0.0005;
        //requestAnimationFrame(render);
        //renderer.render(backgroundScene, backgroundCamera);
    renderer.render(cometScene, camera);
    renderer.render(scene, camera);
}

/*----------------transition background-----------*/

function beginFadeBackground() {
    /*
    setTimeout(function(){
        setBackground("nyc");
    }, 2000);
    setTimeout(function(){
        setBackground("greatwall");
    }, 4000);
    */
    /*
    $('body').fadeIn('slow', 0.3, function() {
        $("body").css('background-image', 'url("/static/img/dystopia/nyc.png")')
    }).delay(3000).fadeIn('slow', 1);
    $('body').fadeIn('slow', 0.3, function() {
        $("body").css('background-image', 'url("/static/img/dystopia/greatwall.png")')
    }).delay(6000).fadeIn('slow', 1);
    */
    var counter = 1;
    var refreshIntervalId = setInterval(function() {
        $("body").prop("class", "stage" + counter);
        if (counter === 3) {
            clearInterval(refreshIntervalId);
            counter = 1;
        } else {
            counter++;
        }
    }, 7000);

}

function setBackground(imageName) {
    var texture = THREE.ImageUtils.loadTexture('/static/img/dystopia/' + imageName + '.png');
    var backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2, 0),
        new THREE.MeshBasicMaterial({
            map: texture
        }));

    backgroundMesh.material.depthTest = false;
    backgroundMesh.material.depthWrite = false;

    backgroundScene.add(backgroundCamera);
    backgroundScene.add(backgroundMesh);

}

/*
$('#elem').fadeTo('slow', 0.3, function() {
    $(this).css('background-image', 'url(' + $img + ')');
}).fadeTo('slow', 1);
With a 1 second delay:

    $('#elem').fadeTo('slow', 0.3, function() {
        $(this).css('background-image', 'url(' + $img + ')');
    }).delay(1000).fadeTo('slow', 1);
    */

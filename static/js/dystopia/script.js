var webglEl = document.getElementById('webgl');
var width = window.innerWidth,
    height = window.innerHeight;
// Earth params
var radius = 0.2,
    segments = 32,
    rotation = 6;

//comet params
var cometRadius = 0.1

var scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x333333));

// GLOW SCENE
var cometScene = new THREE.Scene();
cometScene.add(new THREE.AmbientLight(0xffffff));


var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.position.z = 1.5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
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
scene.add(sphere)

var comet = createComet(cometRadius, segments);
comet.rotation.y = rotation;
comet.castShadow = true;
//comet.translateX(0.5);
cometScene.add(comet);

var controls = new THREE.TrackballControls(camera);
var vector = new THREE.Vector3();


webglEl.appendChild(renderer.domElement);

//top right bottom left
$(document).ready(function() {
    //setTimeout(function() {
    //zoomEarth();
    //three_dEarth();
    //prepareExplodeEarth();
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

function animate(rotation = 0) {
    TWEEN.update();
    var dist = comet.position.distanceToSquared(sphere.position)
    if (collision(dist) && rotation >= 100) {
        for (var i = 0; i < earth.vertices.length - 3; i += 2) {
            var rand = Math.random() > 0.5 ? 1 : -1;
            //var rand = 1;

            earth.vertices[i].x += rand * 0.005;
            earth.vertices[i].y += rand * 0.0005;
            earth.vertices[i].z += rand * 0.00005;
            earth.verticesNeedUpdate = true;
            //console.log(earth.faces[i]);
            //earth.faces[i].a +=0.05;
            //earth.faceVertexUvs[i] += 0.005; 
            //
            var A = earth.vertices[i + 0]
            var B = earth.vertices[i + 1]
            var C = earth.vertices[i + 2]

            var scale = 1 + Math.random() * 0.05;
            A.multiplyScalar(scale);
            B.multiplyScalar(scale);
            C.multiplyScalar(scale);

        }


        /*
         for (var j = 0; j < earth.faces.length; j+=30) {
             earth.verticesNeedUpdate = true;
             earth.colorsNeedUpdate = true;
             earth.elementsNeedUpdate = true;
             earth.normalsNeedUpdate = true;
             var myColor = new THREE.Color(0xff0000);
             myColor.setRGB(Math.random(), Math.random(), Math.random());
             var face = earth.faces[j];
             console.log(face)
             face.color = myColor;
             face.vertexColors.push(myColor);
             face.normal.x+=20;
             face.normal.y+=20;
             face.normal.z+=20;
             //console.log(earth.vertices[i].x);
         }
         */

        comet.translateX(-0.009);
        comet.rotation.y += 0.03;

    } else {
        comet.translateX(-0.009);
        //}
        //console.log(comet.position.distanceToSquared(sphere.position));

        comet.rotation.y += 0.03;
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
    renderer.render(cometScene, camera);
    renderer.render(scene, camera);
}

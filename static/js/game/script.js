if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";
}
var container, stats;
var camera, controls, scene, renderer;
var mesh, texture;
var directionalLight;
var worldWidth = 256,
    worldDepth = 256,
    worldHalfWidth = worldWidth / 2,
    worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();
var myImage = new Image();
myImage.src = "/static/img/dystopia/galaxy.png";
console.log(myImage);


$(document).ready(function() {
    //create3DWorld();
    //create2DWorld();
    mouseDown2DWorld();
})

function create2DWorld() {
    container = $("#container");
    container.append("<canvas id='2Dworld'></canvas>");
    canvas = document.getElementById("2Dworld");
    context = canvas.getContext("2d");
    console.log(context)
}

var background_xpos = 0;
var speed = 1;

function mouseDown2DWorld() {
    $(document).keydown(function(e) {
        switch (e.which) {
            case 37: // left
                if ((background_xpos+speed) < 0) {
                    background_xpos += speed;
                    $('body').css('background-position', background_xpos + 'px 0');
                    speed += 1;
                }
            case 38: // up
                break;

            case 39: // right
                console.log("Speed: " + speed);
                background_xpos -= speed;
                $('body').css('background-position', background_xpos + 'px 0');
                speed += 1;
            case 40: // down
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    $(document).keyup(function(e) {
        speed = 1;
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });

}


function create3DWorld() {
    myImage.onload = function() {
        console.log("LOaded");
        init();
        animate();
    }
}

function init() {
    container = document.getElementById('container');
    //directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    scene = new THREE.Scene();
    controls = new THREE.FirstPersonControls(camera);
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.1;
    //controls.noFly = true;
    data = generateHeight(worldWidth, worldDepth);
    camera.position.y = data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 500;
    var geometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(-Math.PI / 2);
    var vertices = geometry.attributes.position.array;
    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
        vertices[j + 1] = data[i] * 10;
    }
    texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    scene.add(mesh);
    //scene.add(directionalLight);
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xbfd1e5);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    //stats = new Stats();
    //container.appendChild(stats.dom);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();
}

function generateHeight(width, height) {
    var size = width * height,
        data = new Uint8Array(size),
        perlin = new ImprovedNoise(),
        quality = 1,
        z = Math.random() * 100;
    for (var j = 0; j < 4; j++) {
        for (var i = 0; i < size; i++) {
            var x = i % width,
                y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
        }
        quality *= 5;
    }
    return data;
}

function generateTexture(data, width, height) {
    var canvas, canvasScaled, context, image, imageData,
        level, diff, vector3, sun, shade;
    vector3 = new THREE.Vector3(0, 0, 0);
    sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    //context.fillStyle = '#000';
    //context.fillRect(0, 0, width, height);
    context.drawImage(myImage, 0, 0, myImage.width, myImage.height, 0, 0, width, height);
    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;
    console.log(imageData);

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
        shade = vector3.dot(sun);
        //imageData[i] = (96 + shade * 96) * (0.5 + data[j] * 0.007);
        //imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        //imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 3] = 90 * Math.abs(shade); //(shade * 50) * (0.5 + data[j] * 0.007);
        //console.log(Math.abs(shade));
        //console.log(shade);
    }

    context.putImageData(image, 0, 0);
    // Scaled 4x
    canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;
    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);
    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (var i = 0, l = imageData.length; i < l; i += 4) {
        var v = ~~(Math.random() * 5);
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }
    context.putImageData(image, 0, 0);
    return canvasScaled;

}
//
function animate() {
    requestAnimationFrame(animate);
    render();
    //stats.update();
}

function render() {
    controls.update(clock.getDelta());
    renderer.render(scene, camera);
}
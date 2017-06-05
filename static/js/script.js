(function($) {
    "use strict";
    var mypaper;
    $(document).ready(function() {
        // initialize the paper animation
        mypaper = new PaperWrap($('#water-spring')[0]);
    });

    function PaperWrap(canvasElement) {
        var mypaper = new paper.PaperScope();
        mypaper.setup(canvasElement);

        var view = mypaper.view,
            Point = mypaper.Point,
            Path = mypaper.Path,
            Group = mypaper.Group,
            Tool = mypaper.Tool,
            Item = mypaper.Item;

        // Values for the spring
        var values = {
            friction: 0.9,
            timeStep: 0.01,
            mass: 2
        };
        values.invMass = 1 / values.mass;
        var springs = [];

        var pendulumForce = 1 - values.friction * values.timeStep;

        var Spring = function(a, b, strength, restLength) {
            this.a = a;
            this.b = b;
            this.restLength = restLength;
            this.strength = strength;
            this.mamb = values.invMass * values.invMass;
        };

        Spring.prototype.update = function() {
            var delta = this.b.subtract(this.a);
            var dist = delta.length;
            var normDistStrength = (dist - this.restLength) / (dist * this.mamb) * this.strength;
            delta = delta.multiply(normDistStrength * values.invMass * 0.2);
            if (!this.a.fixed) {
                this.a.y += delta.y;
            }
            if (!this.b.fixed) {
                this.b.y -= delta.y;
            }
        };

        // Surface
        var surface = new Path();

        function createSurface() {
            if (surface) {
                surface.remove();
            }
            surface = new Path();
            // surface.fullySelected = true;
            surface.fillColor = "#ffffff";
            var margin = -300;
            var waterDepth = view.size.height;

            surface.add(new Point(margin, view.size.height / 2));
            surface.add(new Point(view.size.width - margin, view.size.height / 2));

            var segmentAmount = 30;
            var segmentWidth = Math.floor(surface.length / segmentAmount);
            // Add Segments every 100 px
            surface.flatten(segmentWidth);

            // Save the point positions in the point objects
            for (var i = 0; i < surface.segments.length; i++) {
                var segment = surface.segments[i];
                var point = segment.point;
                point.anchor = new Point(point.x, point.y);

                point.px = point.x;
                point.py = point.y;

                point.fixed = false;

                if (i > 0) {
                    var spring = new Spring(segment.previous.point, point, 0.75, segmentWidth * 0.5);
                    springs.push(spring);
                }

            }
            surface.firstSegment.point.fixed = true;
            surface.lastSegment.point.fixed = true;


            surface.add(new Point(view.size.width - margin, view.size.height / 2 + waterDepth));
            surface.lastSegment.point.fixed = true;
            surface.add(new Point(margin, view.size.height / 2 + waterDepth));
            surface.lastSegment.point.fixed = true;
            surface.closePath();
        }
        createSurface();

        // Mouse Path
        var mousePos = view.center.add(new Point(200, 100));
        var lastMousePos = view.center.add(new Point(-300, -100));

        var mousePath = new Path(lastMousePos, mousePos);
        mousePath.strokeColor = '#ccc';
        mousePath.fullySelected = false;

        var mouseVector = new Point(0, 0);

        function resetLastMousePos() {

            //setTimeout( resetLastMousePos, 200 );
        }
        resetLastMousePos();

        var tool = new Tool();
        tool.onMouseMove = function(event) {
            mousePos = event.point;
        };

        view.onFrame = function(event) {

            // Adjust the Mouse Path
            //lastMousePos = lastMousePos.add( mousePos.subtract( lastMousePos ).divide(12) );
            mousePath.removeSegments();
            mousePath.addSegments([lastMousePos, mousePos]);
            mouseVector = mousePos.subtract(lastMousePos);

            lastMousePos = mousePos;
            // disable the x coordinate on the vector
            mouseVector.x = 0;

            for (var i = 0; i < surface.segments.length; i++) {
                if (i > 0 && i < surface.segments.length - 1) {
                    //surface.segments[i].selected = false;
                } else {
                    //surface.segments[i].selected = true;
                }
                // surface.segments[i].selected = true;

            }
            //console.log( mousePath.angle );
            var intersections = surface.getIntersections(mousePath);
            if (intersections.length) {
                var hitLocation = intersections[0];
                var segment = hitLocation.segment || hitLocation._segment1;

                if ("undefined" === typeof segment) {
                    segment = hitLocation.segment1;
                }

                if (!segment.point.fixed) {
                    segment.point = segment.point.add(mouseVector.divide(1.01));
                }
                var next = segment.next;
                var previous = segment.previous;
                if (next && !next.point.fixed) {
                    next.point = next.point.add(mouseVector.divide(6));
                }
                if (previous && !previous.point.fixed) {
                    previous.point = previous.point.add(mouseVector.divide(6));
                }
            }


            var surfaceLength = surface.firstSegment.point.getDistance(surface.lastSegment.point);
            var maxDist = view.size.height / 2;

            for (i = 0; i < surface.segments.length; i++) {
                var point = surface.segments[i].point;
                var anchor = point.anchor;

                if (!point.fixed) {

                    var dy = (point.y - point.py) * pendulumForce;
                    point.py = point.y;
                    point.y = Math.min(point.anchor.y + maxDist, Math.max(point.anchor.y - maxDist, point.y + dy));


                    // Uncomment this if you want to have a more jelly-like behaviour
                    // point.y += ( anchor.y - point.y) / 80;
                }
            }

            for (var j = 0; j < springs.length; j++) {
                springs[j].update();
            }

            surface.smooth();


        };

        view.onResize = function() {
            createSurface();
        };

        var fit = this.fit = function() {

            var $canvas = $(view.element);

            var canvasWidth = $canvas.width();
            var canvasHeight = $canvas.height();

            $canvas
                .attr("width", canvasWidth)
                .attr("height", canvasHeight);

            mypaper.view.viewSize = new mypaper.Size(canvasWidth, canvasHeight);

        };
    }

    // Utilities

    function fitPaperWraps() {
        mypaper.fit();
    }

    $(window).resize(function() {
        waitForFinalEvent(fitPaperWraps, 150, "resizing-papers");
    });

    var waitForFinalEvent = (function() {
        var timers = {};
        return function(callback, ms, uniqueId) {
            if (!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if (timers[uniqueId]) {
                clearTimeout(timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();

})(jQuery);



/*--------works----------*/
var recentRow;

function populateWorks() {
    var flaskData = $('#my-data').data();
    var data = JSON.parse("[" + flaskData["name"].replace(/'/g, '"') + "]")[0];
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        if (i % 3 == 0) {
            recentRow = i;
            $("#works").append("<div id = 'workRow" + i + "'class='row works'></div>");
        }
        var name = data[i]["name"];
        var url = data[i]["url"];
        var date = data[i]["date"];
        console.log(data[i]["credit"]);
        var credits = data[i]["credit"].join(" · ");
        $("#workRow" + recentRow).append("<div class='col-md-4'>" +
            "<div class='work'>" +
            "<a class = 'workTitle' href='/works/" + url + "'>" + name + "</a>" +
            "<p class = 'workInfo' >Created on " + date +
            "<br>" + credits +
            "</p>" + "</div></div>");
    }
}

/* ---------------- FISH "CLASS" START -------------- */
var FOLLOW_DISTANCE = 100;

var Fish = function(id) {
    this.id = id;
    this.entourage = [];
    // dx/yx is current speed, ox/oy is the previous one
    this.ox = this.dx = Math.random() - 0.5;
    this.oy = this.dy = Math.random() - 0.5;

    this.x = canvas.width * Math.random();
    this.y = canvas.height * Math.random();

    // A couple of helper functions, the names should describe their purpose
    Fish.prototype.angleToClosestFish = function(otherFish) {
        otherFish = otherFish == null ? this.following : otherFish;
        if (otherFish) {
            return Math.atan2(otherFish.y - this.y, otherFish.x - this.x);
        } else {
            return Number.MAX_VALUE;
        }
    }

    Fish.prototype.angleFromFishDirectionToClosestFish = function(otherFish) {
        otherFish = otherFish == null ? this.following : otherFish;
        if (otherFish) {
            return Math.abs(deltaAngle(this.angle, this.angleToClosestFish(otherFish)));
        } else {
            return Number.MAX_VALUE;
        }
    }

    Fish.prototype.angleDirectionDifference = function(otherFish) {
        otherFish = otherFish == null ? this.following : otherFish;

        if (otherFish) {
            Math.abs(deltaAngle(this.angle, otherFish.angle));
        } else {
            return Number.MAX_VALUE;
        }
    }



    // Update the fish "physics"
    Fish.prototype.calc = function() {
        this.ox = this.dx;
        this.oy = this.dy;
        var MAX_SPEED = 1.1;
        var maxSpeed = MAX_SPEED;

        //Do I need to find another fish buddy?
        if (this.following == null || py(this.x - this.following.x, this.y - this.following.y) > FOLLOW_DISTANCE) {
            if (this.following != null) {
                if (keyDown) affinityLine(this.following, this, "white");
                this.following.entourage.splice(this.following.entourage.indexOf(this));
            }

            this.following = null;

            //attract closer to other fish - find closest
            var closestDistance = Number.MAX_VALUE;
            var closestFish = null;

            for (var i = 0; i < fishes.length; i++) {
                var fish = fishes[i];
                if (fish != this) {
                    var distance = py(this.x - fish.x, this.y - fish.y);
                    // Is it closer, within the max distance and within the sector that the fish can see?
                    if (distance < closestDistance && fish.following != this && distance < FOLLOW_DISTANCE && this.angleFromFishDirectionToClosestFish(fish) < Math.PI * 0.25) {
                        closestDistance = distance;
                        closestFish = fish;
                    }
                }
            }
            if (closestFish != null) {
                this.following = closestFish;
                closestFish.entourage.push(this);
            }
        }

        // Fish is following another
        if (this.following != null) {
            // Go closer to other fish
            this.followingDistance = py(this.x - this.following.x, this.y - this.following.y);
            this.distanceFactor = 1 - this.followingDistance / FOLLOW_DISTANCE;

            // If going head on, just break a little before following
            if (this.angleDirectionDifference() > (Math.PI * 0.9) && // On colliding angle?
                this.angleFromFishDirectionToClosestFish() < (Math.PI * 0.2)) { // In colliding sector?
                this.dx += this.following.x * 0.1;
                this.dy += this.following.y * 0.1;
                if (keyDown) affinityLine(this.following, this, "yellow");
            } else if (this.followingDistance > FOLLOW_DISTANCE * 0.3) { // Dont go closer if close
                this.dx += Math.cos(this.angleToClosestFish()) * (0.05 * this.distanceFactor);
                this.dy += Math.sin(this.angleToClosestFish()) * (0.05 * this.distanceFactor);
            }
            if (keyDown) affinityLine(this.following, this, "red");
        }

        // Go closer to center, crashing into the canvas walls is just silly!
        if (this.x < canvas.width * .1 || this.x > canvas.width * .9 || this.y < canvas.height * .2 || this.y > canvas.height * .8) {
            this.dx += (canvas.width / 2 - this.x) / 5000;
            this.dy += (canvas.height / 2 - this.y) / 5000;
        }

        // Poor little fishies are scared of your cursor
        if (py(this.x - cursor.x, this.y - cursor.y) < FOLLOW_DISTANCE * 0.75) {
            this.dx -= (cursor.x - this.x) / 500;
            this.dy -= (cursor.y - this.y) / 500;
            maxSpeed = 4;
            if (keyDown) affinityLine(cursor, this, "green");
        }

        // If following fish, try avoid going close to your siblings
        if (this.following != null) {
            for (var i = 0; i < this.following.entourage.length; i++) {
                var siblingFish = this.following.entourage[i];
                if (siblingFish !== this) {
                    if (py(this.x - siblingFish.x, this.y - siblingFish.y) < FOLLOW_DISTANCE * 0.2) {
                        if (keyDown) affinityLine(siblingFish, this, "yellow");
                        this.dx -= (siblingFish.x - this.x) / 1000;
                        this.dy -= (siblingFish.y - this.y) / 1000;
                    }
                }
            }
        }

        // Calculate heading from new speed
        this.angle = Math.atan2(this.dy, this.dx);

        // Grab the speed from the vectors, and normalize it
        var speed = Math.max(0.1, Math.min(maxSpeed, py(this.dx, this.dy)));

        // Recreate speed vector from recombining angle of direction with normalized speed
        this.dx = Math.cos(this.angle) * (speed + speedBoost);
        this.dy = Math.sin(this.angle) * (speed + speedBoost);

        // Fish like to move it, move it!
        this.x += this.dx;
        this.y += this.dy;
    }
}

/* ---------------------- FISH "CLASS" END -------------- */

/* ---------------------- MAIN START -------------------- */
var canvas;
var context; 
var fishes = [];

var speedBoostCountdown = 200,
    speedBoost = 0,
    SPEED_BOOST = 2;
var fishBitmap = new Image();

function startFishBackground() {
    canvas = document.getElementById('fishtank');
    context = canvas.getContext('2d');
    fishBitmap.onload = function() {
        update();
    };
}
fishBitmap.src = "/static/img/fish.png";

//Draw Circle
function draw(f) {
    var r = f.angle + Math.PI;

    context.translate(f.x, f.y);
    context.rotate(r);

    var w = 20;
    var acc = py(f.dx - f.ox, f.dy - f.oy) / 0.05;

    // If a fish does a "flip", make it less wide
    if (acc > 1) {
        w = 10 + 10 / acc;
    }

    context.drawImage(fishBitmap, 0, 0, w, 6);
    context.rotate(-r);
    context.translate(-f.x, -f.y);
}

// Pythagoras shortcut
function py(a, b) {
    return Math.sqrt(a * a + b * b);
}

//------------ USER INPUT START -------------
var cursor = {
    x: 0,
    y: 0
};
var cursorDown = false,
    keyDown = false;

function startWorksFishUserInput() {
    document.onmousemove = function(e) {
        cursor.x = e.pageX - (window.innerWidth / 2 - canvas.width / 2);
        cursor.y = e.pageY - (window.innerHeight / 2 - canvas.height / 2);
    }

    document.onmouseout = function(e) { //Out of screen is not a valid pos
        cursor.y = cursor.x = Number.MAX_VALUE;
    }

    document.onmousedown = function() {
        activateSpeedBoost();
        cursorDown = true;
    }
    document.onmouseup = function() {
        cursorDown = false;
    }

    document.onkeydown = function() {
        keyDown = true;
    }

    document.onkeyup = function() {
        keyDown = false;
    }
}
//------------ USER INPUT STOP -------------

function deltaAngle(f, o) { //Find the shortest angle between two
    var r = f - o;
    return Math.atan2(Math.sin(r), Math.cos(r));
}

function affinityLine(f, o, c) { //Draw a line with pretty gradient
    var grad = context.createLinearGradient(f.x, f.y, o.x, o.y);
    grad.addColorStop(0, c);
    grad.addColorStop(1, "black");

    context.strokeStyle = grad;
    context.beginPath();
    context.moveTo(f.x, f.y);
    context.lineTo(o.x, o.y);
    context.stroke();
}

function activateSpeedBoost() {
    speedBoostCountdown = 400 + Math.round(400 * Math.random());
    speedBoost = SPEED_BOOST;
}

//Update and draw all of them
function update() {
    if (fishes.length < 500) {
        fishes.push(new Fish(fishes.length));
    }

    if (!cursorDown) {
        //clear the canvas
        canvas.width = canvas.width; //Try commenting this line :-)

        //Update and draw fish
        for (var i = 0; i < fishes.length; i++) {
            var fish = fishes[i];
            fish.calc();
            draw(fish);
        }
    }

    speedBoostCountdown--;
    if (speedBoostCountdown < 0) {
        activateSpeedBoost();
    }

    if (speedBoost > 0) {
        speedBoost -= SPEED_BOOST / 80; //Reduce speed bost fast!
    } else {
        speedBoost = 0;
    }

    requestAnimationFrame(update);
}
/* ---------------------- MAIN END ----------------------- */

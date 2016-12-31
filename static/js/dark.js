/*
$("body").mouseover(function() {
    var x = event.clientX; // Get the horizontal coordinate
    var y = event.clientY;
    var coor = "X coords: " + x + ", Y coords: " + y;
    console.log(coor);
    $(this).css("opacity", 0.5);
})
*/
var hole_diam = 200;

/*
window.onresize = function() {
    var img = document.getElementById('castle');
    img.style.width = "100%";
    img.style.height = "100%";
    var hole = document.getElementById("hole");
    hole.style.width = "100%";
    hole.style.height = "100%";
};
*/


$(".im").on({
    mouseenter: function() {
        //stuff to do on mouseover
        console.log("butterfly hovered");
        $(this).show();
    },
    mouseleave: function() {
        //stuff to do on mouseleave
        console.log("butterfly not hovered");
        $(this).hide();
    }
});

$(document).ready(function() {
    $(document).mousemove(function(e) {
        $(".drop").remove();
        $('#hole').css('left', e.pageX + "px");
        $('#hole').css('top', e.pageY + "px");
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        createRain(mouseX - hole_diam, mouseX + hole_diam, mouseY - hole_diam, mouseY + hole_diam);
        $("#castle").css("clip", "rect(" + (mouseY - hole_diam) + "px, " + (mouseX + 2*hole_diam) + "px, " + (mouseY + hole_diam) + "px, " + (mouseX - 2.5*hole_diam) + "px)");
        console.log("css:" + $("#castle").css("clip"));
        $(".im").each(function(index) {

            ///* clip: shape(top, right, bottom, left); NB 'rect' is the only available option */
            myelement = $(this);
            var bounds = [myelement.offset().left, myelement.offset().top, myelement.width(), myelement.height()];
            if (mouseX > bounds[0] && mouseX < (bounds[0] + bounds[2]) && mouseY > bounds[1] && mouseY < (bounds[3] + bounds[1])) {
                $(this).show();
                $(this).css("visibility", "visible");
            } else {
                $(this).css("visibility", "hidden");
            }
        });

    });
});



/*----------rain--------------*/
// number of drops created.
var nbDrop = 80;

// function to generate a random number range.
function randRange(minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// function to generate drops
function createRain(leftRange0, leftRange1, topRange0, topRange1) {

    for (i = 1; i < nbDrop; i++) {
        var dropLeft = randRange(leftRange0, leftRange1);
        var dropTop = randRange(topRange0, topRange1);

        $('.rain').append('<div class="drop" id="drop' + i + '"></div>');
        $('#drop' + i).css('left', dropLeft);
        $('#drop' + i).css('top', dropTop);
    }

}

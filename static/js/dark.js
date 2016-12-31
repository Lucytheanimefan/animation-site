/*
$("body").mouseover(function() {
    var x = event.clientX; // Get the horizontal coordinate
    var y = event.clientY;
    var coor = "X coords: " + x + ", Y coords: " + y;
    console.log(coor);
    $(this).css("opacity", 0.5);
})
*/

$(".im").hover(function() {
    console.log("hover over butterfly");
})

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
    var isHovered = $('#butterfly').is(":hover");

    $(document).mousemove(function(e) {
        console.log(isHovered);
        //$('#circle').css('left',e.pageX+"px");
        //$('#circle').css('top',e.pageY+"px");
        $('#hole').css('left', e.pageX + "px");
        $('#hole').css('top', e.pageY + "px");
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        $(".im").each(function(index) {
            myelement = $(this);
            $(this)[0].getBoundingClientRect()
            var bounds = [myelement.offset().left, myelement.offset().top, myelement.width(), myelement.height()];
            console.log("Bounds: "+bounds);
            if (mouseX > bounds[0] && mouseX < (bounds[0] + bounds[2]) && mouseY > bounds[1] && mouseY < (bounds[3] + bounds[1])) {
                console.log("hovering over the image!");
                $(this).show();
                $(this).css("visibility", "visible");
            } else {
            	console.log("NOT hovering over the image!");
                $(this).css("visibility", "hidden");
            }
            console.log(index + ": " + $(this).text());
        });
    });
});

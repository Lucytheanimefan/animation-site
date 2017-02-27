$(document).ready(function() {
    mainLoop();
});

function mainLoop() {
    len = passage.length;
    for (var i = 0; i < len; i++) {
        var id = "line" + i;
        $("#text").append("<div class='line' id = " + id + ">" + passage[i] + "</div>");
        $("#" + id).fadeIn(i * 1500);
    }
}


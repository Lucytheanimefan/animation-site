//generate title

var title = "deadeyedfish";

function fillTitle(title) {
    for (var i = 0; i < title.length; i++) {
        $("#title").html($("#title").html() + "<span>" + title.charAt(i) + "</span>");
    }
}

fillTitle(title);

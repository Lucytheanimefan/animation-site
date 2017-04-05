//top right bottom left
$(document).ready(function() {
    setTimeout(function() {
        zoomEarth();

    }, 5000)

})

function zoomEarth() {
    $("#earth").animate({
        width: $(document).width() * 2 + "px",
        'margin': '-1000px -500px'
    }, 3000)
}

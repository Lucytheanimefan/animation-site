//top right bottom left
$(document).ready(function() {
    setTimeout(function() {
        zoomEarth();
    }, 5000)

})

function zoomEarth() {
    $("#earth").animate({
        width: $(document).width() * 3.9 + "px",
        'margin': '-'+$(document).width()*2.6+'px -'+1.7*$(document).width()+'px'
    }, 3000)
}

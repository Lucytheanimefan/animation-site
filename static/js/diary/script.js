generatePages(20, function() {
    $("#flipbook").turn({
        width: 1000,
        height: 800,
        autoCenter: true
    });
})



function generatePages(numPages, callback) {
    console.log("Generate pages");
    for (var i = 0; i < numPages; i++) {
        $("#flipbook").append('<div class="hard">' + i + '</div>');
    }
    callback();
}

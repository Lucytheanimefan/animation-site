function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function lineBreak(numChars, line) {
    var toRet = "";
    for (var i = 0; i < line.length; i++) {
        toRet = toRet + line.charAt(i).toString();
        if (i % numChars == 0) {
            if (line.charAt(i + 1) == ' ' || line.charAt(i - 1) == ' ') {
                toRet = toRet + "<br>";
            }/*else{
            	toRet = toRet + "-<br>";
            }*/
        }
    }
    return toRet;
}

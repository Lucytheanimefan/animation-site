// Dedicated to Hikigaya Hachiman

var quotes = ["There are no inherently bad people. Everyone believes that, myself included. I don’t doubt the existence of virtue. And yet people bare their fangs when it seems they can profit. People will rationalize their own behavior whenever they become tainted with evil; they’re not supposed to be evil. In order to preserve their own twisted integrity, the world becomes twisted. Someone you praised as “cool” until yesterday is “stuck up” today; someone you respected as “smart and knowledgeable” is now scorned as someone who “looks down on bad students”, and “energetic vigor” becomes “annoying and overly carried away”."];

var canvas;
var ctx;

$(document).ready(function() {
	canvasSetup();
	console.log(findLetter(quotes[0], "i"));
	drawText(quotes[0]);
});


function canvasSetup() {
	canvas = document.getElementById('background');
    canvas.width = $(document).width();
    canvas.height = $(document).height();
    ctx = canvas.getContext('2d');
}

/**
 * Finds the first instance of where the letter is located and removes it.
 * @param  {[type]} string [description]
 * @param  {[type]} letter [description]
 * @return {[type]}        Returns the first index where the character/letter was found in the string
 */
function findLetter(string, letter) {
    for (var i = 0, len = string.length; i < len; i++) {
        if (string[i] == letter) {
            return i;
        }
    }
}

function drawText(text){
	ctx.fillText(text,10,50);
}
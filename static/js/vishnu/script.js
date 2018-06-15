var $lines = $('.prompt p');
$lines.hide();
var lineContents = new Array();

var stuff = ["Freshman Vishnu Menon commented that the sample taco tasted much better than its Marketplace equivalent (http://www.dukechronicle.com/article/2015/09/students-get-first-taste-of-west-unions-devils-krafthouse)", "Almighty debugger of the case of the bad C http request"];

var vish;
var popped = 0;
$.get("/lol", function(data, status) {
    console.log(data);
    vish = data;
    stuff.push(vish);
});
var terminal = function() {
    var skip = 0;
    typeLine = function(idx) {
        idx == null && (idx = 0);
        var element = $lines.eq(idx);
        var content = lineContents[idx];
        if (typeof content == "undefined") {
            $('.skip').hide();
            return;
        }
        var charIdx = 0;

        var typeChar = function() {
            var rand = Math.round(Math.random() * 150) + 25;

            setTimeout(function() {
                var char = content[charIdx++];
                element.append(char);
                if (typeof char !== "undefined")
                    typeChar();
                else {
                    if (popped == 3) {
                        element.append('<br/><span class="output">' + stuff.shift() /*element.text().slice(31, -1)*/ + '</span>');
                        element.removeClass('active');
                        typeLine(++idx);
                        popped += 1;
                    } else {
                        element.append('<br/><span class="output">' + stuff.shift() /*element.text().slice(31, -1)*/ + '</span>');
                        element.removeClass('active');
                        typeLine(++idx);
                        popped += 1;
                    }
                }
            }, skip ? 0 : rand);
        }
        content = 'echo "' + content + '"';
        element.append('vishnu@vishnu-laptop:~/$ ').addClass('active');
        typeChar();
    }

    $lines.each(function(i) {
        lineContents[i] = $(this).text();
        $(this).text('').show();
    });

    typeLine();
}

terminal();

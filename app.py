import os
import json
from flask import Flask, render_template, send_from_directory, jsonify, request, redirect, url_for
from flask_assets import Environment, Bundle
from flask_compress import Compress
from aylienapiclient import textapi

app = Flask(__name__)

UPLOAD_FOLDER = '/tmp/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

Compress(app)

assets = Environment(app)

# css = Bundle("css/style.css", "css/lib/bootstrap/css/bootstrap.min.css", output='gen/packed.css')
# assets.register('home_css', css)

js = Bundle("js/lib/jquery.min.js", "js/mygraphics.js", "js/lib/soundmanager2-jsmin.js",
            "css/lib/bootstrap/js/bootstrap.min.js", "plugins/anime.min.js", "plugins/paper-full.min.js",
            "js/script.js",
            output='gen/packed.js')
assets.register('js_layout', js)

genlayout_js = Bundle("js/lib/jquery.min.js", "js/mygraphics.js", "js/lib/soundmanager2-jsmin.js",
                      "css/lib/bootstrap/js/bootstrap.min.js", "plugins/anime.min.js", "plugins/paper-full.min.js",
                      output='gen/packed.js')
assets.register('js_genlayout', genlayout_js)

my_works = [
    {'url': 'castleinblood', 'name': 'Castle in Blood', 'credit': ["Lucy", "Stephanie Zhou"], 'date': '12/31/16'},
    {'url': 'chapel_entrance', 'name': 'Chapel in Light', 'credit': ["Lucy", "Yuhao Hu (photography)"],
     'date': '2/22/17'},
    {'url': 'deathnote', 'name': 'Death Note', 'credit': ['Lucy'], 'date': '1/9/17'},
    # {'url':'chair','name':'Unravel (Tokyo Ghoul)','credit':["Lucy"],'date':'3/7/17'},
    {'url': 'butterfly', 'name': 'Butterfly', 'credit': ["Kaijie Chen", "Lucy"], 'date': '3/16/17'},
    {'url': 'flower', 'name': 'Flower', 'credit': ["Lucy", "Yuhao Hu (photography)"], 'date': '4/6/17'},
    {'url': 'dystopia', 'name': 'Comet', 'credit': ["Kaijie Chen", "Lucy"], 'date': '4/28/17'},
    # {'url':'oneMoreLight','name':'One More Light','credit':['Lucy'], 'date':'8/1/17'},
    {'url': 'quotes', 'name': 'Quote Sentiment Visualization', 'credit': ['Lucy'], 'date': '1/27/18'},
    {'url': 'music_manipulator', 'name': 'Sound Manipulator', 'credit': ['Lucy'], 'date': '2/13/18'},
    {'url': 'glitch', 'name': 'Glitch', 'credit': ['Lucy'], 'date': '2/27/18'},
    {'url': 'music-art', 'name': 'Line Music', 'credit': ['Lucy'], 'date': '4/16/18'},
    {'url': 'derpderp', 'name': 'Derp Derp', 'credit': ['Lucy', 'Stephanie Zhou'], 'date': '6/15/18'},
    {'url': 'cage', 'name': 'Cage', 'credit': ['Lucy'], 'date': '6/25/18'},
    {'url': 'spirograph', 'name': 'Spirograph', 'credit': ['Lucy'], 'date': '6/27/18'},]


descriptions = {'castleinblood': 'There\'s a castle in the dark and it\'s raining blood (or whatever you\'d like to interpret that red as, but we say it\'s blood. Your mouse functions as a flashlight. Hover your mouse over the screen to see beyond the black.',
'chapel_entrance': '<p>This project uses Yuhao Hu\'s phenomenal photography of the Duke University chapel and fancy HTML canvas animations to embellish and enhance the image. The sun peeking in the from the top of the chapel inspired the theme of light so you\'ll see light represented as lines and shapes animated in when the piece first loads in the browser.</p> <p> To quote Yuhao\'s description when he saw the finished piece: When the curves descend and an arc about the sun developed to about just matching the arc on the gate. This point, the motion is quite developed on the left-top, right-top, right-bottom corners, and seemingly that there remains for something to occur to the left side. Then, when I let the motions go long enough, I\'ll see curves being developed quite rapidly, perhaps one by one, concentrating on the upper half of the window, until that part of space almost entirely whited out. Also, lots of thread ends appear on the upper-left, which somewhat reduces the feeling of "continuity", something that was so amazingly clear during the first several seconds.</p>',
'deathnote': '<p>Created a digital version of the Death Note notebook as featured in the anime. Flip to the last page to see names being written.</p>',
'butterfly': '',
'flower': '<p>Another piece that uses Yuhao Hu\'s photography and fancy canvas animations to highlight a flower theme as well as show off interesting line designs.</p>',
'dystopia': 'This piece was inspired by the anime film Kimi no Na Wa, which tells a story about a comet crashing into a small village, Itomori. We represent the planet earth through the alternating backgrounds: from New York City to the Great Wall of China. Finally, the comet spinning around the Earth collides and shatters the planet, leaving a Grim Reaper in the background.The interactions were created using three.js, the images designed in Photoshop, and the music composed in Garageband.',
'quotes': 'Visualizing text sentiment analysis with three.js and the alien API.',
'spirograph': 'Watch cool geometries form as you move your mouse in circles on the screen.',
'cage': 'Watch criss crosses and boxes animate as you move your mouse around the screen.',
'music-art': 'A variety of music visualizers that you can select from the dropdown',
'derpderp':'derpy fish',
'spirograph': 'A trippy animation/interactive with spriographs',
'glitch': 'Glitch world made with three.js',
}


@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html')


@app.route("/works")
def works():
    return render_template('works.html', works=my_works)


@app.route("/about")
def about():
    return render_template('about.html', isWorks=False)


@app.route('/work/<variable>', methods=['GET'])
def individual_work(variable):
    return render_template('project.html', work=variable, description=descriptions[variable])

@app.route('/project/<variable>', methods=['GET'])
def project(variable):
    return render_template(variable + '/index.html')


@app.route('/project/<variable>/<specific_work>', methods=['GET'])
def specific_work(variable, specific_work):
    return render_template(variable + '/' + specific_work + '.html', isWorks=True)


@app.route("/sentiment_analysis", methods=['POST'])
def sentiment_analysis():
    text_list = request.form['quote'].encode('utf-8').split('.')
    client = textapi.Client('8d1fc860', 'e87b5298692123977e5c6cc98c6dae0e')
    sentiment_per_line = {}
    for i, text in enumerate(text_list):
        sentiment = client.Sentiment({'text': text})
        sentiment_per_line[i] = sentiment
    print(sentiment_per_line)
    # return redirect(url_for('work', variable = 'quotes', data = json.dumps(sentiment_per_line)))
    return render_template('quotes/index.html', data=json.dumps(sentiment_per_line))


@app.route('/upload/<template>/<work>', methods=['POST'])
def upload(template, work):
    # Get the name of the uploaded file
    file = request.files['file']
    full_filename = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(full_filename)

    return render_template(template + '/' + work + '.html',
                           musicfile=str(url_for('uploaded_file', filename=file.filename)))


# This route is expecting a parameter containing the name
# of a file. Then it will locate that file on the upload
# directory and show it on the browser, so if the user uploads
# an image, that image is going to be show after the upload
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # app.run(host='0.0.0.0', port=port, threaded=True)
    app.run(debug=True)

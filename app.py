import os
import json
from flask import Flask, render_template,send_from_directory, jsonify, request, redirect,url_for
from flask_assets import Environment, Bundle
from flask_compress import Compress
from aylienapiclient import textapi
import requests

app = Flask(__name__)
Compress(app)

assets = Environment(app)

#css = Bundle("css/style.css", "css/lib/bootstrap/css/bootstrap.min.css", output='gen/packed.css')
#assets.register('home_css', css)

js = Bundle("js/lib/jquery.min.js", "js/mygraphics.js", "js/lib/soundmanager2-jsmin.js", "css/lib/bootstrap/js/bootstrap.min.js", "plugins/anime.min.js", "plugins/paper-full.min.js", "js/script.js",
            output='gen/packed.js')
assets.register('js_layout', js)

genlayout_js = Bundle("js/lib/jquery.min.js", "js/mygraphics.js", "js/lib/soundmanager2-jsmin.js", "css/lib/bootstrap/js/bootstrap.min.js", "plugins/anime.min.js", "plugins/paper-full.min.js",
            output='gen/packed.js')
assets.register('js_genlayout', genlayout_js)

my_works = [{'url':'castleinblood','name':'Castle in Blood','credit':["Lucy","Stephanie"],'date':'12/31/16'},
{'url':'chapel_entrance','name':'Chapel in Light','credit':["Lucy", "Yuhao Hu (photography)"],'date':'2/22/17'},
{'url':'deathnote','name':'Death Note','credit':['Lucy'],'date':'1/9/17'},
#{'url':'chair','name':'Unravel (Tokyo Ghoul)','credit':["Lucy"],'date':'3/7/17'},
{'url':'butterfly','name':'Butterfly','credit':["Kaijie", "Lucy"],'date':'3/16/17'},
{'url':'flower','name':'Flower','credit':["Lucy", "Yuhao Hu (photography)"],'date':'4/6/17'},
{'url':'dystopia','name':'Comet','credit':["Kaijie", "Lucy"],'date':'4/28/17'},
{'url':'oneMoreLight','name':'One More Light','credit':['Lucy'], 'date':'8/1/17'},
{'url':'quotes','name':'Quote Sentiment Visualization','credit':['Lucy'], 'date':'1/27/18'},
{'url':'music_manipulator','name':'Sound Manipulator','credit':['Lucy'], 'date':'2/13/18'}]

@app.route("/")
@app.route("/home")
def home():
	return render_template('home.html')

@app.route("/works")
def works():
	return render_template('works.html', works = my_works)

@app.route("/about")
def about():
	return render_template('about.html', isWorks = False)

@app.route('/works/<variable>', methods=['GET'])
def work(variable):
    return render_template(variable+'/index.html', isWorks = True)

@app.route("/sentiment_analysis", methods = ['POST'])
def sentiment_analysis():
	text_list = request.form['quote'].encode('utf-8').split('.')
	client = textapi.Client('8d1fc860', 'e87b5298692123977e5c6cc98c6dae0e')
	sentiment_per_line = {}
	for i, text in enumerate(text_list):
		sentiment = client.Sentiment({'text': text}) 
		sentiment_per_line[i] = sentiment
	print sentiment_per_line
	#return redirect(url_for('work', variable = 'quotes', data = json.dumps(sentiment_per_line)))
	return render_template('quotes/index.html', data = json.dumps(sentiment_per_line))


# @app.route("/googleDoodle")
# def doodle():
# 	return render_template("googleDoodle/index.html")

# @app.route("/game")
# def game():
# 	return render_template("game/index.html")

@app.route("/music_manipulator")
def apple():
	return render_template("music_manipulator/index.html")



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    #app.run(host='0.0.0.0', port=port, threaded=True)
    app.run(debug=True)
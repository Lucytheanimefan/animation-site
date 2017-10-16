import os
from flask import Flask, render_template,send_from_directory, jsonify
from flask_assets import Environment, Bundle
from flask_compress import Compress
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
{'url':'oneMoreLight','name':'One More Light','credit':['Lucy'], 'date':'8/1/17'}]

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
def daily_post(variable):
    return render_template(variable+"/index.html", isWorks = True)

@app.route("/oneMoreLight")
def chair():
	return render_template("oneMoreLight/index.html")


@app.route("/googleDoodle")
def doodle():
	return render_template("googleDoodle/index.html")

@app.route("/game")
def game():
	return render_template("game/index.html")

@app.route("/quotes")
def apple():
	return render_template("quotes/index.html")



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    #app.run(host='0.0.0.0', port=port, threaded=True)
    app.run(debug=True)
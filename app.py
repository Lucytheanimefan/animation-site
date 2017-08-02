import os
from flask import Flask, render_template,send_from_directory, jsonify
#from flask_assets import Environment, Bundle
import requests

app = Flask(__name__)
'''
assets = Environment(app)

js = Bundle('/js/lib/jquery.js', 'base.js', 'widgets.js',
            filters='jsmin', output='gen/packed.js')
assets.register('js_all', js)
'''

my_works = [{'url':'castleinblood','name':'Castle in Blood','credit':["Lucy","Stephanie"],'date':'12/31/16'},
{'url':'chapel_entrance','name':'Chapel in Light','credit':["Lucy", "Yuhao Hu (photography)"],'date':'2/22/17'},
{'url':'deathnote','name':'Death Note','credit':['Lucy'],'date':'1/9/17'},
#{'url':'chair','name':'Unravel (Tokyo Ghoul)','credit':["Lucy"],'date':'3/7/17'},
{'url':'butterfly','name':'Butterfly','credit':["Kaijie", "Lucy"],'date':'3/16/17'},
{'url':'flower','name':'Flower','credit':["Lucy", "Yuhao Hu (photography)"],'date':'4/6/17'},
{'url':'dystopia','name':'Comet','credit':["Kaijie", "Lucy"],'date':'4/28/17'},
{'url':'oneMoreLight','name':'One More Light','credit':['Lucy'], 'date':'8/1/17'}]



#js = Bundle('js/jquery.js', 'base.js', 'widgets.js',filters='jsmin', output='packed.js')
#assets.register('js_all', js)

#{'url':'butterfly','name':'Butterfly','credit':["Lucy","Kaijie"],'date':''}, NOT DONE YET
@app.route("/")
@app.route("/home")
def home():
	return render_template('home.html')

@app.route("/works")
def works():
	print works
	return render_template('works.html', works = my_works)

@app.route("/about")
def about():
	return render_template('about.html')

@app.route('/works/<variable>', methods=['GET'])
def daily_post(variable):
    #do your code here
    return render_template(variable+"/index.html")

'''
@app.route("/castleinblood")
def castle():
	return render_template('castleinblood/index.html')

@app.route("/butterfly")
def butterfly():
	return render_template('butterfly/index.html')

@app.route("/three")
def three():
	return render_template('three/three.html')

@app.route("/chapel_entrance")
def chapel():
	return render_template('chapel_entrance/index.html')
'''

@app.route("/oneMoreLight")
def chair():
	return render_template("oneMoreLight/index.html")


@app.route("/googleDoodle")
def doodle():
	return render_template("googleDoodle/index.html")

@app.route("/game")
def game():
	return render_template("game/index.html")

@app.route("/apple")
def apple():
	return render_template("apple.html")



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    #app.run(host='0.0.0.0', port=port, threaded=True)
    app.run(debug=True)
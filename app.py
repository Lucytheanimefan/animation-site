import os
from flask import Flask, render_template
from flask_assets import Environment, Bundle

app = Flask(__name__)

my_works = [{'url':'castleinblood','name':'Castle in Blood','credit':["Lucy","Stephanie"],'date':'12/31/16'},
{'url':'chapel_entrance','name':'Chapel in Light','credit':["Lucy", "Yuhao Hu"],'date':'2/22/17'},
{'url':'deathnote','name':'Death Note','credit':['Lucy'],'date':'1/9/17'}]

assets = Environment(app)

#js = Bundle('js/jquery.js', 'base.js', 'widgets.js',filters='jsmin', output='packed.js')
#assets.register('js_all', js)

#{'url':'butterfly','name':'Butterfly','credit':["Lucy","Kaijie"],'date':''}, NOT DONE YET
@app.route("/")
@app.route("/home")
def home():
	return render_template('main.html')

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


@app.route("/chair")
def chair():
	return render_template("chair/index.html")


@app.route("/deathnote")
def diary():
	return render_template("deathnote/index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
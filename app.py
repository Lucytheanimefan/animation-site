import os
from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route("/")
@app.route("/home")
def home():
	return render_template('main.html')

@app.route("/works")
def works():
	return render_template('works.html')

@app.route("/about")
def about():
	return render_template('about.html')

@app.route("/castleinblood")
def castle():
	return render_template('castleinblood/test.html')

@app.route("/three")
def three():
	return render_template('three/three.html')

'''
@app.route("/deathnote")
def deathnote():
	return render_template("deathnote/index.html")
'''

@app.route("/deathnote")
def diary():
	return render_template("deathnote/index.html")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
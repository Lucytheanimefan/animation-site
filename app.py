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

@app.route("/test")
def test():
	return render_template('test/test.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
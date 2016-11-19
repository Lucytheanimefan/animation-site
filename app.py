import os
from flask import Flask
from flask import render_template
from nutritionix import Nutritionix

app = Flask(__name__)

nix = Nutritionix(app_id="7f770e5d", api_key="dae4065c600b6b161789a27471167ccd") #make these env variables later

@app.route("/")
def hello():
	print nix.search('pizza').json()
	return render_template('main.html')

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
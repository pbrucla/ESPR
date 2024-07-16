from flask import Flask, request
from flask_cors import CORS, cross_origin
import flask

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
def hello_world():
  return "<p>Hello, World!</p>"

@app.route("/packages_sample", methods=['GET'])
def packages_sample():
  sample_package_1 = {
    "name": "yahaha",
    "description": "Yahaha!\nYou found me!\nBuh bye!",
    "version_history": [
      "1.0.0",
      "1.1.0",
      "2.0.0",
      "2.0.1"
    ]
  }
  sample_package_2 = {
    "name": "cybercoin",
    "description": "Run your own node on the CyberCoin network!",
    "version_history": [
      "1.0.0"
    ]
  }
  response = flask.jsonify([sample_package_1, sample_package_2])
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response, 200

@app.route("/publish_package_sample", methods=['POST'])
@cross_origin()
def publish_package_sample():
  name = request.form['name']
  initial_version = request.form['initial_version']
  description = request.form['description']
  response = flask.jsonify({"name": name, "initial_version": initial_version, "description": description})
  return response, 201
from flask import Flask, request

app = Flask(__name__)

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
  return [sample_package_1, sample_package_2], 200

@app.route("/publish_package_sample", methods=['POST'])
def publish_package_sample():
  name = request.form['name']
  initial_version = request.form['initial_version']
  description = request.form['description']

  return {"name": name, "initial_version": initial_version, "description": description}, 201


@app.route("/package_info_sample/0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", methods=['GET'])
def package_info_sample_1():
  info = {
    "name": "yahaha",
    "author": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "versions": [
      "1.0.0",
      "1.0.1",
      "1.0.2",
      "1.1.0",
      "2.0.0"
    ],
    "dependencies": {
      "1.0.0": ["numpy >= 1.20.0"],
      "1.0.1": ["numpy >= 1.20.0"],
      "1.0.2": ["numpy >= 1.23.0"],
      "1.1.0": ["numpy >= 1.24.0"],
      "2.0.0": ["numpy >= 2.0.0", "web3 >= 6.20.0"]
    },
    "collaborators": [
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    ],
    "status": "alive"
  }

  return info, 200
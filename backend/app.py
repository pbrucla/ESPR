# from solcx import install_solc, set_solc_version, compile_standard
from flask import Flask, request, jsonify, abort, render_template_string
from web3 import Web3
import json
import os

# Install and set Solidity version
# install_solc('v0.8.2')
# set_solc_version('v0.8.2')
from flask_cors import CORS, cross_origin
import flask

app = Flask(__name__)

# Connect to local Ethereum node
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
print(w3.is_connected())

# Private key should be a string
private_key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
account_0 = w3.eth.account.from_key(private_key)

'''
# Define file path and compile the contract
file_path = os.path.abspath("../blockchain/src")
name = "packageContract.sol"
input = {
    'language': 'Solidity',
    'sources': {
        name: {'urls': [file_path + "/" + name]}
    },
    'settings': {
        'outputSelection': {
            '*': {
                '*': ["abi", "metadata", "evm.bytecode", "evm.bytecode.sourceMap"],
            },
            'def': {name: ["abi", "evm.bytecode.opcodes"]},
        }
    }
}

output = compile_standard(input, allow_paths=file_path)
contracts = output["contracts"]

with open('compiled_code.json', "w") as file:
    json.dump(output, file)

init_bytecode = contracts["packageContract.sol"]["PackageManager"]["evm"]["bytecode"]["object"]
abi = contracts["packageContract.sol"]["PackageManager"]["abi"]
'''

with open("./artifacts/PackageManager.json", "r") as f:
    package_manager_json = json.load(f)
package_manager_bytecode = package_manager_json["bytecode"]["object"]
package_manager_abi = package_manager_json["abi"]
with open("./artifacts/Package.json", "r") as f:
    package_instance_json = json.load(f)
package_instance_bytecode = package_instance_json["bytecode"]["object"]
package_instance_abi = package_instance_json["abi"]

# Deploy the contract
Package_Contract = w3.eth.contract(bytecode=package_manager_bytecode, abi=package_manager_abi)
tx_hash = Package_Contract.constructor().transact({"from": account_0.address})
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
deployed_addr = receipt.contractAddress

numpackages = 0

@app.route("/", methods=['GET', 'POST'])
def home():
    global numpackages
    package_address = ""
    message = ""

    if request.method == 'POST':
        packageName = request.form['package_name']
        dependencies = request.form.getlist('dependencies')
        description = request.form['description']
        #cidhash = request.form['cid']
        cidhash = "temp"

        # Create a contract instance
        package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)

        # Build the transaction
        unsent_tx = package_manager_contract.functions.create_package(packageName, dependencies, description, cidhash).build_transaction({
            "from": account_0.address,
            "nonce": w3.eth.get_transaction_count(account_0.address),
        })

        # Sign the transaction
        signed_tx = w3.eth.account.sign_transaction(unsent_tx, private_key=private_key)

        # Send the transaction
        tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"Transaction sent with hash: {tx_hash.hex()}")

        # Wait for the transaction receipt with a longer timeout
        try:
            receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            print(f"Transaction mined in block {receipt['blockNumber']}")
            package_address = package_manager_contract.functions.packages(numpackages).call()
            numpackages += 1
        except Exception as e:
            print(f"Error waiting for transaction receipt: {str(e)}")
            message = "Error waiting for transaction receipt."

        # Check if the transaction was successful
        if receipt.status != 1:
            message = "Transaction failed"
        else:
            message = f"Package successfully created. Go to /package_info/{package_address} to view the created contract."

    # Render the form with the previous inputs and message
    return render_template_string('''
    <form method="post">
        Package Name: <input type="text" name="package_name" value="{{ package_name }}" required><br>
        Dependencies (comma separated): <input type="text" name="dependencies" value="{{ dependencies }}" required><br>
        Description <input type="text" name="description" value="{{ description }}" required><br>
        <input type="submit" value="Create Package">
    </form>
    <p>{{ message }}</p>
    ''', package_name=request.form.get('package_name', ''),
       dependencies=request.form.get('dependencies', ''),
       description=request.form.get('description', ''),
       message=message)

@app.route("/packages", methods=['GET'])
def packages_sample():
  # Create a contract instance
  package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)

  packages = []
  for i in range(numpackages):
      package_address = package_manager_contract.functions.packages(i).call()

      # Create a contract instance for the Package contract
      package_contract = w3.eth.contract(address=package_address, abi=package_instance_abi)
      package_description = package_contract.functions.description().call()
      package_name = package_contract.functions.get_name().call()
      package_versions = package_contract.functions.get_versions().call()
      packages.append({"name": package_name, "description" : package_description, "version_history" : package_versions})

  response = jsonify(packages)
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response, 200

@app.route("/package_info/<package_address>", methods=['GET'])
def package_info(package_address):
    if not Web3.is_address(package_address):
        abort(400)

    # Create a contract instance
    #package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)

    '''
    # ABI for the Package contract
    package_abi = contracts["packageContract.sol"]["Package"]["abi"]
    '''

    # Create a contract instance for the Package contract
    package_contract = w3.eth.contract(address=package_address, abi=package_instance_abi)

    # Fetch data from the Package contract
    package_name = package_contract.functions.get_name().call()
    package_author = package_contract.functions.get_author().call()
    package_versions = package_contract.functions.get_versions().call()
    package_description = package_contract.functions.get_description().call()
    package_dependencies = {}
    for version in package_versions:
      package_dependencies[version] = package_contract.functions.get_dependencies(version).call()
    package_collaborators = package_contract.functions.get_collaborators().call()
    package_status = "alive"

    info = {
      "name": package_name,
      "author": package_author,
      "versions": package_versions,
      "dependencies": package_dependencies,
      "collaborators": package_collaborators,
      "status": package_status,
      "description": package_description
    }
    return info, 200

@app.route("/events", methods=['GET'])
def get_events():
    try:
        package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)
        event_filter = package_manager_contract.events.packageCreated.create_filter(fromBlock=0)
        events = event_filter.get_all_entries()

        events_list = []
        for event in events:
            events_list.append({
                "sender": event.args.sender,
                "packageName": event.args.packageName,
                "dependencyList": event.args.dependencyList
            })

        return jsonify(events_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# @app.route("/packages_sample", methods=['GET'])
# def packages_sample():
#     sample_package_1 = {
#         "name": "yahaha",
#         "description": "Yahaha!\nYou found me!\nBuh bye!",
#         "version_history": [
#             "1.0.0",
#             "1.1.0",
#             "2.0.0",
#             "2.0.1"
#         ]
#     }
#     sample_package_2 = {
#         "name": "cybercoin",
#         "description": "Run your own node on the CyberCoin network!",
#         "version_history": [
#             "1.0.0"
#         ]
#     }
#     return [sample_package_1, sample_package_2], 200

@app.route("/publish_package", methods=['POST'])
def publish_package():
    packageName = request.form['package_name']
    dependencies = request.form.getlist('dependencies')
    description = request.form['description']
    #cidhash = request.form['cid']
    cidhash = "temp"
    # Create a contract instance
    package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)

    # Build the transaction
    unsent_tx = package_manager_contract.functions.create_package(packageName, dependencies, description, cidhash).build_transaction({
        "from": account_0.address,
        "nonce": w3.eth.get_transaction_count(account_0.address),
    })

    # Sign the transaction
    signed_tx = w3.eth.account.sign_transaction(unsent_tx, private_key=private_key)

    # Send the transaction
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print(f"Transaction sent with hash: {tx_hash.hex()}")

    # Wait for the transaction receipt with a longer timeout
    try:
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        print(f"Transaction mined in block {receipt['blockNumber']}")
        package_address = package_manager_contract.functions.packages(numpackages).call()
        numpackages += 1
    except Exception as e:
        print(f"Error waiting for transaction receipt: {str(e)}")
        message = "Error waiting for transaction receipt."

    # Check if the transaction was successful
    if receipt.status != 1:
        message = "Transaction failed"
    else:
        message = f"Package successfully created. Go to /package_info/{package_address} to view the created contract."

if __name__ == "__main__":
    app.run(debug=True)
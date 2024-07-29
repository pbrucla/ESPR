# from solcx import install_solc, set_solc_version, compile_standard
from flask import Flask, request, jsonify
from web3 import Web3
import json
import os

# Install and set Solidity version
# install_solc('v0.8.2')
# set_solc_version('v0.8.2')

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

numcontracts = 0

@app.route("/")
def hello_world():
    # Example data
    packageName = 'examplePackage'
    dependencies = ['dep1', 'dep2', 'dep3']

    # Create a contract instance
    package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)

    # Build the transaction
    unsent_tx = package_manager_contract.functions.create_package(packageName, dependencies).build_transaction({
        "from": account_0.address,
        "nonce": w3.eth.get_transaction_count(account_0.address),
    })

    # Sign the transaction
    signed_tx = w3.eth.account.sign_transaction(unsent_tx, private_key=private_key)

    # Send the transaction
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print(f"Transaction sent with hash: {tx_hash.hex()}")

    global numcontracts

    package_address = ""

    # Wait for the transaction receipt with a longer timeout
    try:
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        print(f"Transaction mined in block {receipt['blockNumber']}")
        package_address = package_manager_contract.functions.packages(numcontracts).call()
        numcontracts+=1
    except Exception as e:
        print(f"Error waiting for transaction receipt: {str(e)}")
        raise

    # Check if the transaction was successful
    if receipt.status != 1:
        print("Transaction failed")
        
	

    return f"<p>Hello, World. Package successfully created. Go to /package_info/{package_address} to view just created contract.</p>"

@app.route("/package_info/<package_address>", methods=['GET'])
def package_info(package_address):
    # Create a contract instance
    package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)

    '''
    # ABI for the Package contract
    package_abi = contracts["packageContract.sol"]["Package"]["abi"]
    '''

    # Create a contract instance for the Package contract
    package_contract = w3.eth.contract(address=package_address, abi=package_instance_abi)

    # Fetch data from the Package contract
    package_name = package_contract.functions.get_name().call()
    package_versions = package_contract.functions.get_versions().call()

    return jsonify({
        "name": package_name,
        "versions": package_versions
    })

@app.route("/events", methods=['GET'])
def get_events():
    try:
        package_manager_contract = w3.eth.contract(address=deployed_addr, abi=abi)
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

@app.route("/publish_package", methods=['POST'])
def publish_package():
    packageName = request.form['name']
    #initial_version = request.form['initial_version']
    #description = request.form['description']
    dependencies = request.form['dependencies']

    # Create a contract instance
    package_manager_contract = w3.eth.contract(address=deployed_addr, abi=package_manager_abi)

    # Build the transaction
    unsent_tx = package_manager_contract.functions.create_package(packageName, dependencies).build_transaction({
        "from": account_0.address,
        "nonce": w3.eth.get_transaction_count(account_0.address),
    })

    # Sign the transaction
    signed_tx = w3.eth.account.sign_transaction(unsent_tx, private_key=private_key)

    # Send the transaction
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    print(f"Transaction sent with hash: {tx_hash.hex()}")

    global numcontracts

    package_address = ""

    # Wait for the transaction receipt with a longer timeout
    try:
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        print(f"Transaction mined in block {receipt['blockNumber']}")
        package_address = package_manager_contract.functions.packages(numcontracts).call()
        numcontracts+=1
    except Exception as e:
        print(f"Error waiting for transaction receipt: {str(e)}")
        raise

    # Check if the transaction was successful
    if receipt.status != 1:
        print("Transaction failed")
        
	

    return f"<p>Package successfully created. Go to /package_info/{package_address} to view just created contract.</p>"
    return {"name": name, "initial_version": initial_version, "description": description}, 201

if __name__ == "__main__":
    app.run(debug=True)
from solcx import install_solc, set_solc_version,compile_standard
from dotenv import load_dotenv#here install solidity version
install_solc('v0.8.2')
set_solc_version('v0.8.2')
from flask import Flask, request
from web3 import Web3
import json
import os

app = Flask(__name__)
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
print(w3.is_connected())

private_key = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
account_0 = w3.eth.account.from_key(private_key)
some_address = "0x0000000000000000000000000000000000000000"

file_path = os.path.abspath("../blockchain/src")
name = "packageContract.sol"
input = {
    'language': 'Solidity',
    'sources': {
        name: {'urls': [file_path + "/" + name]}},
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


Package_Contract = w3.eth.contract(bytecode=init_bytecode, abi=abi)
tx_hash = Package_Contract.constructor().transact({"from": account_0.address})
receipt = w3.eth.get_transaction_receipt(tx_hash)
deployed_addr = receipt["contractAddress"]

@app.route("/")
def hello_world():
	# Example data
	packageName = 'examplePackage'
	dependencies = ['dep1', 'dep2', 'dep3']

	# Assuming w3 is your Web3 instance
	# Assuming deployed_addr and abi are defined elsewhere
	package_contract = w3.eth.contract(address=deployed_addr, abi=abi)

	# Build the transaction
	unsent_billboard_tx = package_contract.functions.create_package(packageName, dependencies).build_transaction({
		"from": account_0.address,
		"nonce": w3.eth.get_transaction_count(account_0.address),
	})

	# Sign the transaction
	signed_tx = w3.eth.account.sign_transaction(unsent_billboard_tx, private_key=account_0.key)

	# Send the transaction
	tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
	print(f"Transaction sent with hash: {tx_hash.hex()}")

	# Wait for the transaction receipt with a longer timeout
	try:
		receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
		print(f"Transaction mined in block {receipt['blockNumber']}")
	except Exception as e:
		print(f"Error waiting for transaction receipt: {str(e)}")
		raise

	# Check if the transaction was successful
	if receipt.status != 1:
		print("Transaction failed")
	# else:
		# Fetch the package name from the contract
		# try:
		# 	#package_name = package_contract.functions.packages(0).name.call()
		# 	#print(f"Package name: {package_name}")
		# except Exception as e:
		# 	#print(f"Error calling contract function: {str(e)}")
		# 	raise

	return f"<p>Hello, World. package name var: </p>"

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
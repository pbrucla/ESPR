from flask import Flask, request
from web3 import Web3


app = Flask(__name__)
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
print(w3.is_connected())

private_key = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
account_0 = w3.eth.account.from_key(private_key)
some_address = "0x0000000000000000000000000000000000000000"
init_bytecode= "6080604052348015600e575f80fd5b506101d98061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061004a575f3560e01c806306661abd1461004e578063371303c01461006c5780636d4ce63c14610076578063b3bcfa8214610094575b5f80fd5b61005661009e565b60405161006391906100f7565b60405180910390f35b6100746100a3565b005b61007e6100bd565b60405161008b91906100f7565b60405180910390f35b61009c6100c5565b005b5f5481565b60015f808282546100b4919061013d565b92505081905550565b5f8054905090565b60015f808282546100d69190610170565b92505081905550565b5f819050919050565b6100f1816100df565b82525050565b5f60208201905061010a5f8301846100e8565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610147826100df565b9150610152836100df565b925082820190508082111561016a57610169610110565b5b92915050565b5f61017a826100df565b9150610185836100df565b925082820390508181111561019d5761019c610110565b5b9291505056fea2646970667358221220148b13669b62948cb60a748f18e464be2b0ad0f3b2f94f2dc2dce661e9fe6cd064736f6c634300081a0033"
abi = [
	{
		"inputs": [],
		"name": "count",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dec",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "get",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "inc",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

Counter = w3.eth.contract(bytecode=init_bytecode, abi=abi)
tx_hash = Counter.constructor().transact({"from": account_0.address})
receipt = w3.eth.get_transaction_receipt(tx_hash)
deployed_addr = receipt["contractAddress"]

@app.route("/")
def hello_world():
  counter = w3.eth.contract(address=deployed_addr, abi=abi)
  unsent_billboard_tx = counter.functions.inc().build_transaction({
    "from": account_0.address,
    "nonce": w3.eth.get_transaction_count(account_0.address),
  })
  signed_tx = w3.eth.account.sign_transaction(unsent_billboard_tx, private_key=account_0.key)
  tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
  w3.eth.wait_for_transaction_receipt(tx_hash)
  counter_value = counter.functions.get().call()
  return f"<p>Hello, World. Counter var: {counter_value}</p>"

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
# ESPR: Ethereum-Sourced Package Registry
####  _by Joshua Zhu, Arnav Vora, Ryan Chang, Alexander Edwards, Eddie He, Andy Huang, Sanjay Krishna, Layah Vigneaud, Alan Wu, Kevin Zhao_
**A package manager based on the Ethereum blockchain to address software supply chain security concerns.**

Components of ESPR:
- Next.js-based frontend that employs ``web3.js`` to connect with the Ethereum blockchain
- Flask-based backend to handle uploading files to Pinata, an InterPlanetary File System (IPFS) solution for decentralized file storage
- Smart contracts written in Solidity that run on the Ethereum blockchain
## Setup

Setting up ESPR requires 3 major steps: running the blockchain with Anvil, running the backend, running the frontend. These steps should be done in order. Clone the repo with `git clone`, then
```sh
cd ESPR
```
Perform each section's setup (blockchain, backend, frontend) from this directory.
### Blockchain
1\. If not yet installed, install [Foundry](https://book.getfoundry.sh/getting-started/installation)

2\. Install the OpenZeppelin Dependency:
```sh
cd blockchain
forge install OpenZeppelin/openzeppelin-contracts
```
Please ensure that you have no changes pending on git prior to running ``forge install``; check this by running ``git status``.

3\. In a new shell, run Anvil:
```sh
anvil
```
If this command fails, check your ``$PATH`` environment variable to make sure it contains the path to your Foundry installation. Try ``source $HOME/.bashrc`` if it isn't present.


### Backend

1\. Install [Poetry](https://python-poetry.org/docs/#installing-with-the-official-installer)

Linux/MacOS:
```sh
curl -sSL https://install.python-poetry.org | python3 - 
```

Windows:
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```
2\. Install backend dependencies:
```sh
cd backend
poetry install
```

3\. Set up keys and IPFS
Pinata is the IPFS solution used for file storage in this project. A quickstart guide can be found at [Pinata Quickstart](https://docs.pinata.cloud/quickstart). A freemium account with up to 1 GB of storage is available for new users to Pinata. 

This project requires several keys/other information from Pinata and the currently running blockchain:

1. Generate a key with admin scope [here](https://app.pinata.cloud/developers/api-keys). Take note of the API key and API secret keys provided. 

2. Set up or retrieve the gateway domain [here](https://app.pinata.cloud/gateway). Take note of this url. 

3. Obtain a private key from the shell currently running Anvil (refer to [Blockchain](#blockchain))

4. Create a file named `.env` as following. It should contain the keys found from the previous steps.

```
PRIVATE_KEY="Anvil private key"

API_KEY="your generated Pinata API key here"
API_SECRET="your generated Pinata API secret key here"
PINATA_GATEWAY="Pinata gateway url"
```

4\. Run the backend:
```sh
poetry run flask run
```

### Frontend
1\. Install a recent version of [Node](https://nodejs.org/).

2\. Install pnpm:
```sh
corepack enable
```
As an alternative, you can install this way instead:
```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
source $HOME/.bashrc
```
3\. Install frontend dependencies:
```sh
cd frontend
pnpm i
```
4\. Run the frontend:
```sh
pnpm dev
```

## Acknowledgements
We thank [Benson Liu](https://github.com/bliutech) for the inspiration of this project, [Andrew Kuai](https://github.com/Arc-blroth) for lending his technical expertise in blockchain and application development, as well as the people of ACM Cyber at UCLA for their support.

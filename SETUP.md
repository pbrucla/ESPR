# Backend

1\. Install Poetry: <https://python-poetry.org/docs/#installing-with-the-official-installer>

Linux / MacOS:
```sh
curl -sSL https://install.python-poetry.org | python3 -
```

Windows:
```powershell
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

2\. Install the backend's dependencies:
```sh
cd backend
poetry install
```

3\. Tell VSCode where to look for Python libraries (for Intellisense):

Copy the output of:
```sh
poetry env info --path
```
then press `Ctrl+Shift+P` / `Shift+Cmd+P`, type `Python: Select Interpreter`, `Enter interpreter path...`, and paste in the path from above.

If the output of the above is empty, run
```sh
poetry env info
```
and check the version of your base Python. If your base Python version is too low, you may need to install a newer version of Python to get this to work.

4\. Run the backend with:
```sh
poetry run flask run
```

You should be all set!

# Frontend

1\. Install a recent version of Node from <https://nodejs.org/>.

2\. Install pnpm:

```sh
corepack enable
```

Alternatively, you can install pnpm with:

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.bashrc
```

3\. Install the frontend's dependencies:
```sh
cd frontend
pnpm install
```

5\. Run the frontend with:
```sh
pnpm dev
```

You should be all set!

# Blockchain

1\. If you haven't already, install Foundry: <https://book.getfoundry.sh/getting-started/installation>.

2\. Install the OpenZeppelin dependency:
```sh
cd blockchain
forge install OpenZeppelin/openzeppelin-contracts
```
Make sure you have no pending changes in git when you do this (you can check by running `git status`).

3\. In a new shell, run Anvil:

```sh
anvil
```

If the command won't run, check to make sure your path environment variable contains the path to wherever you installed Foundry.

4\. In a separate shell, deploy the smart contract:

```sh
cd blockchain
forge create src/packageContract.sol:PackageManager --interactive
```

When asked for a private key, copy and paste one from the shell running Anvil.

You should be all set!

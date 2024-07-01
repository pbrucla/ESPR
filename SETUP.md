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

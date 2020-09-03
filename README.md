<p align="center">
    <h1>URL-Shortie 🔗✨</h1>
    <h2>A simple URL Shortener made with Node JS and React</h2>
</p>

## Setting up

### Requirements

- [NodeJS v12+](https://nodejs.org)
- [MongoDB](https://www.mongodb.com/) for storing the links, users and expired tokens.

### Downloading/cloning the project

To clone this repository make sure you have `git` installed. Otherwise you can use wget.
<br />
Using `git`:

```bash
git clone https://github.com/TheChicken14/URL-Shortie.git
```

Using `wget`:

```bash
wget https://github.com/TheChicken14/URL-Shortie/archive/master.zip
```

### Installing

#### Linux/macOS/Bash

If you're on Linux, macOS or a bash shell, you can simply run the `install.sh` script.
This script will also configure it for you.

```bash
# Make it executable
$ chmod +x ./install.sh
$ ./install.sh
```

#### Windows

If you're on windows you can do it like so:

```bash
# NPM
npm run setup
# Yarn
yarn setup
```

##### UI

```bash
# NPM
npm run build
# Yarn
yarn build
```

##### Configuration

Rename `config.example.js` to `config.js`. Then paste your MongoDB URI into the `mongouri` value. Make sure it ends with the database name.
Here is en explanation of each key in the config:

```js
{
  "web": {
    "port": 8888 // Port for webserver
  },
  "db": {
    "mongouri": "" // MongoDB Database URI
  },
  "secret": "your-secret", // Secret for JWT Token (change to something random)
  "proxy": false,// Set to true if using URL-Shortie behind a reverse proxy
  "dev": false // Set to true if working with development env
}
```

## Updating

If you're on macOS or Linux, updating is really easy. Just run the `update.sh` script and it'll pull the new code and rebuild the UI.

## Usage

To start the server, run `npm start server`. Now open up a browser and visit the ip of the server followed by a `:` and the port of URL-Shortie that you set in the config.

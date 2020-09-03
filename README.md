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

### Building frontend (optional, but highly recommended)

Building the frontend is not required, but it is recommended, because it makes creating links a lot easier.
You can do this by running the following command:

```bash
npm run setup
```

Or if you want to use yarn:

```bash
yarn setup
```

If you decide not to, URL-Shortie will run in API only mode. You will however need to install the dependencies with the following command:

```bash
npm i
```

### Configuration

Rename `config.example.js` to `config.js`. Then paste your MongoDB URI into the `mongouri` value. Make sure it ends with the database name.

## Updating

If you're on macOS or Linux, updating is really easy. Just run the `install.sh` script and it'll pull the new code and rebuild the UI.

## Usage

To start the server, run `npm start server`. Now open up a browser and visit the ip of the server followed by a `:` and the port of URL-Shortie that you set in the config.

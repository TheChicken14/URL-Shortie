const inquirer = require("inquirer")

const fs = require("fs")

const doesConfigExist = () => fs.existsSync("./config.json")

const generatePassword = () => {
    var length = 20,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

inquirer
    .prompt([
        {
            name: "rewrite_config",
            type: "confirm",
            message: "The config file already exists. Do you want to overwrite it?",
            when: doesConfigExist
        },
        {
            name: "port",
            type: "number",
            message: "What port do you want URL-Shortie to listen on?",
            default: 8080
        },
        {
            name: "mongouri",
            type: "input",
            message: "What's the URI for your MongoDB database?",
            validate: (v) => {
                if (v.trim().length === 0) {
                    return "This is required."
                } else if (!v.startsWith("mongodb://")) {
                    return "This should be a MongoDB uri."
                } else {
                    return true
                }
            }
        },
        {
            name: "secret",
            type: "password",
            message: "What do you want to use as secret for the tokens? (leave empty for a generated one)",
            mask: true
        },
        {
            name: "proxy",
            type: "confirm",
            message: "Are you gonna use this behind a reverse proxy?"
        }
    ])
    .then((answer) => {
        let secret;
        if (answer.secret.trim().length < 1) {
            secret = generatePassword()
        } else {
            secret = answer.secret
        }
        fs.writeFileSync("./config.json", JSON.stringify({
            web: {
                port: answer.port
            },
            db: {
                mongouri: answer.mongouri
            },
            secret: secret,
            proxy: answer.proxy,
            dev: true
        }))
    });
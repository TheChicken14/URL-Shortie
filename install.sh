#!/bin/sh

YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Announce function for e.g.: announcing that git pull is running
function announce() {
    echo ""
    echo ${YELLOW} $1 ${NC}
    echo ""
}

# Check if yarn is installed and use yarn, otherwise use npm
if command -v yarn >/dev/null 2>&1; then
    pManager='yarn'
else
    pManager='npm'
fi

# Force the use of NPM when the first argument is 'npm'
if [ $1 ]; then
    if [ $1 == "npm" ]; then
        pManager='npm'
    fi
fi

announce "Installing URL-Shortie"

if ! command -v node >/dev/null 2>&1; then
    announce "Node JS Should be installed!"
    exit
fi

announce "Downloading dependencies..."

if [ $pManager == 'yarn' ]; then
    yarn install
else
    npm i
fi

announce "Configuring URL-Shortie"

node configure.js

cd client

announce "Installing UI Dependencies"

if [ $pManager == 'yarn' ]; then
    yarn
else
    npm install
fi

announce "Building UI..."

if [ $pManager == 'yarn' ]; then
    yarn build
else
    npm run install
fi

announce "Done installing and building UI"
if [ $pManager == 'yarn' ]; then
    announce "Start URL-Shortie with 'yarn server'"
else
    announce "Start URL-Shortie with 'npm run server'"
fi

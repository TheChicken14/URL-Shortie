#!/bin/sh

YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Announce function for e.g.: announcing that git pull is running
function announce() {
    echo ""
    echo ${YELLOW} $1 ${NC}
    echo ""
}

function isUpToDate() {
    localStatus=$(git log --pretty=%H ...refs/heads/master^)
    remoteStatus=$(git ls-remote origin -h refs/heads/master | cut -f1)
    if [ $localStatus == $remoteStatus ]; then
        return 0
    else
        return 1
    fi
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

if isUpToDate; then
    announce "Already up to date!"
    exit
fi

announce "Pulling new updates..."

git pull

announce "Downloading dependencies..."

if [ $pManager == 'yarn' ]; then
    yarn install
else
    npm i
fi

announce "Building UI..."

if [ $pManager == 'yarn' ]; then
    yarn build
else
    npm run install
fi

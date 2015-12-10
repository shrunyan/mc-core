#!/usr/bin/env bash

# Usage
# ./release.sh 1.0.0

# Exit if no argument (version) was passed
if [ "$#" -ne 1 ]; then
    echo "release requires 1 argument: version number (ex. 1.0.0)"
    exit 0
fi

# TODO: change package.json version or ensure that it is updated

# TODO: ensure our remote is the main repo

# TODO: exit if any uncommitted changes
# See git diff --exit-code --quiet;echo $?

# TODO: ensure we are on the develop branch
# See git rev-parse --abbrev-ref HEAD

# lock package versions
npm shrinkwrap

# Commit new shrinkwrap file
git add -A && git commit -m "Automatically updating shrinkwrap file"

# Checkout the stable branch
git checkout stable

# Merge in the latest from develop
git merge develop

# Push the changes
git push

# tag the version
git tag $1
git push --tags

# Publish the package
npm publish --tag $1
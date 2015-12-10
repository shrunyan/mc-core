#!/usr/bin/env bash

####################################################################################################
# Usage
####################################################################################################
#
#   Syntax
#   ./release.sh [new version]
#
#   Example
#   ./release 1.0.0
#
####################################################################################################
# Validate Environment, User, Git Repo condition before do any actual work
####################################################################################################

# Exit if no argument (version) was passed
if [ "$#" -ne 1 ]; then
    echo "release requires 1 argument: version number (ex. 1.0.0)"
    exit 0
fi

# TODO: Check that the npm user logged in
# See npm whoami;echo $?

# TODO: Check that the npm user is someone who is authorized to release
# See npm whoami

# TODO: change package.json version or ensure that it is updated
# ???

# TODO: ensure our remote is the main repo
# See git config --get remote.origin.url
# Should equal git@github.com:space-race/mc-core.git

# TODO: exit if any uncommitted changes
# See git diff --exit-code --quiet;echo $?

# TODO: ensure we are on the develop branch
# See git rev-parse --abbrev-ref HEAD


####################################################################################################
# Start Actual Work
####################################################################################################

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
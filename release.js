#!/usr/bin/env node
'use strict'

var execSync = require('child_process').execSync;

//###################################################################################################
// Usage
//###################################################################################################
//
//    Syntax
//    ./release.js [new version]
//    node release.js [new version]
//
//    Example
//    ./release 1.0.0
//
//###################################################################################################
// Validate Environment, User, Git Repo condition before do any actual work
//###################################################################################################


// Exit if no argument (version) was passed
if (process.argv.length !== 3) {
  console.log()
  process.exit(1)
}

let versionNumber = process.argv.length[2]

// TODO: consider validating the version number

// Check that the npm user logged in
try {
  let npmUser = execSync("npm whoami");
  let authenticatedUsers = ['andy', 'shrunyan']

  if (authenticatedUsers.indexOf(npmUser) === false) {
    console.log('You must be an authenticated user for the npm package to continue')
    process.exit(1)
  }

} catch (err) {
  console.log('You must be logged into npm')
  process.exit(1)
}

// TODO: change package.json version or ensure that it is updated
// ???

// TODO: ensure our remote is the main repo
// See git config --get remote.origin.url
// Should equal git@github.com:space-race/mc-core.git

// TODO: exit if any uncommitted changes
// See git diff --exit-code --quiet;echo $?

// TODO: ensure we are on the develop branch
// See git rev-parse --abbrev-ref HEAD


//###################################################################################################
// Start Actual Work
//###################################################################################################

// EXIT THE SCRIPT SINCE IT IS INCOMPLETE
console.log('Script implementation not finished. Exiting before any destructive changes.')
process.exit(1)

// lock package versions
//npm shrinkwrap

// Commit new shrinkwrap file
//git add -A && git commit -m "Automatically updating shrinkwrap file"

// Checkout the stable branch
//git checkout stable

// Merge in the latest from develop
//git merge develop

// Push the changes
//git push

// tag the version
//git tag $1
//git push --tags

// Publish the package
//npm publish --tag $1

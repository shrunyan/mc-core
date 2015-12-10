#!/usr/bin/env node
'use strict'

let execSync = require('child_process').execSync;
let fs = require('fs')
let colors = require('colors/safe')

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
  console.log('1 argument, "new version number" is required')
  process.exit(1)
}

let newVersion = process.argv[2]

console.log(colors.green('New version provided: '+ newVersion))

// TODO: consider validating the version number

// Check that the npm user logged in
try {
  let npmUser = execSync("npm whoami").toString().trim();
  let authenticatedUsers = ['andyfleming', 'shrunyan']

  if (authenticatedUsers.indexOf(npmUser) === -1) {
    console.log('You must be an authenticated user for the npm package to continue')
    process.exit(1)
  }

} catch (err) {
  console.log('You must be logged into npm')
  process.exit(1)
}

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

// change package.json version to the new one provided
let packageJson = require('./package.json')
packageJson.version = newVersion
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '  ')+"\n")

// EXIT THE SCRIPT SINCE IT IS INCOMPLETE
console.log(colors.red('Script implementation not finished. Exiting.'))
process.exit(1)

// lock package versions
execSync('npm shrinkwrap')

// Commit new shrinkwrap file
execSync('git add -A && git commit -m "Automatically updating shrinkwrap file"')

// Checkout the stable branch
execSync('git checkout stable')

// Merge in the latest from develop
execSync('git merge develop')

// Push the changes
execSync('git push')

// tag the version
execSync('git tag ' + newVersion)
execSync('git push --tags')

// Publish the package
execSync('npm publish --tag ' + newVersion)

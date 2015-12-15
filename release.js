#!/usr/bin/env node
'use strict'

//###################################################################################################
// About
//###################################################################################################
//
//    This script is for project admins to release a version to the main repo and to npm.
//
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

let execSync = require('child_process').execSync
let fs = require('fs')
let colors = require('colors/safe')

// Exit if no argument (version) was passed
if (process.argv.length !== 3) {
  console.log('1 argument, "new version number" is required')
  process.exit(1)
}

let newVersion = process.argv[2]

console.log(colors.green('New version provided: ' + newVersion))
console.log('\nPre-flighting release...')

// TODO: consider validating the version number

// Check that the npm user logged in
try {
  let npmUser = execSync('npm whoami').toString().trim()
  let authenticatedUsers = ['andyfleming', 'shrunyan']

  if (authenticatedUsers.indexOf(npmUser) === -1) {
    console.log(colors.red('You must be an authenticated user for the npm package to continue'))
    process.exit(1)
  }

  console.log(colors.green('✓ Logged into npm as ' + npmUser))

} catch (err) {
  console.log(colors.red('You must be logged into npm'))
  process.exit(1)
}

// Ensure our remote is the main repo
let gitRemoteUrl = execSync('git config --get remote.origin.url').toString().trim()

if (gitRemoteUrl !== 'git@github.com:space-race/mc-core.git') {
  console.log(colors.red('You should not be releasing from a fork.'))
  process.exit(1)
}

console.log(colors.green('✓ Remote origin URL is correct'))

// Exit if there are any uncommitted changes
try {
  execSync('git diff --exit-code --quiet')
  console.log(colors.green('✓ There are no uncommitted changes'))

} catch (err) {
  console.log(colors.red('You have uncommitted changes. Run git diff to view.'))
  process.exit(1)
}

// Ensure we are on the develop branch
let branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

if (branch !== 'develop') {
  console.log(colors.red('You should be on the "develop" branch.'))
  process.exit(1)
}

console.log(colors.green('✓ The "develop" branch is checked out'))

// TODO: Ensure the tag for this release hasn't already been tagged in the git repo

//###################################################################################################
// Start Actual Work
//###################################################################################################

console.log('\nRunning release steps...')

// change package.json version to the new one provided
let packageJson = require('./package.json')
packageJson.version = newVersion
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, '  ') + '\n')

console.log(colors.green('✓ Version set in package.json'))

// EXIT THE SCRIPT SINCE IT IS INCOMPLETE
console.log(colors.red('Script implementation not finished. Exiting.'))
process.exit(1)

// Commit the version change from package.json
execSync('git add -A && git commit -m "Updating package.json to new version"')

// Prune unused packages
execSync('npm prune')

// lock package versions
execSync('npm shrinkwrap')

// Commit new shrinkwrap file
execSync('git add -A && git commit -m "Automatically updating shrinkwrap file"')

// Checkout the stable branch
execSync('git checkout stable')

// Merge in the latest from develop
execSync('git merge --no-edit develop')

// Push the changes
execSync('git push')

// tag the version
execSync('git tag ' + newVersion)
execSync('git push --tags')

// Publish the package
execSync('npm publish')

// Check out develop branch again (to avoid accidently continuing work on stable)
execSync('git checkout develop')

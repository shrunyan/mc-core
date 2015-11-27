# Mission Control *(work in progress)*

[![Build Status](https://travis-ci.org/space-race/mission-control.svg)](https://travis-ci.org/space-race/mission-control)

Mission Control is a devops automation orchestration tool. It was built with the following common devops automation tasks in mind, but can be configured for just about anything.

## Requirements

* Node.js
    * v5.0+ recommended
* Redis Server
    * Redis version 2.6+ required
    * Can be installed on the same machine or a remote one
* MySQL Server
    * 5.6+ recommended
    * Can be installed on the same machine or a remote one

## Installation

Setup is easy.

1. Clone the repository

    ```
    git clone git@github.com:space-race/mission-control.git
    ```

2. Install the dependencies

    ```
    npm install
    ```

3. Run the setup assistant

    ```
    ./mc setup
    ```

## Deployment

To get the app started in a local development environment run these 2 commands.

    npm install
    npm start

## Development and Contributing

For development, we've built a script to run all the necessary watch and build scripts. Just run:

    npm run dev


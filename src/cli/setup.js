#!/usr/bin/env node
'use strict'

let fs = require('fs')
let colors = require('colors/safe')
let redis = require('redis')
let knex = require('knex')
let promptly = require('promptly')
let bcrypt = require('bcryptjs')

const ENV_FILE_PATH = '.env'
const MIGRATIONS_SOURCE_PATH = 'node_modules/mc-core/src/db/migrations'

module.exports = () => {

// Check .env file exits
    try {
        fs.accessSync(ENV_FILE_PATH)
    } catch (err) {
        console.log(colors.red('We could not load your .env file.'))
        console.log(colors.yellow('Check these requirements before proceeding.'))

        // .env instructions
        console.log(colors.white('1) .env file exists'))
        console.log(colors.grey('Use the .env.example file to get started.'))

        // Redis instructions
        console.log(colors.white('2) Redis is installed and running'))
        console.log(colors.grey('If running locally on OSX use brew to install and start Redis.'))

        // MySQL instructions
        console.log(colors.white('3) MySQL is installed and running'))
        console.log(colors.grey('If running locally on OSX use brew to install and start MySQL'))

        process.exit(1)
    }

    require('dotenv').load({
        path: ENV_FILE_PATH
    })


// Check options
    if (!process.env.DB_USER) {
        console.log(colors.yellow('Your .env file is missing the MySQL DB_USER'))
    }
    if (!process.env.DB_PASS) {
        console.log(colors.yellow('Your .env file is missing the MySQL DB_PASS'))
    }
    if (!process.env.DB_HOST) {
        console.log(colors.yellow('Your .env file is missing the MySQL DB_HOST'))
    }
    if (!process.env.DB_NAME) {
        console.log(colors.yellow('Your .env file is missing the MySQL DB_NAME'))
    }
    if (!process.env.REDIS_HOST) {
        console.log(colors.yellow('Your .env file is missing the Redis REDIS_HOST'))
    }
    if (!process.env.REDIS_PORT) {
        console.log(colors.yellow('Your .env file is missing the Redis REDIS_PORT'))
    }

    const redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)
    const mysql = knex({
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        }
    })

// Run Setup
    checkRedisConn()
        .then(checkMysqlConn)
        .then(checkMysqlUserTable)
        .then(createMysqlUserTable)
        .then(createMysqlUserRecord)
        .then(() => process.exit(0))

    function checkRedisConn() {
        return new Promise((resolve) => {
            redisClient
                .on('connect', () => {
                    console.log(colors.green('Redis: Connected'))
                    resolve()
                })
                .on('error', (err) => {
                    console.log(colors.red('Redis: Connection Error'), err)
                    process.exit(1)
                })
        })
    }

    function checkMysqlConn() {
        return new Promise((resolve) => {
            mysql
                .raw('select 1 as dbIsUp')
                .then(() => {
                    console.log(colors.green('MySQL: Connected'))
                    resolve()
                })
                .catch((err) => {
                    console.log(colors.red('MySQL', err))
                })
        })
    }

    function checkMysqlUserTable() {
        return new Promise((resolve) => {
            mysql
                .schema
                .hasTable('users')
                .then((exists) => {
                    if (!exists) {
                        console.log(colors.red('MySQL: Missing users table.'))
                    } else {
                        console.log(colors.green('MySQL: Users table exists.'))
                    }
                    resolve()
                })
        })
    }

    function createMysqlUserTable() {
        return new Promise((resolve) => {
            promptly.confirm('Run Mission Control MySQL Migrations? [y/n]', (err, value) => {
                if (err) {
                    console.log(err)
                }
                if (value) {
                    console.log(colors.gray('Running Migrations...'))
                    mysql
                        .migrate
                        .latest({
                            directory: MIGRATIONS_SOURCE_PATH
                        })
                        .then(() => {
                            console.log(colors.green('Migrations Completed'))
                            resolve()
                        })
                        .catch((err) => {
                            console.log(colors.red('migrations error: '), err)
                            process.exit(1)
                        })
                } else {
                    resolve()
                }
            })
        })
    }

    function enterEmail() {
        return new Promise((resolve) => {
            promptly.prompt('Enter your Misison Control email.', (err, email) => {
                if (err) {
                    console.log(err)
                }
                resolve({email})
            })
        })
    }

    function enterPassword(user) {
        return new Promise((resolve) => {
            promptly.prompt('Enter your Misison Control password.', (err, password) => {
                if (err) {
                    console.log(err)
                }
                user['password'] = bcrypt.hashSync(password, 10)
                resolve(user)
            })
        })
    }

    function enterFirstName(user) {
        return new Promise((resolve) => {
            promptly.prompt('Enter your First Name.', (err, first) => {
                if (err) {
                    console.log(err)
                }
                user['first_name'] = first
                resolve(user)
            })
        })
    }

    function enterLastName(user) {
        return new Promise((resolve) => {
            promptly.prompt('Enter your Last Name.', (err, last) => {
                if (err) {
                    console.log(err)
                }
                user['last_name'] = last
                resolve(user)
            })
        })
    }

// Setup new Mission Control User
    function createMysqlUserRecord() {
        return new Promise((resolve) => {
            promptly.confirm('Setup new user? [y/n]', (err, value) => {
                if (value) {

                    let promise = enterEmail()
                        .then(enterPassword)
                        .then(enterFirstName)
                        .then(enterLastName)

                    promise.then((user) => {
                        mysql('users')
                            .insert(user)
                            .then(() => {
                                resolve()
                            })
                            .catch((err) => {
                                console.log(colors.red('MySQL Error: '), err)
                            })
                    })
                } else {
                    process.exit(0)
                }
            })
        })
    }

}

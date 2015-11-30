import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import passport from 'passport'
import routes from './api/routes'
import dotenv from 'dotenv'
import container from './dependency-container/container'

// Load environment variables from .env file
dotenv.load()

let port = process.env.PORT || 3000
let host = process.env.HOST || 'localhost'
let app = express()

// app.use(morgan('dev'))
// app.use(cookieParser())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//   extended: true
// }))
// app.use(session({
//   resave: false,
//   secret: 'TEST'
// }))
// app.use(passport.initialize())
// app.use(passport.session())
//
// routes(app, passport)


app.all('*', (req, res) => res.send('Hello World'))

app.listen(port, () => {
  console.log('Mission Control listening at http://%s:%s', host, port)
})

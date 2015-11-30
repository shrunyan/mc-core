let express = require('express')
let authMiddleware = require('./middleware/auth')
let pipelinesController = require('./controllers/pipelines')
let userController = require('./controllers/user')


module.exports = function (app) {

  // Authentication middleware
  app.use('/api/*', authMiddleware)

  // User
  app.get('/api/user', userController.getUser)
  app.post('/api/user/login', userController.login)

  // Pipelines
  app.get('/api/pipelines', pipelinesController.getList)

  //app.get('/', (req, res) => {
  //  res.send({message: 'Welcome to the API!'})
  //})

  //app.use('*', function(req, res) {
  //  res.sendFile('index.html');
  //})

  // Static files
  app.use(express.static('./ui-build/'))

  // 404
  app.use(function(req, res, next){
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
      res.send('<h1>404 Not found</h1>')
      return
    }

    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' })
      return
    }

    // default to plain-text. send()
    res.type('txt').send('Not found')
  });

}

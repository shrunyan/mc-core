'use strict'

let app = require('./api/app')

let port = process.env.PORT || 3000
let host = process.env.HOST || 'localhost'

let server = app.listen(port, () => {

  console.log('Mission Control listening at http://%s:%s', host, port)
  console.log('app locals', app.locals.ext)

})

module.exports = server

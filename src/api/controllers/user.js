let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
let connection = require('../../db/connection')


module.exports = {

  getUser: function(req, res) {
    res.send({user_id: req.user.id})
  },

  login: function(req, res) {

    // validate request
    if (!req.body.email || !req.body.password) {
      res.status(400).send({message: 'Both "email" and "password" are required fields.'})
      return
    }

    // Look up user
    connection.table('users').first('id', 'email', 'password').where('email', req.body.email).then(function(user) {

      // Test hash. If successful, respond with JWT
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign({ user_id: user.id }, process.env.SECRET_KEY)
        res.cookie('mc_jwt' , token, {maxAge: 3*24*60*60*1000})
        res.send({message: 'Successfully logged in.'})
      } else {
        res.status(401).send({message: 'Incorrect email or password.'})
      }


    }).catch(function(error) {
      res.status(500).send({message: 'An error occurred.'})
    })


  },

  logout: function(req, res) {
    res.clearCookie('mc_jwt').send({message: 'Successfully logged out.'})
  }

}
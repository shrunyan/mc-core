let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken');


module.exports = {

  getUser: function(req, res) {
    var salt = bcrypt.genSaltSync(10)
    var result = bcrypt.hashSync("pass")
    res.send(result)
    return

    //var result = bcrypt.compareSync('baconn', '$2a$10$XBqixdbL/0PFTVyLl7SvlORc/o47ppSGYebTAVYFGifHPhTZrqsFC')
    //
    //if (result) {
    //  res.send('correct')
    //} else {
    //  res.send('wrong')
    //}

    res.send({user_id: req.user.id})

  },

  login: function(req, res) {

    // verify username and password

    // if successful, respond with JWT
    if (true) {
      let token = jwt.sign({ user_id: 1 }, process.env.SECRET_KEY)
      res.cookie('mc_jwt' , token, {maxAge: 3*24*60*60*1000})
      res.send({'message': 'Successfully logged in.'})
    } else {
      res.status(401).send({'message': 'Incorrect email or password.'})
    }

    // otherwise, respond with 401

  },

  logout: function(req, res) {
    res.clearCookie('mc_jwt').send({message: 'Successfully logged out.'})
  }

}
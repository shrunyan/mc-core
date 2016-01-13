'use strict'

let crypto = require('crypto')
let bodyParser = require('body-parser')

module.exports = bodyParser.json({
  verify: (req, res, buf, encoding) => {

    // sha1 content
    var hash = crypto.createHash('sha1');
    hash.update(buf);
    req.hasha = hash.digest('hex');
    console.log("hash", req.hasha);

    // get rawBody
    req.rawBody = buf.toString();
    console.log("rawBody", req.rawBody);

  }
})

var jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {

  verify_normal: (req, res, next) => {
    jwt.verify(req.headers.token, process.env.TOKEN_SECRET, (err, decoded) => {
      if(decoded) {
        console.log(`decoded data is: `, decoded);
        req.decoded = decoded;
        next();
      } else {
        res.send(err);
      }
    }) // end of jwt.verify
  }// end of verify normal

}

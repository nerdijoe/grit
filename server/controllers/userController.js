var User = require('../models/user');
var passwordHash = require('password-hash')
var jwt = require('jsonwebtoken');
require('dotenv').config();


exports.signup = (req, res, next) => {
  var newUser = User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: passwordHash.generate(req.body.password)
  })

  console.log(newUser);

  newUser.save( (err, user) => {
    if(err) res.send(err);

    res.send(user);
  })
}


exports.signin = (req, res, next) => {
  // authentication is handled by passport
  let user = req.user;
  console.log(user);

  // create token
  var token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      picture: user.picture,
      facebook_id: user.facebook_id,
      facebook_access_token: user.facebook_access_token
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '1h' }
  );
  res.send(token);
}

exports.get_users = (req, res, next) => {
  User.find( (err, users) => {
    res.send(users);
  })
}

var mongoose = require('mongoose');
var User = require('../models/user');
var Todo = require('../models/todo');
var passwordHash = require('password-hash')
var jwt = require('jsonwebtoken');
require('dotenv').config();


exports.signup = (req, res, next) => {

  // for now todo's name is the name as user's name
  var newTodo = Todo({ name: req.body.name })
  newTodo.save( (err, todo) => {
    if(err) res.send(err);

    var newUser = User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: passwordHash.generate(req.body.password),
      todo: todo._id
    })

    console.log(newUser);

    newUser.save( (err, user) => {
      if(err) res.send(err);

      res.send(user);
    })

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
  // User.find( (err, users) => {
  //   res.send(users);
  // })



  User
    .find()
    .populate('todo')
    .exec( (err, users) => {
      if(err) res.send(err)

      res.send(users);
    })
}

exports.get_user_todo = (req, res, next) => {
  // decode token
  jwt.verify(req.headers.token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (decoded) {
        console.log(`decoded data is: `, decoded);
        console.log(typeof decoded);
        console.log(decoded._id);
        console.log(typeof decoded._id)

        // var user_id = mongoose.Types.ObjectId(decoded._id);
        var user_id = decoded._id;
        console.log(typeof user_id)

        // User
        //   .findById(user_id)
        //   .populate('todo')
        //   .exec( (err, user) => {
        //     if(err) res.send(err);
        //     res.send(user);
        //   })

        User
          .findById(user_id)
          .populate( {
            path: 'todo',
            model: 'Todo',
            populate: {
              path: 'tasks',
              model: 'Task'
            }
          })
          .exec( (err, user) => {
            if(err) res.send(err);
            res.send(user);
          })

    } // end of if(decoded)
    else {
        res.send(err);
    }
  })

}

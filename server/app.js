var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
var passwordHash = require('password-hash');
var cors = require('cors')

var index = require('./routes/index');
var users = require('./routes/users');


var app = express();

//connect to mongoDB DB
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/grit'
mongoose.connect(mongoDB);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', index);
app.use('/users', users);

passport.use(new Strategy(
  function(username, password, next) {
    let User = require('./models/user')

    User.findOne( {username: username}, (err, user) => {
      if(err) next(err);
      console.log(user)
      if(passwordHash.verify(password, user.password)) {
        next(null, user)
      } else {
        next("User entered wrong username and password");
      }
    })
  }
));


app.listen(3000, function () {
  console.log('GRIT is listening on port 3000!')
})

module.exports = app;

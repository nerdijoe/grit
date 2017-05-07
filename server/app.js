var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var jwt = require('jsonwebtoken');

require('dotenv').config();

var User = require('./models/user');
var Todo = require('./models/todo');


var passwordHash = require('password-hash');
var cors = require('cors')

var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var todos = require('./routes/todos');


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

// passport.use(new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: 'http://localhost:3000/auth/facebook/callback'
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//     //   return cb(err, user);
//     // });
//     console.log("***********************");
//     console.log('accesstoken: ', accessToken)
//     return cb(null, profile);
//   }
// ));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECREET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, cb) {

    console.log('accesstoken: ', accessToken)
    console.log('profile', profile)

    User.findOne({facebook_id: profile.id}, (err, user) => {
      if(err) res.send(err);

      if (!user) {

        /*
        // to get email birthday, profile picture
https://graph.facebook.com/10108296765292663?fields=email,birthday,picture&access_token=token
        */
        var newTodo = Todo({ name: 'My List' })
        newTodo.save( (err, todo) => {

          var newUser = User({
            name: profile.displayName,
            username: 'ijo',
            email: 'ijo@haha.com',
            password: passwordHash.generate('haha'),
            todo: todo._id,
            facebook_id: profile.id,
            facebook_access_token: accessToken
          })

          newUser.save( (err, user) => {
            if(err) res.send(err);

            // token is created when user is signin normally
            // res.redirect('http://localhost:8080')
            console.log("*** created new user ***")
            console.log(user);
            return cb(null, user);
          })

        }) // end of newTodo.save

      }
      else {
        console.log("*** existing user ***")
        console.log(user);

        //need to update facebook token?

        return cb(null, user);
      }
    }) // end of User.findOne

    // return cb(null, profile);
  }));



passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});





var app = express();

//connect to mongoDB DB
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/grit'
mongoose.connect(mongoDB);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(cors())


app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/todos', todos);

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope : 'email,public_profile,user_birthday' }));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("here")
    console.log(req.user);

    var token = jwt.sign(
      {
        _id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        picture: req.user.picture,
        facebook_id: req.user.facebook_id,
        facebook_access_token: req.user.facebook_access_token
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.redirect(`http://localhost:5000/home.html?token=${token}`);
  });

// app.get('/auth/facebook/callback', (req, res) =>{
//   console.log("here");
// })


app.listen(3000, function () {
  console.log('GRIT is listening on port 3000!')
})

module.exports = app;

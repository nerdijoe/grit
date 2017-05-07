var express = require('express');
var router = express.Router();
const passport = require('passport');
var user_controller = require('../controllers/userController')

// list all users
router.get('/', user_controller.get_users );

router.post('/signup', user_controller.signup);
router.post('/signin', passport.authenticate('local', {session: false}), user_controller.signin);

router.get('/:id', user_controller.get_user);
module.exports = router;

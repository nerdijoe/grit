var express = require('express');
var router = express.Router();
var todo_controller = require('../controllers/todoController')
var helper = require('../helpers/jwt')
// list all users
router.get('/', todo_controller.get_todos );
router.post('/', todo_controller.create);

// router.post('/:id/addtask', todo_controller.add_task);

router.post('/addtask', helper.verify_normal, todo_controller.add_task_using_token);

module.exports = router;

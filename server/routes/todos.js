var express = require('express');
var router = express.Router();
var todo_controller = require('../controllers/todoController')

// list all users
router.get('/', todo_controller.get_todos );
router.post('/', todo_controller.create);

router.post('/:id/addtask', todo_controller.add_task);



module.exports = router;

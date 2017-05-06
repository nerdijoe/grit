var express = require('express');
var router = express.Router();
var task_controller = require('../controllers/taskController')

// list all users
router.get('/', task_controller.get_tasks );
router.post('/', task_controller.create);
router.put('/:id', task_controller.edit);
router.delete('/:id', task_controller.delete);



module.exports = router;

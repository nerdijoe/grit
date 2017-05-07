var mongoose = require('mongoose');
var User = require('../models/user');
var Todo = require('../models/todo');
var Task = require('../models/task');

exports.create = (req, res, next) => {
  var newTodo = Todo({
    name: req.body.name
  })

  newTodo.save( (err, todo) => {
    if(err) res.send(err);

    res.send(todo);
  })
}

exports.get_todos = (req, res, next) => {
  // Todo.find( (err, todos) => {
  //   if(err) res.send(err);
  //
  //   res.send(todos);
  // })

  Todo
    .find()
    .populate('tasks')
    .exec( (err, todos) => {
      if(err) res.send(err);

      res.send(todos);
    })

}


/* steps to add task to todo
  create task
  find todo
  add task to todo.tasks
  todo save
*/
exports.add_task = (req, res, next) => {
  // create task and then add to Todo
  var newTask = Task({ name: req.body.name });
  newTask.save( (err, task) => {
    if(err) res.send(err)

    // add to Todo
    // find the todo
    Todo.findById( req.params.id, (err, todo) => {
      if(err) res.send(err);

      // var task_id = mongoose.Types.ObjectId(task._id);
      // todo.tasks.push(task_id);
      todo.tasks.push(task.id);

      console.log('*** after insert tasks');
      console.log(todo);

      // don't forget to save to DB after adding task
      todo.save( (err, todo) => {
        if (err) res.send(err);

        res.send(`Task '${task.name}' with id='${task.id}' has been added to Todo ${todo.name}`);
      })
    } )
  })
}

exports.add_task_using_token = (req, res, next) => {
  // create task and then add to Todo

  console.log(req.decoded)
  var user_id = req.decoded._id
  console.log("******************")
  console.log(user_id);
  console.log("******************")

  // find user from decoded token data
  User.findById(user_id, (err, user) => {
    if(err) res.send(err);
    if(user) {

      var newTask = Task({ name: req.body.name });
      newTask.save( (err, task) => {
        if(err) res.send(err)

        // add to Todo
        // find the todo
        Todo.findById( user.todo, (err, todo) => {
          if(err) res.send(err);

          // var task_id = mongoose.Types.ObjectId(task._id);
          // todo.tasks.push(task_id);
          todo.tasks.push(task.id);

          console.log('*** after insert tasks');
          console.log(todo);

          // don't forget to save to DB after adding task
          todo.save( (err, todo) => {
            if (err) res.send(err);

            // res.send(`Task '${task.name}' with id='${task.id}' has been added to Todo ${todo.name}`);
            res.send(task)
          })
        } )
      })


    } // end if(user)
    else {
      res.send('User is not in the DB')
    }

  })


}

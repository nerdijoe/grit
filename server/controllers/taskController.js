var Task  = require('../models/task');

exports.create = (req, res, next) => {
  var newTask = Task({
    name: req.body.name
    // is_completed: false,
    // completed_at: Date.now,
    // updated_at: Date.now
  })

  newTask.save( (err, task) => {
    if(err) res.send(err);

    res.send(task);
  })
}

exports.get_tasks = (req, res, next) => {
  Task.find( (err, tasks) => {
    if(err) res.send(err);

    res.send(tasks);
  })
}

exports.edit = (req, res, next) => {
  Task.findById(req.params.id, (err, task) => {
    if(err) res.send(err);

    task.name = req.body.name || task.name;
    task.is_completed = req.body.is_completed || task.is_completed;

    //format date to ISO
    var d = new Date();
    var n = d.toISOString();
    task.updated_at = n;

    task.save( (err, task) => {
      if(err) res.send(err);
      res.send(task);
    })

  })
}

exports.delete = (req, res, next) => {
  Task.findByIdAndRemove( req.params.id, (err, task) => {
    if(err) res.send(err);

    console.log('*** deleted task:', task)
    if(task){

      var message = {
        message: `Task '${task.name}' has been deleted.`,
        id: task._id
      }

      res.send(message);
    } else {
      res.send('Invalid task id.')
    }
  })
}

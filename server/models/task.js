var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  name: String,
  is_completed: Boolean,
  created_at: Date,
  updated_at: Date,
  completed_at: Date,
  tags: [String]
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;

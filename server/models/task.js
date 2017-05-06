var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
  name: String,
  is_completed: { type: Boolean, required: false, default: false },
  completed_at: { type:Date, required: false, default: null },
  created_at: { type: Date, required: false, default: Date.now},
  updated_at: { type: Date, required: false, default: Date.now}

  // tags: [String]
});

var Task = mongoose.model('Task', taskSchema);

module.exports = Task;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  name: String,
  created_at: Date,
  updated_at: Date,
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}]
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

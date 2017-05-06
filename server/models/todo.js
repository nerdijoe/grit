var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  name: String,
  created_at: { type: Date, required: false, default: Date.now},
  updated_at: { type: Date, required: false, default: Date.now},
  tasks: [{type: Schema.Types.ObjectId, ref: 'Task', default: []}]
  // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

var Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;

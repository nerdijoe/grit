var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {type: String, required: true},
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  picture: {type: String, required: false},
  birthdate: {type: Date, required: false},
  facebook_id: {type: String, required: false},
  facebook_access_token: {type: String, required: false},
  todo: {type: Schema.Types.ObjectId, ref: 'Todo', default: null}
})

var User = mongoose.model('User', userSchema);

module.exports = User;

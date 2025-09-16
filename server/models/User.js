const {Schema, default: mongoose} = require('mongoose')

const userSchema = new Schema({
  linkedinId: { type: String, unique: true, sparse: true }, 
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: false }, 
})

const User = mongoose.model('User', userSchema);
module.exports =User;
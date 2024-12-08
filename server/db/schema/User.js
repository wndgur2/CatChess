const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  win: { type: Number, default: 0 },
  loss: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema)

module.exports = User

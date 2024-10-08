const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    match: [/^[^@]+@[^@]+\.[^@]+$/, 'Please fill a valid email address']
  },
  password: { 
    type: String, 
    required: true 
  },
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require("mongoose");

// const EMAIL_VALID = function validateEmail(email) {
//   const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(String(email).toLowerCase());
// };

const schema = new mongoose.Schema({
  users: [{
    type: String,
    required: true,
    ref: 'users'
  }],
  usersRead: [{
    userId: {
      type: String,
      required: true,      
    },
    read: {
      type: Boolean,
      required: true,
      default: false
    }
  }],
  createdAt: {
    type: String,
    required: true,
  },
  messages: [
    { 
      type: {
        type: String,
        required: true,
        enum: ['text', 'image'],
        default: 'text'
      },
      content: {
        type: String,
        required: true,
      },
      owner: {
        type: String,
        required: true,
      },
      createdAt: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = schema;
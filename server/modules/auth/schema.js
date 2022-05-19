const mongoose = require("mongoose");

const EMAIL_VALID = function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return EMAIL_VALID(value) || new Error("Email is not valid!");
      },
    },
  },
  password: {
    type: String,
    required: true,
  },
  info: {
    name: {
      type: String,
      required: true,
    },
    birthdate: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
      default: 'male'
    },
    interest: {
      type: String,
      required: true,
      enum: ["male", "female"],
      default: 'male'
    },
    desc: {
      type: String,
      required: false,
    }, 
    imgUrl: {
      type: String,
      required: false,
    }   
  },
  match: Array,
  likedBy: Array,
  like: Array,
  unlike: Array,
  // state: {
  //   type: String,
  //   required: true,
  //   enum: ["available", "disable"],
  // },
});

module.exports = schema;

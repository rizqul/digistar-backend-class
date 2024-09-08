const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = {
  userSchema,
};

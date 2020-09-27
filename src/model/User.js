const mongoose = require("mongoose");

// adicionado pelo prof
mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema(
  {
    role: String,
    name: String,
    avatar: String,
    username: String,
    password: String,
    email: String,
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

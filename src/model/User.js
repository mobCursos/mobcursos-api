const mongoose = require("mongoose");

// adicionado pelo prof
// mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema(
  {
    id: Number, // manual id - use _id
    profile: String,
    name: String,
    avatar: String,
    username: String,
    email: String,
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

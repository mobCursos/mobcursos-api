const mongoose = require("mongoose");

mongoose.Promise = global.Promise

const courseSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    teacher_id: String,
    students: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
  },
  {
    versionKey: false,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
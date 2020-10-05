const mongoose = require("mongoose");

mongoose.Promise = global.Promise

const curseSchema = new mongoose.Schema(
  {
    name: String,
    teacher_id: String,
    description: String,
    students_id: [],
  },
  {
    versionKey: false,
  }
);

const Course = mongoose.model("Course", curseSchema);

module.exports = Course;
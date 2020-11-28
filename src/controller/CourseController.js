const Course = require("../model/Course");
const User = require("../model/User");

// list all courses
exports.list = (req, res) => {
  const userRole = req.userRole;
  if (userRole == 'admin') {     
    Course.find().
    populate('students', ['name', 'username']).
    populate('teacher', ['name', 'username']).
    exec((err, courses) => {
      if (err) {
        res.status(500).send({ msg: err });
        return console.error(err);
      }
      res.json(courses);
    });

  // no admin or noauth user
  } else {
    Course.find().
    select(['name', 'description', 'teacher']).
    populate('teacher', ['name']).
    exec((err, courses) => {
      if (err) {
        res.status(500).send({ msg: err });
        return console.error(err);
      }
      res.json(courses);
    });
  }
};

// list all courses of the user (different responses by role student or teacher)
exports.listOwn = (req, res) => {
  const userRole = req.userRole;
  const userId = req.userId;
  if (userRole == 'teacher') {     
    Course.find({ teacher: userId}).
    populate('students', ['name', 'username']).
    populate('teacher', ['name', 'username']).
    exec((err, courses) => {
      if (err) {
        res.status(500).send({ msg: err });
        return console.error(err);
      }
      res.json(courses);
    });
  } else if (userRole == 'student') {     
    User.findOne({ _id: userId}).
    exec((err, user) => {
      if (err) {
        res.status(500).send({ msg: err });
        return console.error(err);
      }
      const coursesId = user.courses;
      Course.find({ _id: coursesId }).
      populate('teacher', 'name').
      select(['name','description']).
      exec((err, courses) => {
        if (err) {
          res.status(500).send({ msg: err });
          return console.error(err);
        }
        res.json(courses);
      });
    });
  } 
}; 

// get by _id
exports.get_by_id = (req, res) => {
  Course.findOne({ _id: req.params.id }).
  populate('students', ['name', 'username']).
  populate('teacher', ['name', 'username']).
  exec((err, course) => {
    if (course) {
      res.json(course);
    } else {
      res.sendStatus(404);
    }
  });
};

// add
exports.add = (req, res) => {
  const teacherId = req.userId;
  req.body.teacher = teacherId;
  const newCourse = new Course(req.body);
  newCourse.save((err, course) => {
    if (err) {
      res.status(500).send({ msg: err })
    } else {
      res.status(201).json(course)
    }
  })
};

//alter
exports.alter = (req, res) => {
  let id = req.params.id;
  let courseAlter = req.body;
  Course.findOneAndUpdate(
    { _id: id },
    courseAlter,
    { new: true },
    (err, courseActual) => {
      if (err) {
        res.sendStatus(400);
        console.error(err);
      } else if (courseActual === null) {
        res.sendStatus(404);
      } else
      res.json(courseActual);
    }
  );
};

exports.remove = (req, res) => {
  const id = req.params.id;
  Course.findOneAndDelete({ _id: id }, (err, course) => {
    // TODO: handle err
    if (err) {
      res.sendStatus(400);
      console.error(err);
    } else if (course === null) {
      res.sendStatus(404);
    } else {
      res.json(course);
    }
  });
};

// todo: utilizar dados db e pesquisar pelo db
exports.subscribe = async function(req, res) {
  // todo: error handling if values do not exist
  const studentId = req.userId
  const courseId = req.body.courseId

  try {
    const existsCourse =  await existsCourseId(courseId);
    if (existsCourse) {
      // (fazer em etapa anterior, no crud cursos)
      // pesquisar cursos (somente cursos em que student não está matriculado)
  
      let subscribed = await isStudentSubscribed(courseId, studentId)
  
      if ( subscribed ) {
        return res.status(500).send({ msg: 'Student already subscribed on this course.'})
      }
      // tratar possivel erro em uma das operacoes ou ambas
      const updateStudentId = { $push: { students: studentId }};
      Course.findByIdAndUpdate( 
        courseId,
        updateStudentId,
        { new: true },
        (err, courseActual) => {
          if (err) {
            return res.status(500).send({ msg: err })
          } else {
            res.json(courseActual)
          }
      });
      const updateCourseId = { $push: { courses: courseId }};
      User.findByIdAndUpdate( 
        studentId,
        updateCourseId,
        { new: true },
        (err, userActual) => {
          if (err) {
            // deve desfazer a operação anterior (usar transaction?)
            return res.status(500).send({ msg: err })
          // } else {
          //  res.json(userActual)
          }
      });
    } else {
      res.status(404).send({ msg: "Course does not exist."})
    }
  } catch(error){
    res.status(404).send({ msg: "Incorrect course id." })
  }
};

// todo: utilizar dados db e pesquisar pelo db
exports.unsubscribe = async function(req, res) {
  // todo: error handling if values do not exist
  const studentId = req.userId
  const courseId = req.body.courseId

  try {
    const existsCourse =  await existsCourseId(courseId);
    if (existsCourse) {
      // (fazer em etapa anterior, no crud cursos)
      // pesquisar cursos (somente cursos em que student não está matriculado)

      let subscribed = await isStudentSubscribed(courseId, studentId)

      if ( !subscribed ) {
        return res.status(500).send({ msg: 'Student not subscribed on this course.'})
      }
      // tratar possivel erro em uma das operacoes ou ambas
      const updateStudentId = { $pull: { students: studentId }};
      Course.findByIdAndUpdate( 
        courseId,
        updateStudentId,
        { new: true },
        (err, courseActual) => {
          if (err) {
            return res.status(500).send({ msg: err })
          } else {
            res.json(courseActual)
          }
      });
      const updateCourseId = { $pull: { courses: courseId }};
      User.findByIdAndUpdate( 
        studentId,
        updateCourseId,
        { new: true },
        (err, userActual) => {
          if (err) {
            // deve desfazer a operação anterior (usar transaction?)
            return res.status(500).send({ msg: err })
          // } else {
          //   res.json(userActual)
          }
      });
    } else {
      res.status(404).send({ msg: "Course does not exist."})
    }
  } catch(error){
    res.status(404).send({ msg: "Incorrect course id." })
  }
};

async function isStudentSubscribed( courseId, studentId ) {
  const course = await Course.findById( courseId, (err, course) => {
    if (err) {
      throw new Exception(err)
    } else {
      return course
    }
  });
  // console.log(course)
  let subscribed = new Promise(

    function(resolve, reject) {
      let value = false
      let i = 0
      let studentsIdArray = course.students
      while ( !value && i < studentsIdArray.length ) {
        if ( studentsIdArray[i] == studentId ) {
          value = true
          //resolve(value)
        }
        i++
      }
      resolve(value)
    } 
  )
  return subscribed
};

// search (filter)
exports.search = (req, res) => {
  if(req.query) {
    const name = req.query.name
    const description = req.query.description

    Course.find({$or: [
                        {name:        { $regex: new RegExp(name, "ig") }}, 
                        {description: { $regex: new RegExp(description, "ig") }}
                      ]
                })
              .populate('students', ['name', 'username'])
              .populate('teacher', ['name', 'username'])
              .exec((err, courses) => {
                if (err) {
                  res.status(500).send({ msg: err });
                  return console.error(err);
                }
                if (courses) {
                  res.json(courses);
                } else {
                  res.status(404).send({ msg: "Courses not found." });
                }
              });
    }
};

async function existsCourseId(id) {
  let exists = false
  await Course.findOne({_id: id}, (err, course) => {
    //if (err) throw new Error('Error searching course.')
    if (course) exists = true 
  });
  return exists
};

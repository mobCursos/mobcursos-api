const Course = require("../model/Course");

// console.log(Course)

exports.list = (req, res) => {
  Course.find((err, courses) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(courses)
    }
  })
};

exports.add = (req, res) => {
  const teacherId = req.userId;
  req.body.teacher_id = teacherId;
  const newCourse = new Course(req.body);
  newCourse.save((err, course) => {
    if (err) {
      res.status(500).send(err)
    } else {
      res.send(course)
    }
  })
};

// todo: utilizar dados db e pesquisar pelo db
exports.subscribe = async function(req, res) {
  const studentId = req.userId
  const courseId = req.body.courseId

  // (fazer em etapa anterior, no crud cursos)
  // pesquisar cursos (somente cursos em que aluno não está matriculado)

  let subscribed = await isStudentSubscribed(courseId, studentId)

  if ( subscribed ) {
    return res.status(500).send('Student already subscribed on this course.')
  }
  const update = { $push: { students_id: studentId }};
  Course.findByIdAndUpdate( 
    courseId,
    update,
    { new: true },
    (err, courseActual) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(courseActual)
      }
  });
};

// todo: utilizar dados db e pesquisar pelo db
exports.unsubscribe = async function(req, res) {
  const studentId = req.userId
  const courseId = req.body.courseId

  // (fazer em etapa anterior, no crud cursos)
  // pesquisar cursos (somente cursos em que aluno não está matriculado)

  let subscribed = await isStudentSubscribed(courseId, studentId)

  if ( !subscribed ) {
    return res.status(500).send('Student not subscribed on this course.')
  }
  const update = { $pull: { students_id: studentId }};
  Course.findByIdAndUpdate( 
    courseId,
    update,
    { new: true },
    (err, courseActual) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.json(courseActual)
      }
  });
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
      let studentsIdArray = course.students_id
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
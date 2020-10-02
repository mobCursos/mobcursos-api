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
exports.subscribe = (req, res) => {
  // user id
  const studentId = req.userId
  const courseId = req.body.courseId

  // (fazer em etapa anterior, no crud cursos)
  // pesquisar cursos (somente cursos em que aluno não está matriculado)
  // curso escolhido
  Course.findById( courseId, (err, course) => {
    if (err) {
      return res.status(500).send(err)
    } else {
      // console.log(course)
      subscribed = false
      course.students_id.forEach( id => { // verifica todo o valor 
        if ( id == studentId ) {
          subscribed = true
        } 
      });
      if ( subscribed ) {
        res.status(500).send('Student already subscribed on this course.')
      } else {
        course.students_id.push(studentId)
        Course.findByIdAndUpdate( 
          courseId,
          course,
          { new: true },
          (err, courseActual) => {
            if (err) {
              res.status(500).send(err)
            } else {
              res.json(courseActual)
            }
        });
      }    
    }
  });
};

// todo: utilizar dados db e pesquisar pelo 

exports.unsubscribe = (req, res) => {
  // user id
  const studentId = req.userId
  const courseId = req.body.courseId

  // (fazer em etapa anterior, no crud cursos)
  // pesquisar cursos (somente cursos em que aluno não está matriculado)
  // curso escolhido
  Course.findById( courseId, (err, course) => {
    if (err) {
      return res.status(500).send(err)
    } else {
      // console.log(course)
      let subscribed = false
      let index = 0
      let studentIndex = index;
      course.students_id.forEach( id => { // verifica todo o valor 
        if ( id == studentId ) {
          subscribed = true;
          studentIndex = index;
        }
        index++;
      });
      if ( !subscribed ) {
        res.status(500).send('Student not subscribed on this course.')
      } else {
        course.students_id.splice(studentIndex,1);
        Course.findByIdAndUpdate( 
          courseId,
          course,
          { new: true },
          (err, courseActual) => {
            if (err) {
              res.status(500).send(err)
            } else {
              res.json(courseActual)
            }
        });
      }    
    }
  });
};
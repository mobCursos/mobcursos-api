const Course = require("../model/Course");

// console.log(Course)

// todo: utilizar dados do db
exports.enroll = (req, res) => {
  // user id
  let studentId = req.userId

  // (fazer em etapa anterior, no crud cursos)
  // pesquisar cursos (somente cursos em que aluno não está matriculado)
  // curso escolhido
  chosenCourse = Course[0]
  console.log(chosenCourse)
  enrolled = false
  chosenCourse.students_id.forEach( id => { // verifica todo o valor 
    if ( id == studentId ) {
      enrolled = true
    } 
  });
  if ( enrolled ) {
    res.status(500).send('Student already enrolled on this course.')
  } else {
    chosenCourse.students_id.push(studentId)
    console.log(chosenCourse)
    res.send('Student successfully enrolled.')
  }
};
exports.list = (req, res) => {
  Course.find((err, courses) => {
    if (err) {
      res.status(500).send({ msg: err });
      return console.error(err);
    }
    res.json(courses);
  });
};

// get by _id
exports.get_by_id = (req, res) => {
  Course.findOne({ _id: req.params.id }, (err, course) => {
    if (course) {
      res.json(course);
    } else {
      res.sendStatus(404);
    }
  });
};

// add
// todo: admin privilege
exports.add = (req, res) => {
  const newCourse = new Course(req.body);
  newCourse.save((err, course) => {
    if (err) return console.error(err);
    res.status(201).json(course);
  });
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
        res.send(err);
      }
      res.json(courseActual);
    }
  );
};

exports.remove = (req, res) => {
  const id = req.params.id;
  Course.findOneAndDelete({ _id: id }, (err, course) => {
    // TODO: handle err
    if (err) {
      console.log(err);
    } else if (course === null) {
      res.sendStatus(404);
    } else {
      res.json(course);
    }
  });
};
const Coursetemp = require("../model/Coursetemp");

// console.log(Coursetemp)

// todo: utilizar dados do db
exports.enroll = (req, res) => {
  // user id
  let studentId = req.userId

  // (fazer em etapa anterior, no crud cursos)
  // pesquisar cursos (somente cursos em que aluno não está matriculado)
  // curso escolhido
  chosenCourse = Coursetemp[0]
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
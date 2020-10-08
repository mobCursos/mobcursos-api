const User = require("../model/User");

// TODO: search (see -> https://github.com/profries/pi4_2020_2_crud_produtos/blob/master/controller/produto_controller.js)

// list all
exports.list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      res.status(500).send({ msg: err });
      return console.error(err);
    }
    res.json(users);
  });
};

// get by _id
exports.get_by_id = (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  });
};

// add
// todo: admin privilege
exports.add = (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err, user) => {
    if (err) return console.error(err);
    res.status(201).json(user);
  });
};

//alter
exports.alter = (req, res) => {
  let id = req.params.id;
  let userAlter = req.body;
  // "aluno" and "prof" roles can only alter their own users
  if ( req.userRole != "admin" && req.userId != id) {
    res.sendStatus(401)
  } else {
    User.findOneAndUpdate(
      { _id: id },
      userAlter,
      { new: true },
      (err, userActual) => {
        if (err) {
          res.send(err);
        }
        res.json(userActual);
      }
    );
  }
};

exports.remove = (req, res) => {
  const id = req.params.id;
  User.findOneAndDelete({ _id: id }, (err, user) => {
    // TODO: handle err
    if (err) {
      console.log(err);
    } else if (user === null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  });
};

// search (filter)
exports.search = (req, res) => {
  if(req.query) {
    const role = req.query.role
    const name = req.query.name
    const username = req.query.username
    const email = req.query.email

    User.find({ role: role,
                name:     { $regex: new RegExp(name, "ig") }, 
                username: { $regex: new RegExp(username, "ig") }, 
                email:    { $regex: new RegExp(email, "ig") } 
  
              }, (err, user) => {
                if (err) {
                  res.status(500).send({ msg: err });
                  return console.error(err);
                }
                if (user) {
                  res.json(user);
                } else {
                  res.status(404).send({ msg: "User not found" });
                }
              });
    }
};

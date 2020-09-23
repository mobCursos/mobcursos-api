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
      res.sendStatus(404);
    }
  });
};

// add
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

exports.login = (req, res, next) => {
  // test this on database
  if(req.boudy.username == 'admin' && req.body.password == 'admin') {
    // auth ok
    const id = 1 // must come from database
    var token = jwt.sign({id}, process.env.SECRET, {
      expiresIn: 300 // 5 min
    });
    return res.jason({ auth: true, token: token});
  }
  res.status(500).json({ message: "Login Inválido!"});
};

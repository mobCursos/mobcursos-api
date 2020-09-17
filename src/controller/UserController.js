const User = require("../model/User");

// TODO: search (see -> https://github.com/profries/pi4_2020_2_crud_produtos/blob/master/controller/produto_controller.js)
// TODO: use real _id, not manual id (manual id is used to simplify testes)

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

// get by id (manual id)
exports.get_by_id = (req, res) => {
  User.findOne({ id: req.params.id }, (err, user) => {
    if (user) {
      res.json(user);
    } else {
      res.sendStatus(404);
    }
  });
};

// add (manual id)
exports.add = (req, res) => {
  const newUser = new User(req.body);

  newUser.save((err, user) => {
    if (err) return console.error(err);
    res.status(201).json(user);
  });
};

//alter (manual id)
exports.alter = (req, res) => {
  let id = req.params.id;
  let userAlter = req.body;
  User.findOneAndUpdate(
    { id: id },
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
  const id_ = req.params.id; // not mondoDB _id
  User.findOneAndDelete({ id: id_ }, (err, user) => {
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

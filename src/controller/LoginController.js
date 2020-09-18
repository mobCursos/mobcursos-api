const User = require("../model/User");
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
  // test this on database
  if(req.body.username == 'admin' && req.body.password == 'admin') {
    // auth ok
    const id = 1 // must come from database
    var token = jwt.sign({id}, process.env.SECRET, {
      expiresIn: 3600 // 60 min
    });
    return res.json({ auth: true, token: token});
  }
  res.status(500).json({ message: "Login Inválido!"});
};

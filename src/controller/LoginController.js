const User = require("../model/User");
const UserController = require("../controller/UserController");
const jwt = require('jsonwebtoken');

async function existUserAndPassword(req) {
  const attemptUsername = req.body.username;
  const attemptPassword = req.body.password;
  let exists = false
  await User.findOne({username: attemptUsername}, (err, user) => {
    if (err) throw new Error('Erro ao buscar usuário')
    if (user && user.password == attemptPassword) exists = true 
  });
  return exists
}

async function getUserId(username) {
  let userId = false
  await User.findOne({ username: username}, (err, user) => {
    if (err) throw new Error("Erro ao buscar id do usuário")
    if (user) userId = user._id
  });
  return userId
}

exports.login = async (req, res, next) => {
  if(await existUserAndPassword(req)) {
    console.log("Login Authentication OK")
    const id = await getUserId(req.body.username) // must come from database
    var token = jwt.sign({id}, process.env.SECRET, {
      expiresIn: 3600 // 60 min
    });
    return res.json({ auth: true, token: token});
  }
  console.log("Login Authentication FAIL")
  res.status(500).json({ message: "Login Inválido!"});
};

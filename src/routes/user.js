// utilizando classe express.Router()
let express = require("express");
let router = express.Router();
const controller = require("../controller/UserController");
// let { verifyJWT }= require("../controller/AuthController")

// router.use(verifyJWT)

router.get("/", controller.list);
// use /search before /:id
router.get("/search", controller.search);
router.get("/:id", controller.get_by_id);
router.post("/", controller.add);
router.put("/:id", controller.alter);
router.delete("/:id", controller.remove);

module.exports = router;

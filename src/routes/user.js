// utilizando classe express.Router()
let express = require("express");
let router = express.Router();
const controller = require("../controller/UserController");
// let { verifyJWT }= require("../controller/AuthController")

// router.use(verifyJWT)

router.get("/", controller.list);
router.get("/:id", controller.get_by_id);
// router.get('/search', controller.get_by_name)
router.post("/", controller.add);
router.put("/:id", controller.alter);
router.delete("/:id", controller.remove);

module.exports = router;

let express = require("express");
let router = express.Router();
const controller = require("../controller/CourseController");
const { authRole } = require("../controller/AuthController");

// todo: define roles
router.get("/", controller.list);
router.get('/search', controller.procurar);
router.get("/:id", controller.get_by_id);

router.post("/subscribe", authRole(['aluno']), controller.subscribe);
router.post("/unsubscribe", authRole(['aluno']), controller.unsubscribe);

router.post("/", authRole(['prof']), controller.add);

router.put("/:id", controller.alter);
router.delete("/:id", controller.remove);

module.exports = router;
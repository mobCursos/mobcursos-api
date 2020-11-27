let express = require("express");
let router = express.Router();
const controller = require("../controller/CourseController");
const { authRole } = require("../controller/AuthController");

// todo: define roles
router.get("/", controller.list);
router.get("/own", authRole(['teacher','student']), controller.listOwn);
router.get("/search", controller.search);
router.get("/:id", controller.get_by_id);

router.post("/subscribe", authRole(['student']), controller.subscribe);
router.post("/unsubscribe", authRole(['student']), controller.unsubscribe);

router.post("/", authRole(['teacher']), controller.add);

router.put("/:id", controller.alter);
router.delete("/:id", controller.remove);

module.exports = router;
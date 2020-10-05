let express = require("express");
let router = express.Router();
const controller = require("../controller/CourseController");
const { authRole } = require("../controller/AuthController");

router.get('/search', controller.procurar);
router.post("/criar", authRole(['admin','prof']), controller.add);
router.get("/:listar", controller.list);
router.get("/:id", controller.get_by_id);
router.put("/:id", controller.alter);
router.delete("/:id", controller.remove);


module.exports = router;
const Router = require("express");
const { getUsers } = require("../controllers/UserController.js");

const router = new Router();

router.post("/registration");
router.post("/login");
router.post("/logout");
router.get("activate/:link");
router.get("/refresh");
router.get("/users", getUsers);

module.exports = router;

const Router = require("express");
const {
  getUsers,
  registraition,
  login,
  logout,
  activate,
  refresh,
} = require("../controllers/UserController.js");

const router = new Router();

router.post("/registration", registraition);
router.post("/login", login);
router.post("/logout", logout);
router.get("/activate/:link", activate);
router.get("/refresh", refresh);
router.get("/users", getUsers);

module.exports = router;

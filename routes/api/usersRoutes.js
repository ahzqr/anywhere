const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/usersController");
const ensureLoggedIn = require("../../config/ensureLoggedIn");

// POST /api/users
router.post("/", usersCtrl.create);
router.post("/login", usersCtrl.login);
router.get("/check-token", [ensureLoggedIn], usersCtrl.checkToken);
router.post("/:userId/follow", usersCtrl.createFollow);
router.delete("/:userId/unfollow", usersCtrl.deleteFollow)

module.exports = router;

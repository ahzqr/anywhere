const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/usersController");
const ensureLoggedIn = require("../../config/ensureLoggedIn");

// POST /api/users
router.post("/", usersCtrl.create);
router.post("/login", usersCtrl.login);
router.get("/check-token", [ensureLoggedIn], usersCtrl.checkToken);
router.get("/:userId/following", [ensureLoggedIn], usersCtrl.getFollowingStatus);
router.post("/:userId/follow", [ensureLoggedIn], usersCtrl.createFollow);
router.delete("/:userId/unfollow", [ensureLoggedIn], usersCtrl.deleteFollow);
router.get("/:userId", usersCtrl.getProfile);
router.get("/:userId/saved", usersCtrl.getSavedContent);
router.get("/search/username/:query", usersCtrl.getSearchResults);

module.exports = router;

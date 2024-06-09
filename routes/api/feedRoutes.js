const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/usersController");

router.get("/:userId", async (req, res) => {
    await usersCtrl.getFeedById(req, res);
});

module.exports = router;

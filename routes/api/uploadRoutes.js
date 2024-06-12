const express = require("express");
const router = express.Router();
const uploadCtrl = require("../../controllers/api/uploadController");

router.post("/", uploadCtrl.uploadImages);

module.exports = router;
const express = require("express");
const router = express.Router();
const searchCtrl = require("../../controllers/api/searchController");

router.get("/", searchCtrl.getSearchResults)

module.exports = router;
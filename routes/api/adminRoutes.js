const express = require("express");
const router = express.Router();
const adminCtrl = require("../../controllers/api/adminController");
const ensureLoggedIn = require("../../config/ensureLoggedIn");
const ensureAdmin = require("../../config/ensureAdmin");

// POST /api/users
router.get("/data", ensureLoggedIn, ensureAdmin, adminCtrl.getCounts);
router.get("/users", ensureLoggedIn, ensureAdmin, adminCtrl.getAllUsers);
router.get("/posts", ensureLoggedIn, ensureAdmin, adminCtrl.getAllPosts);
router.get("/itineraries", ensureLoggedIn, ensureAdmin, adminCtrl.getAllItineraries);
router.delete("/users/:id", ensureLoggedIn, ensureAdmin, adminCtrl.deleteUser);
router.delete("/posts/:id", ensureLoggedIn, ensureAdmin, adminCtrl.deletePost);
router.delete("/itineraries/:id", ensureLoggedIn, adminCtrl.deleteItinerary);


module.exports = router;

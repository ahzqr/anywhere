const express = require("express");
const router = express.Router();
const postsCtrl = require("../../controllers/api/postsController");

// POST /api/content
router.get("/posts/:postId", postsCtrl.getPostById);
router.post("/posts/:userId", postsCtrl.createPost);
router.delete("/posts/:postId/:userId", postsCtrl.deletePost);
router.put("/posts/:postId/:userId", postsCtrl.updatePost);
router.post("/posts/:postId/like/:userId", postsCtrl.likePost);
router.get("/posts/:postId/like/:userId", postsCtrl.getPostLikes);
router.delete("/posts/:postId/unlike/:userId", postsCtrl.unlikePost);
router.post("/posts/:postId/save/:userId", postsCtrl.savePost);
router.delete("/posts/:postId/unsave/:userId", postsCtrl.unsavePost);
router.post("/posts/:postId/comments/:userId", postsCtrl.createCommentPost);
router.delete("/posts/:postId/comments/:commentId/:userId", postsCtrl.deleteCommentPost);
router.get("/itineraries/:itineraryId", postsCtrl.getItineraryById);
router.post("/itineraries", postsCtrl.createItinerary);
router.delete("/itineraries/:itineraryId/:userId", postsCtrl.deleteItinerary);
router.put("/itineraries/:itineraryId/:userId", postsCtrl.updateItinerary);
router.get("/itineraries/:itineraryId/like/:userId", postsCtrl.getItinerarylikes);
router.post("/itineraries/:itineraryId/like/:userId", postsCtrl.likeItinerary);
router.delete("/itineraries/:itineraryId/unlike/:userId", postsCtrl.unlikeItinerary);
router.post("/itineraries/:itineraryId/save/:userId", postsCtrl.saveItinerary);
router.delete("/itineraries/:itineraryId/unsave/:userId", postsCtrl.unsaveItinerary);
router.post("/itineraries/:itineraryId/comments/:userId", postsCtrl.createCommentItinerary);
router.delete("/itineraries/:itineraryId/comments/:commentId/:userId", postsCtrl.deleteCommentItinerary);


module.exports = router;

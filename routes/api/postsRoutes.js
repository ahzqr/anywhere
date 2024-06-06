const express = require("express");
const router = express.Router();
const postsCtrl = require("../../controllers/api/postsController");

// POST /api/users
router.post("/posts", postsCtrl.createPost);
router.delete("/posts/:postId", postsCtrl.deletePost);
router.put("/posts/:postId", postsCtrl.updatePost);
router.post("/posts/:postId/like", postsCtrl.likePost);
router.delete("/posts/:postId/unlike", postsCtrl.unlikePost);
router.post("/posts/:postId/save", postsCtrl.savePost);
router.delete("/posts/:postId/unsave", postsCtrl.unsavePost);
router.post("/posts/:postId/comments", postsCtrl.createCommentPost);
router.delete("/posts/:postId/comments/:commentId", postsCtrl.deleteCommentPost);
router.post("/itineraries", postsCtrl.createItinerary);
router.delete("/itineraries/:itineraryId", postsCtrl.deleteItinerary);
router.put("/itineraries/:itineraryId", postsCtrl.updateItinerary);
router.post("/itineraries/:itineraryId/like", postsCtrl.likeItinerary);
router.delete("/itineraries/:itineraryId/unlike", postsCtrl.unlikeItinerary);
router.post("/itineraries/:itineraryId/save", postsCtrl.saveItinerary);
router.delete("/itineraries/:itineraryId/unsave", postsCtrl.unsaveItinerary);
router.post("/itineraries/:itineraryId/comments", postsCtrl.createCommentItinerary);
router.delete("/itineraries/:itineraryId/comments/:commentId", postsCtrl.deleteCommentItinerary);


module.exports = router;

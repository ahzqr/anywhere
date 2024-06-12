const debug = require("debug")("mern:controllers:api:postsController");
// const bcrypt = require("bcrypt");
const User = require("../../models/user");
const Post = require("../../models/post");
const Itinerary = require("../../models/itinerary");
const Comment = require("../../models/comment");

const createPost = async (req, res) => {
  const { userId } = req.params;
  debug("body: %o", req.body);
  const { images, caption, location, travelDates, experienceType, tips } = req.body;

  try {
    const newPost = new Post({
      user: userId,
      images,
      caption,
      location,
      travelDates,
      experienceType,
      tips
    });
    debug("newPost: %o", newPost);
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const deletePost = async (req, res) => {
  debug("body: %o", req.body);
  const { postId, userId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const updatePost = async (req, res) => {
  debug("body: %o", req.body);
  const { postId, userId } = req.params;
  const { images, caption, location, travelDates, experienceType, tips } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    post.images = images;
    post.caption = caption;
    post.location = location;
    post.travelDates = travelDates;
    post.experienceType = experienceType;
    post.tips = tips;

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const getPostLikes = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    res.status(200).json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const likePost = async (req, res) => {
  const { userId, postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "Post liked" })
    } else {
      res.status(400).json({ message: "You have already liked this post" });
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const unlikePost = async (req, res) => {
  const { userId, postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
      await post.save();
      res.status(200).json({ message: "Post unliked" })
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const savePost = async (req, res) => {
  debug("body: %o", req.body);
  const { userId, postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post does not exist" });
    }
    const user = await User.findById(userId);
    if (!user.savedPosts.includes(postId)) {
      user.savedPosts.push(postId);
      await user.save();
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: "Post already saved" });
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const unsavePost = async (req, res) => {
  debug("body: %o", req.body);
  const { userId, postId } = req.params;

  try {
    const user = await User.findById(userId);
    if (user.savedPosts.includes(postId)) {
      user.savedPosts = user.savedPosts.filter(sPostId => sPostId.toString() !== postId);
      await user.save();
      return res.status(200).json(user);
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const createCommentPost = async (req, res) => {
  const { content } = req.body;
  const { postId, userId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = new Comment({
      user: userId,
      content
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(200).json(post);

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const deleteCommentPost = async (req, res) => {
  const { postId, commentId, userId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    post.comments = post.comments.filter(pCommentId => pCommentId.toString() !== commentId)

    await post.save();
    await comment.deleteOne();

    res.status(200).json(post);

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

//===========//

const createItinerary = async (req, res) => {
  debug("body: %o", req.body);
  const { title, description, coverPhoto, location, travelDates, plan, experienceType } = req.body;

  try {
    const newItinerary = new Itinerary({
      user: req.user.id,
      title,
      description,
      coverPhoto,
      location,
      travelDates,
      plan,
      experienceType
    });
    debug("user: %o", newItinerary);
    const post = await newItinerary.save();
    res.status(201).json(post);
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const deleteItinerary = async (req, res) => {
  debug("body: %o", req.body);
  const { itineraryId, userId } = req.params;

  try {
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary does not exist" });
    }

    if (itinerary.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await itinerary.deleteOne();
    res.status(200).json({ message: "Itinerary deleted" });

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const updateItinerary = async (req, res) => {
  debug("body: %o", req.body);
  const { itineraryId, userId } = req.params;
  const { title, description, coverPhoto, location, travelDates, plan, experienceType } = req.body;

  try {
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary does not exist" });
    }

    if (itinerary.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    itinerary.title = title;
    itinerary.description = description;
    itinerary.coverPhoto = coverPhoto;
    itinerary.location = location;
    itinerary.travelDates = travelDates;
    itinerary.plan = plan;
    itinerary.experienceType = experienceType;

    await itinerary.save();
    res.status(201).json(itinerary);
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const getItinerarylikes = async (req, res) => {
  const { itineraryId } = req.params;
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    res.status(200).json({ likes: itinerary.likes });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const likeItinerary = async (req, res) => {
  const { itineraryId, userId } = req.params;
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary.likes.includes(userId)) {
      itinerary.likes.push(userId);
      await itinerary.save();
      res.status(200).json({ message: "Post liked" })
    } else {
      res.status(400).json({ message: "You have already liked this post" });
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const unlikeItinerary = async (req, res) => {
  const { itineraryId, userId } = req.params;
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    if (itinerary.likes.includes(userId)) {
      itinerary.likes = itinerary.likes.filter(id => id.toString() !== userId);
      await itinerary.save();
      res.status(200).json({ message: "Itinerary unliked" })
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const saveItinerary = async (req, res) => {
  debug("body: %o", req.body);
  const { itineraryId, userId } = req.params;

  try {
    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary does not exist" });
    }
    const user = await User.findById(userId);
    if (!user.savedItineraries.includes(itineraryId)) {
      user.savedItineraries.push(itineraryId);
      await user.save();
      return res.status(200).json(user);
    } else {
      return res.status(400).json({ message: "Itinerary already saved" });
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const unsaveItinerary = async (req, res) => {
  debug("body: %o", req.body);
  const { itineraryId, userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (user.savedItineraries.includes(itineraryId)) {
      user.savedItineraries = user.savedItineraries.filter(sItineraryId => sItineraryId.toString() !== itineraryId);
      await user.save();
      return res.status(200).json(user);
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const createCommentItinerary = async (req, res) => {
  const { content } = req.body;
  const { itineraryId, userId } = req.params;
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }
    const comment = new Comment({
      user: userId,
      content
    });

    await comment.save();

    itinerary.comments.push(comment._id);
    await itinerary.save();

    res.status(200).json(itinerary);

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const deleteCommentItinerary = async (req, res) => {
  const { itineraryId, commentId, userId } = req.params;
  try {
    const itinerary = await Itinerary.findById(itineraryId);
    if (!itinerary) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    itinerary.comments = itinerary.comments.filter(pCommentId => pCommentId.toString() !== commentId)

    await itinerary.save();
    await comment.deleteOne();

    res.status(200).json(itinerary);

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}


module.exports = {
  createPost,
  deletePost,
  updatePost,
  getPostLikes,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  createCommentPost,
  deleteCommentPost,
  createItinerary,
  deleteItinerary,
  updateItinerary,
  getItinerarylikes,
  likeItinerary,
  unlikeItinerary,
  saveItinerary,
  unsaveItinerary,
  createCommentItinerary,
  deleteCommentItinerary,
};

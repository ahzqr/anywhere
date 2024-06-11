const debug = require("debug")("mern:controllers:api:usersController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
const Post = require("../../models/post");
const Itinerary = require("../../models/itinerary");
const { getUser } = require("../../config/checkToken");

const createJWT = (user) =>
  jwt.sign({ user }, process.env.SECRET, { expiresIn: "20m" });

const create = async (req, res) => {
  debug("body: %o", req.body);
  const { name, username, email, password } = req.body;

  try {
    const user = await User.create({ name, username, email, password });
    debug("user: %o", user);
    const token = createJWT(user);
    res.status(201).json(token);
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user === null) {
    res.status(401).json({ msg: "User not found" });
    return;
  }

  const match = await bcrypt.compare(password, user.password);

  if (match) {
    const token = createJWT(user);
    res.json(token);
  } else {
    res.status(401).json({ msg: "Password incorrect" });
  }
};

const checkToken = (req, res) => {
  const user = getUser(req, res); //res.locals.user;
  res.json({ user });
};

const getFollowingStatus = async (req, res) => {
  const { userId } = req.params;
  const user = getUser(req, res);
  try {
    const following = await User.findById(userId);

    const isFollowing = following.followers.includes(user._id);
    return res.status(200).json({ following: isFollowing });

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const createFollow = async (req, res) => {
  const { userId } = req.params;
  const user = getUser(req, res);
  try {
    const currentUser = await User.findById(user._id);
    const following = await User.findById(userId);

    if (userId === user._id) {
      res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (!following.followers.includes(user._id)) {
      following.followers.push(user._id);
      await following.save();

      currentUser.following.push(userId);
      await currentUser.save();

      return res.status(200).json({ message: "User followed sucessfully!" });
    } else {
      return res.status(400).json({ message: "You are already following this user" });
    }

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const deleteFollow = async (req, res) => {
  const { userId } = req.params;
  const user = getUser(req, res);
  try {
    const currentUser = await User.findById(user._id);
    const unfollowing = await User.findById(userId);

    if (unfollowing.followers.includes(user._id)) {
      unfollowing.followers = unfollowing.followers.filter(userId => userId.toString() !== user._id)
      await unfollowing.save();

      currentUser.following = currentUser.following.filter(fUserId => fUserId.toString() !== userId)
      await currentUser.save();

      return res.status(200).json({ message: "User unfollowed sucessfully!" });
    }
  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

const getFeedById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("following");
    const followingIds = user.following.map(user => user._id);
    followingIds.push(userId);

    const posts = await Post.find({ user: { $in: followingIds } }).populate({
      path: "user",
      select: "username"
    }).populate({
      path: "comments",
      populate: { path: "user" }
    }).sort({ createdAt: -1 });
    const itineraries = await Itinerary.find({ user: { $in: followingIds } }).populate({
      path: "user",
      select: "username"
    }).populate({
      path: "comments",
      populate: { path: "user" }
    }).sort({ createdAt: -1 });

    res.json({ posts, itineraries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user feed" });
  }
};

const getProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("following");
    const posts = await Post.find({ user: userId });
    const itineraries = await Itinerary.find({ user: userId });
    res.json({ user, posts, itineraries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving profile" });
  }
}

const getSavedContent = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate({
      path: "savedPosts",
      model: "Post"
    }).populate({
      path: "savedItineraries",
      model: "Itinerary"
    });

    res.json({
      savedPosts: user.savedPosts,
      savedItineraries: user.savedItineraries
    });

  } catch (error) {
    debug("error: %o", error);
    res.status(500).json({ error });
  }
}

module.exports = {
  create,
  login,
  checkToken,
  createFollow,
  deleteFollow,
  getFollowingStatus,
  getFeedById,
  getProfile,
  getSavedContent
};

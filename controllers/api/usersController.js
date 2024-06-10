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

const createFollow = async (req, res) => {
  const { userId } = req.params;
  console.log(res.locals.user);
  try {
    const currentUser = await User.findById(res.locals.user._id);
    const following = await User.findById(userId);

    if (following.id === res.locals.user._id) {
      res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (!following.followers.includes(res.locals.user._id)) {
      following.followers.push(res.locals.user._id);
      await following.save();

      currentUser.following.push(res.locals.user._id);
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
  try {
    const currentUser = await User.findById(userId);
    const unfollowing = await User.findById(userId);

    if (unfollowing.followers.includes(userId)) {
      unfollowing.followers = unfollowing.followers.filter(userId => userId.toString() !== userId)
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
    console.log(user);
    const followingIds = user.following.map(user => user._id);

    const posts = await Post.find({ user: { $in: followingIds } }).populate({
      path: "comments",
      populate: { path: "user" }
    }).sort({ createdAt: -1 });
    const itineraries = await Itinerary.find({ user: { $in: followingIds } }).populate({
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

module.exports = {
  create,
  login,
  checkToken,
  createFollow,
  deleteFollow,
  getFeedById,
  getProfile
};

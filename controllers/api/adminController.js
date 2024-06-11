const User = require("../../models/user");
const Post = require("../../models/post");
const Itinerary = require("../../models/itinerary");

const getCounts = async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        const postCount = await Post.countDocuments({});
        const itineraryCount = await Itinerary.countDocuments({});
        res.json({ userCount, postCount, itineraryCount });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch count data" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("user", "username");
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

const getAllItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find({}).populate("user", "username");
        res.json(itineraries);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch itineraries" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};

const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        await Post.findByIdAndDelete(id);
        res.json({ message: "Post deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete post" });
    }
};

const deleteItinerary = async (req, res) => {
    const { id } = req.params;
    try {
        await Itinerary.findByIdAndDelete(id);
        res.json({ message: "Itinerary deleted" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete itinerary" });
    }
};

module.exports = {
    getCounts,
    getAllUsers,
    getAllPosts,
    getAllItineraries,
    deleteUser,
    deletePost,
    deleteItinerary
};
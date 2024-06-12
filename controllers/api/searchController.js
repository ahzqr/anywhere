const User = require("../../models/user");
const Post = require("../../models/post");
const Itinerary = require("../../models/itinerary");

const getSearchResults = async (req, res) => {
    const { q } = req.query;
    try {
        const posts = await Post.find({ location: { $regex: q, $options: "i" } }).populate("user", "username");
        const itineraries = await Itinerary.find({ location: { $regex: q, $options: "i" } }).populate("user", "username");
        const users = await User.find({ username: { $regex: q, $options: "i" } });

        res.json({ posts, users, itineraries });
    } catch (error) {
        res.status(500).json({ error: "Failed to perform search" });
    }
}

module.exports = {
    getSearchResults
}
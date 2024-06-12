const User = require("../../models/user");
const Post = require("../../models/post");

const getSearchResults = async (req, res) => {
    const { q } = req.query;
    try {
        const posts = await Post.find({ location: { $regex: q, $options: "i" } });
        const users = await User.find({ username: { $regex: q, $options: "i" } });

        res.json({posts, users});
    } catch (error) {
        res.status(500).json({ error: "Failed to perform search" });
    }
}

module.exports = {
    getSearchResults
}
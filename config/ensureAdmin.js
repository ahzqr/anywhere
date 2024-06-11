const { getUser } = require("./checkToken");

module.exports = function (req, res, next) {
    const user = getUser(req, res);
    if (!user || !user.isAdmin) return res.status(403).json("Forbidden");
    next();
};

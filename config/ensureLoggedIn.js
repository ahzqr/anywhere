const { getUser } = require("./checkToken");

module.exports = function (req, res, next) {
  // Status code of 401 is Unauthorized
  const user = getUser(req, res);
  if (!user) return res.status(401).json("Unauthorized");
  // A okay
  next();
};

const debug = require("debug")("mern:controllers:api:usersController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../models/user");
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

module.exports = {
  create,
  login,
  checkToken,
};

const express = require("express");
const path = require("path");
const logger = require("morgan");
const debug = require("debug")("anywhere:server");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
// Always require and configure near the top
require("dotenv").config();
require("./config/database");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(logger("dev"));
app.use(express.json());

// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(express.static(path.join(__dirname, "dist")));
app.use(require("./config/checkToken").checkTokenMiddleware);

// Put API routes here, before the "catch all" route
app.get("/api", (req, res) => {
  res.json({ hello: "world" });
});
app.use("/api/users", require("./routes/api/usersRoutes"));
app.use("/api/content", require("./routes/api/postsRoutes"));
app.use("/api/feed", require("./routes/api/feedRoutes"));
app.use("/api/admin", require("./routes/api/adminRoutes"));
app.use("/api/upload", upload.single("file"), require("./routes/api/uploadRoutes"));
app.use("/api/search", require("./routes/api/searchRoutes"));



// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;

app.listen(port, function () {
  debug(`Express app running on port ${port}`);
});

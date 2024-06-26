const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: 3,
      required: true,
    },
    profilepic: {
      type: String,
      default: "https://github.com/ahzqr/anywhere/blob/main/assets/default_avatar.png?raw=true"
    },
    bio: {
      type: String,
      default: ""
    },
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }
    ],
    savedPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
    ],
    savedItineraries: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" }
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.pre("save", async function (next) {
  // 'this' is the user doc
  if (!this.isModified("password")) return next();
  // update the password with the computed hash
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

module.exports = mongoose.model("User", userSchema);

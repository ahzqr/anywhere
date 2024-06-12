const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: "User",
      required: true
    },
    images: [{
      type: String,
      required: true
    }],
    caption: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      required: true
    },
    travelDates: {
      start: { type: Date },
      end: { type: Date }
    },
    experienceType: {
      type: String,
      // enum: ["Adventure", "Nature", "Luxury"],
      required: true
    },
    tips: {
      type: String
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId, ref: "User"
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId, ref: "Comment"
    }],

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

module.exports = mongoose.model("Post", postSchema);

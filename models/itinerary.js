const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itinerarySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, ref: "User",
      // required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    coverPhoto: [{
      type: String
    }],
    location: {
      type: String,
      required: true
    },
    travelDates: {
      start: { type: Date },
      end: { type: Date }
    },
    plan: [{
      day: {
        type: Number,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      activities: {
        type: String,
        required: true
      }
    }],
    experienceType: {
      type: String,
      // enum: ["Adventure", 'Nature', "Luxury"],
      required: true
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

module.exports = mongoose.model("Itinerary", itinerarySchema);

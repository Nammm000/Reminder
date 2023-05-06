const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  setTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/*
StorySchema.virtual("deleteAfter").get(function () {
  return this.setTime.getTime() - this.createdAt.getTime() || 5;
});
*/

module.exports = mongoose.model("Story", StorySchema);

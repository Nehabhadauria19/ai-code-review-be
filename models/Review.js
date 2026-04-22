const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    code: String,
    language: String,
    review: Object,
    userId: String, // ✅ important
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
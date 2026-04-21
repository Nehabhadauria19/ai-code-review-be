// models/Review.js
const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  code: String,
  review: Object,
  language: String,
  createdAt: { type: Date, default: Date.now },
  userId: String,
});

module.exports = mongoose.model("Review", ReviewSchema);
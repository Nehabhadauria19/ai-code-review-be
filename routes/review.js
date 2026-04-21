// routes/review.js
const express = require("express");
const router = express.Router();
const analyzeCode = require("../services/aiService");
const Review = require("../models/Review");


router.get("/reviews", async (req, res) => {
  try {
    const { userId } = req.query;

    const query = userId ? { userId } : {};

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// POST: Review code
router.post("/review", async (req, res) => {
  try {
    const { code, language, userId } = req.body;

    const aiResponse = await analyzeCode(code);

    const saved = await Review.create({
      code,
      language,
      review: aiResponse,
      userId: userId || "anonymous",
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET: History
router.get("/reviews", async (req, res) => {
  const data = await Review.find().sort({ createdAt: -1 });
  res.json(data);
});

module.exports = router;
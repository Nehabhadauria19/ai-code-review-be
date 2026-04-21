const express = require("express");
const router = express.Router();
const analyzeCode = require("../services/aiService");
const Review = require("../models/Review");

// ✅ GET: History (with optional user filter)
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

// ✅ POST: Review code
router.post("/review", async (req, res) => {
  try {
    const { code, language, userId } = req.body;

    const aiResponse = await analyzeCode(code);

    // 🔥 IMPORTANT: parse AI response
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      parsed = {
        bugs: [],
        security: [],
        performance: [],
        bestPractices: [],
        severity: "low",
        suggestions: [],
      };
    }

    const saved = await Review.create({
      code,
      language,
      review: parsed, // ✅ now object
      userId: userId || "guest",
    });

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const mongoose = require('mongoose');

const highScoreSchema = new mongoose.Schema(
  {
    initials: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }
);

module.exports = mongoose.model('HighScore', highScoreSchema);

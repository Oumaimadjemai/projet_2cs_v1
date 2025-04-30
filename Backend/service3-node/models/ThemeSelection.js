const mongoose = require("mongoose");

const themeSelectionSchema = new mongoose.Schema({
  user_id: { type: Number, required: true, unique: true },
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  choices: {
    p1: { type: Number },
    p2: { type: Number },
    p3: { type: Number },
  },
  submitted_at: { type: Date, default: Date.now },
  status: { type: String, enum: ["draft", "submitted"], default: "draft" },
});

module.exports = mongoose.model("ThemeSelection", themeSelectionSchema);
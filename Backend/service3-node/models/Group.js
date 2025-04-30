const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chef_id: { type: Number, required: true },
  members: { type: [Number], default: [] },
  invitations: { type: [Number], default: [] },
  created_at: { type: Date, default: Date.now },
  annee_academique_id: { type: String, required: false },
  moyenne_groupe: { type: Number, default: null }
});

groupSchema.index({ chef_id: 1, annee_academique_id: 1 }, { unique: true });

module.exports = mongoose.model("Group", groupSchema);
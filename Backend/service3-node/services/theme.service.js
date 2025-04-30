const { discoverService2 } = require('./discovery.service');
const axios = require('axios');
const ThemeSelection = require('../models/ThemeSelection');

async function validateTheme(themeId, authToken) {
  try {
    const service2Url = await discoverService2();
    const response = await axios.get(`${service2Url}/themes/${themeId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return { valid: true, data: response.data };
  } catch (error) {
    return {
      valid: false,
      themeId,
      error: error.response?.status === 404 ? "Theme not found" : "Validation failed",
    };
  }
}

async function saveThemeSelection(userId, choices, status) {
  return await ThemeSelection.findOneAndUpdate(
    { user_id: userId },
    {
      choices,
      status,
      ...(status === "submitted" && { submitted_at: new Date() }),
    },
    { upsert: true, new: true, runValidators: true }
  );
}

async function getGroupThemeSelections(groupId) {
  return await ThemeSelection.find({ group_id: groupId }).lean();
}

module.exports = {
  validateTheme,
  saveThemeSelection,
  getGroupThemeSelections,
};
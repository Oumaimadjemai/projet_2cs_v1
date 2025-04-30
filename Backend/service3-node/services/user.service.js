const { discoverDjangoService } = require('./discovery.service');
const axios = require('axios');

async function getUserDetails(userId, authToken) {
  try {
    const djangoUrl = await discoverDjangoService();
    const response = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error.message);
    throw error;
  }
}

async function getAllUsers(authToken) {
  try {
    const djangoUrl = await discoverDjangoService();
    const response = await axios.get(`${djangoUrl}/etudiants/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
}

module.exports = {
  getUserDetails,
  getAllUsers,
};
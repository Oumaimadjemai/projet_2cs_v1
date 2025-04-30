const Group = require('../models/Group');
const axios = require('axios');
const { discoverDjangoService } = require('./discovery.service');

async function calculateGroupAverage(groupId, authHeader) {
  try {
    const group = await Group.findById(groupId);
    if (!group || !group.members || group.members.length === 0) return null;

    const djangoUrl = await discoverDjangoService();
    let total = 0;
    let count = 0;

    await Promise.all(group.members.map(async (memberId) => {
      try {
        const response = await axios.get(`${djangoUrl}/etudiants/${memberId}/`, {
          headers: { 
            Authorization: authHeader,
            'Content-Type': 'application/json'
          }
        });

        const moyenne = parseFloat(response.data?.moyenne_etudiant);
        if (!isNaN(moyenne)) {
          total += moyenne;
          count++;
        }
      } catch (error) {
        console.error(`Erreur pour étudiant ${memberId}:`, error.message);
      }
    }));

    return count > 0 ? parseFloat((total / count).toFixed(2)) : null;
  } catch (error) {
    console.error("Erreur dans calculateGroupAverage:", error);
    return null;
  }
}

async function getMembersDetails(memberIds, djangoUrl, authHeader) {
  try {
    const results = await Promise.all(
      memberIds.map(async id => {
        try {
          const { data } = await axios.get(`${djangoUrl}/etudiants/${id}/`, {
            headers: { Authorization: authHeader },
            timeout: 3000
          });
          return data;
        } catch (error) {
          console.error(`Failed to fetch member ${id}:`, error.message);
          return null;
        }
      })
    );
    return results.filter(Boolean);
  } catch (error) {
    console.error("Error in getMembersDetails:", error);
    return [];
  }
}
async function calculateGroupAverage2(memberIds, djangoUrl, authHeader) {
  try {
    let total = 0;
    let count = 0;

    await Promise.all(memberIds.map(async (memberId) => {
      try {
        const response = await axios.get(`${djangoUrl}/etudiants/${memberId}/`, {
          headers: { 
            Authorization: authHeader,
            'Content-Type': 'application/json'
          }
        });

        const moyenne = parseFloat(response.data?.moyenne_etudiant);
        if (!isNaN(moyenne)) {
          total += moyenne;
          count++;
        }
      } catch (error) {
        console.error(`Error fetching student ${memberId}:`, error.message);
      }
    }));

    return count > 0 ? parseFloat((total / count).toFixed(2)) : null;
  } catch (error) {
    console.error("Error in calculateGroupAverage:", error);
    return null;
  }
}
module.exports = {
  calculateGroupAverage,
  getMembersDetails,
  calculateGroupAverage2,
};
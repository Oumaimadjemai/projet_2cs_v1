const { discoverDjangoService } = require('../services/discovery.service');
const axios = require('axios');

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const djangoUrl = await discoverDjangoService();

    const response = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
      headers: { Authorization: req.headers.authorization },
    });

    res.json({
      id: response.data.id,
      prenom: response.data.prenom,
      nom: response.data.nom,
      email: response.data.email,
      photo_profil: response.data.photo_profil,
      moyenne_etudiant: response.data.moyenne_etudiant
    });
  } catch (error) {
    console.error("Error fetching user details:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (error.response?.status === 404) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(500).json({
      error: "Error fetching user details",
      details: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const djangoUrl = await discoverDjangoService();
    const response = await axios.get(`${djangoUrl}/etudiants/`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};




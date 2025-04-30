const jwt = require("jsonwebtoken");
const axios = require('axios');

const { discoverDjangoService } = require("../services/discovery.service");
const config = require("../config");

const verifyJWT = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, { algorithms: ["HS256"] });
    const djangoUrl = await discoverDjangoService();

    const response = await axios.get(`${djangoUrl}/etudiants/${decoded.user_id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    req.user = {
      id: decoded.user_id,
      ...response.data,
    };
    next();
  } catch (error) {
    console.error("Détails erreur:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    console.error("Erreur auth:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré" });
    }
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Utilisateur non trouvé dans Django" });
    }
    res.status(403).json({ error: "Token invalide" });
  }
};

const verifyJWTAnyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET, { algorithms: ["HS256"] });
    req.user = { id: decoded.user_id };
    next();
  } catch (error) {
    console.error("Erreur JWT:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré" });
    }
    res.status(403).json({ error: "Token invalide" });
  }
};

module.exports = {
  verifyJWT,
  verifyJWTAnyUser,
};
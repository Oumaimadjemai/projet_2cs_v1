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


const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: "Authorization header manquant",
      solution: "Utilisez le format: 'Authorization: Bearer <token>'"
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Vérification robuste du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: [process.env.JWT_ALGORITHM],
      ignoreExpiration: false,
      clockTolerance: 30 // Marge de 30 secondes pour les problèmes d'horloge
    });

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur de vérification JWT:", {
      name: error.name,
      message: error.message,
      token: token.substring(0, 10) + '...' // Log partiel pour sécurité
    });

    let errorMessage = "Erreur d'authentification";
    if (error.name === "TokenExpiredError") {
      errorMessage = "Token expiré";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Signature du token invalide";
    }

    res.status(401).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? {
        reason: error.message,
        solution: "Générez un nouveau token valide"
      } : null
    });
  }
};
module.exports = {
  verifyJWT,
  verifyJWTAnyUser,
  verifyAdmin 
};
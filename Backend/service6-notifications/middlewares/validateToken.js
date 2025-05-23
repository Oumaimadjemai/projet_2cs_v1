const jwt = require("jsonwebtoken");
require('dotenv').config();


const verifyJWTAnyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
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

module.exports = verifyJWTAnyUser;
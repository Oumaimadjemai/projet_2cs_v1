// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
// const axios = require("axios");
// const cors = require("cors");
// const Eureka = require("eureka-js-client").Eureka;

// // Configuration
// const JWT_SECRET =
//   process.env.JWT_SECRET ||
//   "django-insecure-1t@eg)yilj^)-=1b+lhhq0_82gmzzkbmcxmbkgf)yrd(c*e+o@";
// const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://localhost:8000";
// const SERVICE2_NAME = process.env.SERVICE2_NAME || "SERVICE2-CLIENT";
// const PORT = process.env.PORT || 3000;

// // Initialisation Express
// const app = express();
// app.use(cors());
// app.use(express.json());

// // Configuration Eureka Client

// const eurekaClient = new Eureka({
//   instance: {
//     app: "SERVICE3-NODE",
//     hostName: process.env.HOSTNAME || "localhost",
//     ipAddr: process.env.IP || "127.0.0.1",
//     port: {
//       $: PORT,
//       "@enabled": true,
//     },
//     vipAddress: "node-group-service",
//     dataCenterInfo: {
//       "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
//       name: "MyOwn",
//     },
//     registerWithEureka: true,
//     fetchRegistry: true,
//     statusPageUrl: `http://${process.env.HOSTNAME || "localhost"}:${PORT}/info`,
//     healthCheckUrl: `http://${
//       process.env.HOSTNAME || "localhost"
//     }:${PORT}/health`,
//     homePageUrl: `http://${process.env.HOSTNAME || "localhost"}:${PORT}`,
//   },
//   eureka: {
//     host: process.env.EUREKA_HOST || "localhost",
//     port: process.env.EUREKA_PORT || 8761,
//     servicePath: "/eureka/apps/",
//     maxRetries: 10,
//     requestRetryDelay: 2000,
//   },
// });

// // Connexion MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/groupApp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connecté à MongoDB"))
//   .catch((err) => console.error("Erreur MongoDB:", err));
 


// const groupSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   chef_id: { type: Number, required: true },
//   members: { type: [Number], default: [] },
//   invitations: { type: [Number], default: [] },
//   created_at: { type: Date, default: Date.now },
//   annee_academique_id: { type: String, required: false },
//   moyenne_groupe: { type: Number, default: null } // Nouveau champ ajouté
// });
// groupSchema.index({ chef_id: 1, annee_academique_id: 1 }, { unique: true });  // Ensures one group per chef per academic year


// const Group = mongoose.model("Group", groupSchema);

// const themeSelectionSchema = new mongoose.Schema({
//   user_id: { type: Number, required: true, unique: true },
//   group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true }, // Ajout du group_id
//   choices: {
//     p1: { type: Number },
//     p2: { type: Number },
//     p3: { type: Number },
//   },
//   submitted_at: { type: Date, default: Date.now },
//   status: { type: String, enum: ["draft", "submitted"], default: "draft" },
// });

// const ThemeSelection = mongoose.model("ThemeSelection", themeSelectionSchema);


// // Fonction de découverte de service Django
// async function discoverDjangoService() {
//   try {
//     const instances = eurekaClient.getInstancesByAppId(
//       process.env.DJANGO_SERVICE_NAME || "SERVICE1-CLIENT"
//     );

//     if (!instances || instances.length === 0) {
//       console.warn(
//         "Aucune instance Django disponible via Eureka, utilisation de la configuration par défaut"
//       );
//       return process.env.DJANGO_API_URL || "http://localhost:8000";
//     }

//     // Sélection aléatoire pour le load balancing simple
//     const instance = instances[Math.floor(Math.random() * instances.length)];
//     const baseUrl = `http://${instance.hostName}:${
//       instance.port["$"] || process.env.DJANGO_SERVICE_PORT || 8000
//     }`;
//     console.log(`Utilisation de l'instance Django: ${baseUrl}`);
//     return baseUrl;
//   } catch (error) {
//     console.error("Erreur de découverte de service:", error);
//     return process.env.DJANGO_API_URL || "http://localhost:8000"; // Fallback
//   }
// }
// async function discoverService2() {
//   try {
//     const instances = eurekaClient.getInstancesByAppId(SERVICE2_NAME);

//     if (!instances || instances.length === 0) {
//       console.warn(
//         "Aucune instance Service2 disponible via Eureka, utilisation de la configuration par défaut"
//       );
//       return process.env.SERVICE2_API_URL || "http://localhost:8001";
//     }

//     // Simple load balancing
//     const instance = instances[Math.floor(Math.random() * instances.length)];
//     const baseUrl = `http://${instance.hostName}:${
//       instance.port["$"] || process.env.SERVICE2_PORT || 8001
//     }`;
//     console.log(`Utilisation de l'instance Service2: ${baseUrl}`);
//     return baseUrl;
//   } catch (error) {
//     console.error("Erreur de découverte de service2:", error);
//     return process.env.SERVICE2_API_URL || "http://localhost:8001"; // Fallback
//   }
// }

// // Middleware d'authentification
// const verifyJWT = async (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ error: "Token manquant" });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
//     const djangoUrl = await discoverDjangoService();

//     // Vérification avec Django
//     const response = await axios.get(
//       `${djangoUrl}/etudiants/${decoded.user_id}/`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     req.user = {
//       id: decoded.user_id,
//       ...response.data,
//     };
//     next();
//   } catch (error) {
//     console.error("Détails erreur:", {
//       status: error.response?.status,
//       url: error.config?.url,
//       data: error.response?.data,
//     });
//     console.error("Erreur auth:", error.message);
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ error: "Token expiré" });
//     }
//     if (error.response?.status === 404) {
//       return res
//         .status(404)
//         .json({ error: "Utilisateur non trouvé dans Django" });
//     }
//     res.status(403).json({ error: "Token invalide" });
//   }
// };
// // Nouveau middleware (à ajouter dans votre fichier)
// const verifyJWTAnyUser = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Token manquant" });
//   }

//   try {
//     // Vérification basique du token (sans appel à Django)
//     const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
//     req.user = { id: decoded.user_id }; // Stocke uniquement l'ID
//     next();
//   } catch (error) {
//     console.error("Erreur JWT:", error.message);
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ error: "Token expiré" });
//     }
//     res.status(403).json({ error: "Token invalide" });
//   }
// };





// // Endpoints de santé pour Eureka
// app.get("/health", (req, res) => res.status(200).json({ status: "UP" }));
// app.get("/info", (req, res) =>
//   res.json({
//     service: "Node Group Service",
//     status: "UP",
//     version: "1.0.0",
//   })
// );

// // Routes

// app.post("/api/create-group", verifyJWT, async (req, res) => {
//   try {
//     const { name } = req.body;
//     const creatorId = req.user.id;

//     // 1. Déterminer l'année académique (2024-2025 ou 2025-2026)
//     const currentYear = new Date().getFullYear();
//     const nextYear = currentYear + 1;
//     const month = new Date().getMonth(); // 0-11 (janvier-décembre)
    
//     // Si entre septembre et décembre, année académique est currentYear-nextYear
//     // Si entre janvier et août, année académique est (currentYear-1)-currentYear
//     const anneeAcademique = month >= 8 ? `${currentYear}-${nextYear}` : `${currentYear-1}-${currentYear}`;

//     // 2. Vérifier si l'utilisateur a déjà un groupe
//     const existingGroup = await Group.findOne({ 
//       chef_id: creatorId, 
//       annee_academique_id: anneeAcademique 
//     });

//     if (existingGroup) {
//       return res.status(400).json({
//         error: `Vous avez déjà créé un groupe pour ${anneeAcademique}`,
//       });
//     }

//     // 3. Créer le groupe
//     const group = await Group.create({
//       name,
//       chef_id: creatorId,
//       members: [creatorId],
//       annee_academique_id: anneeAcademique,
//       moyenne_groupe: null
//     });

//     // 4. Mettre à jour le statut chef dans Django
//     const djangoUrl = await discoverDjangoService();
//     await axios.patch(
//       `${djangoUrl}/etudiants/${creatorId}/`,
//       { chef_equipe: true },
//       { headers: { Authorization: req.headers.authorization } }
//     );

//     // 5. Calculer la moyenne (si des membres ont des moyennes)
//     const moyenne = await calculateGroupAverage(group._id);
//     const updatedGroup = await Group.findByIdAndUpdate(
//       group._id,
//       { moyenne_groupe: moyenne },
//       { new: true }
//     );

//     // 6. Réponse
//     res.status(201).json({
//       success: true,
//       group: updatedGroup,
//       message: `Groupe créé pour ${anneeAcademique}`
//     });

//   } catch (error) {
//     console.error("Erreur création groupe:", error.message);
//     res.status(500).json({
//       error: "Erreur lors de la création du groupe",
//       details: process.env.NODE_ENV === 'development' ? error.message : null,
//     });
//   }
// });
// // Fonction pour calculer la moyenne du groupe
// async function calculateGroupAverage(groupId, req) {  // On passe l'objet req complet
//   try {
//     const group = await Group.findById(groupId);
//     if (!group || !group.members || group.members.length === 0) return null;

//     const djangoUrl = await discoverDjangoService();
//     let total = 0;
//     let count = 0;

//     await Promise.all(group.members.map(async (memberId) => {
//       try {
//         const response = await axios.get(`${djangoUrl}/etudiants/${memberId}/`, {
//           headers: { 
//             Authorization: req.headers.authorization,  // Utilisation directe du header
//             'Content-Type': 'application/json'
//           }
//         });

//         const moyenne = parseFloat(response.data?.moyenne_etudiant);
//         if (!isNaN(moyenne)) {
//           total += moyenne;
//           count++;
//         }
//       } catch (error) {
//         console.error(`Erreur pour étudiant ${memberId}:`, error.message);
//       }
//     }));

//     return count > 0 ? parseFloat((total / count).toFixed(2)) : null;
//   } catch (error) {
//     console.error("Erreur dans calculateGroupAverage:", error);
//     return null;
//   }
// }


// app.get("/api/groups/:id/members", verifyJWTAnyUser, async (req, res) => {
//   try {
//     const group = await Group.findById(req.params.id);
//     if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

//     const djangoUrl = await discoverDjangoService();
//     //
//     // console.log("[DEBUG] Membres dans MongoDB:", group.members);

//     const membersDetails = await Promise.all(
//       group.members.map(async (id) => {
//         try {
//           const response = await axios.get(`${djangoUrl}/etudiants/${id}/`, {
//             headers: { Authorization: req.headers.authorization },
//           });
//           console.log(`[DEBUG] Données membre ${id}:`, response.data);
//           return response.data;
//         } catch (error) {
//           console.error(`[ERROR] Membre ${id}:`, error.message);
//           return null;
//         }
//       })
//     );

//     res.json({
//       success: true,
//       members: membersDetails.filter((m) => m !== null),
//       chef_id: group.chef_id,
//     });
//   } catch (error) {
//     console.error("[ERROR]", error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// });

// app.get("/api/groups/user", verifyJWT, async (req, res) => {
//   try {
//     const userId = parseInt(req.user.id);

//     const joinedGroups = await Group.find({
//       $or: [{ members: userId }, { chef_id: userId }],
//     }).select("name chef_id members created_at");

//     res.json(joinedGroups);
//   } catch (error) {
//     console.error("Error fetching joined groups:", error);
//     res.status(500).json({
//       error: "Error fetching your groups",
//       details: error.message,
//     });
//   }
// });


// // Routes pour les invitations

// app.post("/api/groups/:groupId/invite/:userId", verifyJWT, async (req, res) => {
//   try {
//     const { groupId, userId } = req.params;
//     const inviterId = req.user.id;
//     const djangoUrl = await discoverDjangoService();

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

//     if (group.chef_id !== inviterId) {
//       return res
//         .status(403)
//         .json({ error: "Seul le chef peut inviter des membres" });
//     }

//     const userResponse = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
//       headers: { Authorization: req.headers.authorization },
//     });

//     if (group.members.includes(parseInt(userId))) {
//       return res
//         .status(400)
//         .json({ error: "L'utilisateur est déjà membre du groupe" });
//     }
//     if (group.invitations.includes(parseInt(userId))) {
//       return res.status(400).json({ error: "L'utilisateur a déjà été invité" });
//     }

//     group.invitations.push(parseInt(userId));
//     await group.save();

//     res.json({
//       success: true,
//       message: "Invitation envoyée avec succès",
//       invited_user: {
//         id: userId,
//         name: `${userResponse.data.prenom} ${userResponse.data.nom}`,
//       },
//     });
//   } catch (error) {
//     console.error("Erreur invitation:", error);
//     if (error.response?.status === 404) {
//       return res.status(404).json({ error: "Utilisateur non trouvé" });
//     }
//     res.status(500).json({ error: "Erreur lors de l'envoi de l'invitation" });
//   }
// });

// // Accepter une invitation
// app.post("/api/groups/:groupId/accept", verifyJWT, async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const userId = req.user.id;

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

//     if (!group.invitations.includes(parseInt(userId))) {
//       return res
//         .status(400)
//         .json({ error: "Vous n'avez pas d'invitation pour ce groupe" });
//     }

//     if (group.members.length >= 5) {
//       return res.status(400).json({ error: "Le groupe est déjà complet" });
//     }

//     group.members.push(parseInt(userId));
//     group.invitations = group.invitations.filter(
//       (id) => id !== parseInt(userId)
//     );
//     await group.save();

//     res.json({
//       success: true,
//       message: "Vous avez rejoint le groupe avec succès",
//       group: {
//         id: group._id,
//         name: group.name,
//         members: group.members,
//       },
//     });
//   } catch (error) {
//     console.error("Erreur acceptation:", error);
//     res
//       .status(500)
//       .json({ error: "Erreur lors de l'acceptation de l'invitation" });
//   }
// });

// // Refuser une invitation
// app.post("/api/groups/:groupId/decline", verifyJWT, async (req, res) => {
//   try {
//     const { groupId } = req.params;
//     const userId = req.user.id;

//     const group = await Group.findById(groupId);
//     if (!group) return res.status(404).json({ error: "Groupe non trouvé" });

//     if (!group.invitations.includes(parseInt(userId))) {
//       return res
//         .status(400)
//         .json({ error: "Vous n'avez pas d'invitation pour ce groupe" });
//     }

//     group.invitations = group.invitations.filter(
//       (id) => id !== parseInt(userId)
//     );
//     await group.save();

//     res.json({
//       success: true,
//       message: "Invitation refusée avec succès",
//     });
//   } catch (error) {
//     console.error("Erreur refus:", error);
//     res.status(500).json({ error: "Erreur lors du refus de l'invitation" });
//   }
// });

// // Lister les invitations d'un utilisateur
// app.get("/api/users/invitations", verifyJWT, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const djangoUrl = await discoverDjangoService();

//     const groups = await Group.find({ invitations: parseInt(userId) });

//     const invitations = await Promise.all(
//       groups.map(async (group) => {
//         const chefResponse = await axios.get(
//           `${djangoUrl}/etudiants/${group.chef_id}/`,
//           {
//             headers: { Authorization: req.headers.authorization },
//           }
//         );
//         return {
//           group_id: group._id,
//           group_name: group.name,
//           chef_name: `${chefResponse.data.prenom} ${chefResponse.data.nom}`,
//           created_at: group.created_at,
//         };
//       })
//     );

//     res.json({
//       success: true,
//       invitations,
//     });
//   } catch (error) {
//     console.error("Erreur liste invitations:", error);
//     res
//       .status(500)
//       .json({ error: "Erreur lors de la récupération des invitations" });
//   }
// });

// // Route pour obtenir les détails d'un utilisateur
// app.get("/api/users/:id", verifyJWT, async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const djangoUrl = await discoverDjangoService();

//     const response = await axios.get(`${djangoUrl}/etudiants/${userId}/`, {
//       headers: { Authorization: req.headers.authorization },
//     });

//     res.json({
//       id: response.data.id,
//       prenom: response.data.prenom,
//       nom: response.data.nom,
//       email: response.data.email,
//       photo_profil: response.data.photo_profil,
//       moyenne_etudiant: response.data.moyenne_etudiant
//     });
//   } catch (error) {
//     console.error("Error fetching user details:", {
//       status: error.response?.status,
//       url: error.config?.url,
//       data: error.response?.data,
//     });

//     if (error.response?.status === 404) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(500).json({
//       error: "Error fetching user details",
//       details: error.message,
//     });
//   }
// });

// // Lister tous les utilisateurs
// app.get("/api/users", verifyJWT, async (req, res) => {
//   try {
//     const djangoUrl = await discoverDjangoService();
//     const response = await axios.get(`${djangoUrl}/etudiants/`, {
//       headers: { Authorization: req.headers.authorization },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

// //Routes pour les service 2:
// // GET /api/themes - Returns all themes

// // GET /api/themes?annee_etude=1 - Filters by study year

// // GET /api/themes?annee_etude=1&specialite=1 - Filters by both year and specialty
// app.get("/api/themes", verifyJWT, async (req, res) => {
//   try {
//     const { annee_etude, specialite } = req.query;
//     const service2Url = await discoverService2();
    
//     let apiUrl;
//     // Determine which Django endpoint to call based on provided parameters
//     if (annee_etude && specialite) {
//       apiUrl = `${service2Url}/themes/by-annee-specialite/${annee_etude}/${specialite}/`;
//     } else if (annee_etude) {
//       apiUrl = `${service2Url}/themes/by-annee/${annee_etude}/`;
//     } else {
//       apiUrl = `${service2Url}/themes/`;
//     }

//     const response = await axios.get(apiUrl, {
//       headers: { 
//         Authorization: req.headers.authorization,
//         'Content-Type': 'application/json'
//       },
//     });

//     // Format the response consistently
//     res.json({
//       success: true,
//       count: response.data.length,
//       data: response.data,
//       filters: {
//         annee_etude: annee_etude || 'all',
//         specialite: specialite || 'all'
//       }
//     });

//   } catch (error) {
//     console.error("Error fetching themes:", error);
//     const statusCode = error.response?.status || 500;
//     res.status(statusCode).json({
//       success: false,
//       error: "Error fetching themes",
//       details: error.response?.data || error.message,
//     });
//   }
// });

// // Get all available themes (from service2)
// app.get(
//   "/api/theme-selection/available-themes",
//   verifyJWT,
//   async (req, res) => {
//     try {
//       const service2Url = await discoverService2();
//       const response = await axios.get(`${service2Url}/themes/`, {
//         headers: { Authorization: req.headers.authorization },
//       });

//       // You might want to format the response to include only essential fields
//       const formattedThemes = response.data.map((theme) => ({
//         id: theme.id,
//         title: theme.titre,
//       }));

//       res.json(formattedThemes);
//     } catch (error) {
//       console.error("Error fetching available themes:", error);
//       res.status(500).json({
//         error: "Error fetching available themes",
//         details: error.message,
//       });
//     }
//   }
// );





// app.get("/api/theme-selection/my-choices", verifyJWTAnyUser, async (req, res) => {
//   try {
//     const userId = req.user.id; // ID récupéré depuis le token
//     const { groupId } = req.query;

//     if (!groupId) {
//       return res.status(400).json({ error: "GroupId is required" });
//     }

//     const selection = await ThemeSelection.findOne({ 
//       user_id: userId, 
//       group_id: groupId 
//     });

//     if (!selection) {
//       return res.json({
//         status: "not_started",
//         choices: { p1: null, p2: null, p3: null },
//       });
//     }

//     res.json(selection);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// // Get all data: GET /api/theme-selection/all-groups-choices

// // Filter by 3rd year: GET /api/theme-selection/all-groups-choices?annee_etude=1

// // Filter by specialty 1: GET /api/theme-selection/all-groups-choices?specialite=1

// // Combined filter: GET /api/theme-selection/all-groups-choices?annee_etude=1&specialite=1
// app.get("/api/theme-selection/all-groups-choices", verifyJWTAnyUser, async (req, res) => {
//   try {
//     // 1. Extract query parameters
//     const requestedYear = req.query.annee_etude ? Number(req.query.annee_etude) : null;
//     const requestedSpecialty = req.query.specialite ? Number(req.query.specialite) : null;

//     // 2. Fetch all groups with their theme selections
//     const allGroups = await Group.find({}).lean();
    
//     // 3. Discover Django service for student data
//     const djangoUrl = await discoverDjangoService();
//     if (!djangoUrl) throw new Error("Django service unavailable");

//     // 4. Process groups in structured format
//     const result = {};
    
//     for (const group of allGroups) {
//       try {
//         // Get member details from Django
//         const membersDetails = await getMembersDetails(
//           group.members,
//           djangoUrl,
//           req.headers.authorization
//         );

//         if (!membersDetails.length) continue;

//         const chef = membersDetails.find(m => m.id === group.chef_id) || membersDetails[0];
//         const year = typeof chef.annee_etude === 'number' ? chef.annee_etude : null;
//         const specialty = typeof chef.specialite === 'number' ? chef.specialite : null;

//         // Apply filters if specified
//         if (requestedYear !== null && year !== requestedYear) continue;
//         if (requestedSpecialty !== null && specialty !== requestedSpecialty) continue;

//         // Get theme selections for this group
//         const selections = await ThemeSelection.find({ group_id: group._id }).lean();

//         // Build year/specialty structure
//         if (!result[year]) {
//           result[year] = {
//             annee_etude: year,
//             specialites: {}
//           };
//         }

//         if (!result[year].specialites[specialty]) {
//           result[year].specialites[specialty] = {
//             specialite: specialty,
//             groupes: []
//           };
//         }

//         // Add group data with theme choices
//         result[year].specialites[specialty].groupes.push({
//           group_id: group._id,
//           group_name: group.name,
//           chef: {
//             id: chef.id,
//             nom_complet: `${chef.prenom} ${chef.nom}`,
//             email: chef.email
//           },
//           members: membersDetails.map(m => ({
//             id: m.id,
//             nom_complet: `${m.prenom} ${m.nom}`
//           })),
//           theme_selections: selections.map(sel => ({
//             user_id: sel.user_id,
//             choices: sel.choices,
//             status: sel.status,
//             submitted_at: sel.submitted_at
//           }))
//         });

//       } catch (error) {
//         console.error(`Error processing group ${group._id}:`, error.message);
//       }
//     }

//     // 5. Format final response
//     const formattedResult = Object.values(result).map(yearData => ({
//       annee_etude: yearData.annee_etude,
//       specialites: Object.values(yearData.specialites)
//     }));

//     res.json({
//       success: true,
//       count: formattedResult.reduce((total, year) => 
//         total + year.specialites.reduce((sum, spec) => sum + spec.groupes.length, 0), 0),
//       data: formattedResult
//     });

//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });
// app.post("/api/theme-selection/save-choices", verifyJWT, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { p1, p2, p3, submit = false } = req.body;

//     // Input Validation
//     if (![p1, p2, p3].every((choice) => typeof choice === "number")) {
//       return res.status(400).json({
//         success: false,
//         error: "All theme IDs must be numbers",
//         invalid: {
//           p1: typeof p1 !== "number",
//           p2: typeof p2 !== "number",
//           p3: typeof p3 !== "number",
//         },
//       });
//     }

//     // Unique Choices Validation
//     const choices = [p1, p2, p3];
//     if (new Set(choices).size !== 3) {
//       const duplicates = choices.filter(
//         (id, index) => choices.indexOf(id) !== index
//       );
//       return res.status(400).json({
//         success: false,
//         error: "All choices must be unique",
//         duplicates,
//       });
//     }

//     // Theme Existence Validation
//     const service2Url = await discoverService2();
//     const themeValidation = await Promise.all(
//       choices.map(async (themeId) => {
//         try {
//           const response = await axios.get(`${service2Url}/themes/${themeId}`, {
//             headers: { Authorization: req.headers.authorization },
//             timeout: 3000,
//           });
//           return { valid: true, data: response.data };
//         } catch (error) {
//           return {
//             valid: false,
//             themeId,
//             error:
//               error.response?.status === 404
//                 ? "Theme not found"
//                 : "Validation failed",
//           };
//         }
//       })
//     );

//     const invalidThemes = themeValidation.filter((result) => !result.valid);
//     if (invalidThemes.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Invalid theme selections",
//         invalidThemes,
//       });
//     }

//     // Database Operation
//     const updateData = {
//       choices: { p1, p2, p3 },
//       status: submit ? "submitted" : "draft",
//     };

//     if (submit) {
//       updateData.submitted_at = new Date();
//     }

//     const selection = await ThemeSelection.findOneAndUpdate(
//       { user_id: userId },
//       updateData,
//       {
//         upsert: true,
//         new: true,
//         runValidators: true,
//       }
//     );

//     // Success Response
//     res.json({
//       success: true,
//       message: submit ? "Theme selections submitted" : "Draft saved",
//       data: {
//         selection,
//         validatedThemes: themeValidation.map((t) => ({
//           id: t.valid ? t.data.id : t.themeId,
//           valid: t.valid,
//         })),
//       },
//     });
//   } catch (error) {
//     console.error("Theme selection error:", {
//       userId: req.user.id,
//       error: error.message,
//       stack: error.stack,
//     });

//     res.status(500).json({
//       success: false,
//       error: "Internal server error",
//       ...(process.env.NODE_ENV === "development" && {
//         details: error.message,
//       }),
//     });
//   }
// });




// // Ton endpoint pour soumettre les choix de thème
// app.post("/api/theme-selection/submit", verifyJWT, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { groupId, p1, p2, p3 } = req.body;

//     if (!groupId) {
//       return res.status(400).json({
//         success: false,
//         error: "Group ID is required",
//       });
//     }

//     // Vérifier si l'utilisateur est chef du groupe
//     const userGroup = await Group.findById(groupId);

//     if (!userGroup) {
//       return res.status(404).json({
//         success: false,
//         error: "Groupe introuvable",
//       });
//     }

//     if (userGroup.chef_id !== userId) {
//       return res.status(403).json({
//         success: false,
//         error: "Seul le chef de groupe peut soumettre la sélection",
//       });
//     }

//     // Vérifier que p1, p2, p3 sont présents
//     if (![p1, p2, p3].every((choice) => typeof choice === "number")) {
//       return res.status(400).json({
//         success: false,
//         error: "Toutes les sélections doivent être des numéros",
//       });
//     }

//     // Vérifier unicité des choix
//     const choices = [p1, p2, p3];
//     if (new Set(choices).size !== 3) {
//       return res.status(400).json({
//         success: false,
//         error: "Les sélections doivent être uniques",
//       });
//     }

//     // Créer ou mettre à jour la sélection
//     const selection = await ThemeSelection.findOneAndUpdate(
//       { user_id: userId },
//       {
//         user_id: userId,
//         group_id: groupId,
//         choices: { p1, p2, p3 },
//         status: "submitted",
//         submitted_at: new Date(),
//       },
//       { upsert: true, new: true, runValidators: true }
//     );

//     res.json({
//       success: true,
//       message: "Sélections soumises avec succès",
//       data: selection,
//     });

//   } catch (error) {
//     console.error("Erreur de soumission:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//       details:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });



// app.get("/api/groups/chef-theme-choices", verifyJWT, async (req, res) => {
//   try {
//     const groups = await Group.find();
//     const chefIds = groups.map(group => group.chef_id);

//     const chefsSelections = await ThemeSelection.find({
//       user_id: { $in: chefIds },
//     });

//     const groupsWithChefChoices = groups.map((group) => {
//       const chefSelection = chefsSelections.find(sel => sel.user_id === group.chef_id);

//       return {
//         group_id: group._id,
//         group_name: group.name,
//         chef_id: group.chef_id, // <- toujours retourner le chef_id
//         chef_choices: {
//           p1: chefSelection?.p1 ?? null,
//           p2: chefSelection?.p2 ?? null,
//           p3: chefSelection?.p3 ?? null,
//         }
//       };
//     });

//     res.json(groupsWithChefChoices);
//   } catch (error) {
//     console.error("Erreur récupération choix des chefs:", error);
//     res.status(500).json({ error: "Erreur serveur", details: error.message });
//   }
// });
// app.post("/api/groups/:id/recalculate-average", verifyJWT, async (req, res) => {
//   try {
//     const newAverage = await updateGroupAverage(req.params.id);
//     res.json({
//       success: true,
//       group_id: req.params.id,
//       nouvelle_moyenne: newAverage
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Erreur de calcul" });
//   }
// });

// // Endpoint pour récupérer les moyennes de tous les groupes
// app.get("/api/groups/averages", verifyJWTAnyUser, async (req, res) => {
//   try {
//     const allGroups = await Group.find({});
    
//     const groupsWithAverages = await Promise.all(
//       allGroups.map(async (group) => {
//         const moyenne = await calculateGroupAverage(group._id, req);  // On passe req
        
//         return {
//           group_id: group._id,
//           group_name: group.name,
//           chef_id: group.chef_id,
//           annee_academique: group.annee_academique_id || 'Non spécifiée',
//           member_count: group.members?.length || 0,
//           moyenne_groupe: moyenne,
//           last_updated: group.updatedAt
//         };
//       })
//     );

//     res.json({
//       success: true,
//       count: groupsWithAverages.length,
//       data: groupsWithAverages
//     });
//   } catch (error) {
//     console.error("Erreur complète:", error);
//     res.status(500).json({
//       success: false,
//       error: "Erreur serveur",
//       details: process.env.NODE_ENV === 'development' ? error.message : null
//     });
//   }
// });
// //URI personaliser:
// async function getMembersDetails(memberIds, djangoUrl, authHeader) {
//   try {
//     const results = await Promise.all(
//       memberIds.map(async id => {
//         try {
//           const { data } = await axios.get(`${djangoUrl}/etudiants/${id}/`, {
//             headers: { Authorization: authHeader },
//             timeout: 3000
//           });
//           return data;
//         } catch (error) {
//           console.error(`Failed to fetch member ${id}:`, error.message);
//           return null;
//         }
//       })
//     );
//     return results.filter(Boolean); // Remove null/undefined
//   } catch (error) {
//     console.error("Error in getMembersDetails:", error);
//     return [];
//   }
// }
// //get groups by annesetude:(optional)
// // ex:/api/groups/by-study-year?annee_etude=3 ou /api/groups/by-study-year pour recupere tous les group qlqe soit l'annee d'etude

// async function calculateGroupAverage2(memberIds, djangoUrl, authHeader) {
//   try {
//     let total = 0;
//     let count = 0;

//     await Promise.all(memberIds.map(async (memberId) => {
//       try {
//         const response = await axios.get(`${djangoUrl}/etudiants/${memberId}/`, {
//           headers: { 
//             Authorization: authHeader,
//             'Content-Type': 'application/json'
//           }
//         });

//         const moyenne = parseFloat(response.data?.moyenne_etudiant);
//         if (!isNaN(moyenne)) {
//           total += moyenne;
//           count++;
//         }
//       } catch (error) {
//         console.error(`Error fetching student ${memberId}:`, error.message);
//       }
//     }));

//     return count > 0 ? parseFloat((total / count).toFixed(2)) : null;
//   } catch (error) {
//     console.error("Error in calculateGroupAverage:", error);
//     return null;
//   }
// }
// app.get("/api/groups/by-study-year", verifyJWTAnyUser, async (req, res) => {
//   try {
//     const requestedYear = req.query.annee_etude ? Number(req.query.annee_etude) : null;
//     console.log(`Requested year: ${requestedYear}`);

//     const allGroups = await Group.find({}).lean();
//     console.log(`Found ${allGroups.length} groups`);
//     if (!allGroups.length) return res.json({ success: true, data: [] });

//     const djangoUrl = await discoverDjangoService();
//     if (!djangoUrl) throw new Error("Django service unavailable");

//     const result = {};
    
//     for (const group of allGroups) {
//       try {
//         console.log(`Processing group ${group._id}`);
        
//         // Get all member details first
//         const membersDetails = await getMembersDetails(
//           group.members,
//           djangoUrl,
//           req.headers.authorization
//         );

//         if (!membersDetails.length) {
//           console.log(`Group ${group._id} has no valid members`);
//           continue;
//         }

//         const chef = membersDetails.find(m => m.id === group.chef_id) || membersDetails[0];
//         const year = typeof chef.annee_etude === 'number' ? chef.annee_etude : null;

//         // Skip if filtering by year and no match
//         if (requestedYear !== null && year !== requestedYear) {
//           console.log(`Skipping group ${group._id} (year: ${year}, wanted: ${requestedYear})`);
//           continue;
//         }

//         // Calculate average using your existing logic
//         const moyenne = await calculateGroupAverage2(
//           group.members,
//           djangoUrl,
//           req.headers.authorization
//         );

//         // Initialize year entry if needed
//         if (!result[year]) {
//           result[year] = {
//             annee_etude: year,
//             groupes: []
//           };
//         }

//         // Add group data
//         result[year].groupes.push({
//           id: group._id,
//           nom: group.name,
//           chef: {
//             id: chef.id,
//             nom_complet: `${chef.prenom} ${chef.nom}`,
//             email: chef.email
//           },
//           specialite: chef.specialite || null,
//           nombre_membres: membersDetails.length,
//           moyenne_groupe: moyenne,
//           date_creation: group.created_at
//         });

//       } catch (error) {
//         console.error(`Error processing group ${group._id}:`, error.message);
//       }
//     }

//     // Format and sort the response
//     const formattedResult = Object.values(result)
//       .filter(yearData => yearData.groupes.length > 0) // Remove empty years
//       .sort((a, b) => {
//         if (a.annee_etude === null) return 1;
//         if (b.annee_etude === null) return -1;
//         return a.annee_etude - b.annee_etude;
//       });

//     console.log(`Final result contains ${formattedResult.length} year(s) with data`);
//     res.json({ 
//       success: true, 
//       data: formattedResult 
//     });

//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });
// // Get all groups:
// // GET /api/groups/by-study-year-specialty

// // Filter by year 1:
// // GET /api/groups/by-study-year-specialty?annee_etude=1

// // Filter by specialty 2:
// // GET /api/groups/by-study-year-specialty?specialite=1

// // Filter by year 1 AND specialty 2:
// // GET /api/groups/by-study-year-specialty?annee_etude=1&specialite=1
// app.get("/api/groups/by-study-year-specialty", verifyJWTAnyUser, async (req, res) => {
//   try {
//     // 1. Extract query parameters
//     const requestedYear = req.query.annee_etude ? Number(req.query.annee_etude) : null;
//     const requestedSpecialty = req.query.specialite ? Number(req.query.specialite) : null;
    
//     console.log(`Requested filters - Year: ${requestedYear}, Specialty: ${requestedSpecialty}`);

//     // 2. Fetch all groups
//     const allGroups = await Group.find({}).lean();
//     console.log(`Found ${allGroups.length} groups`);
//     if (!allGroups.length) {
//       return res.json({ 
//         success: true, 
//         data: [],
//         message: "No groups found" 
//       });
//     }

//     // 3. Discover Django service
//     const djangoUrl = await discoverDjangoService();
//     if (!djangoUrl) throw new Error("Django service unavailable");

//     // 4. Process groups
//     const result = {};
    
//     for (const group of allGroups) {
//       try {
//         // Get member details
//         const membersDetails = await getMembersDetails(
//           group.members,
//           djangoUrl,
//           req.headers.authorization
//         );

//         if (!membersDetails.length) {
//           console.log(`Group ${group._id} has no valid members`);
//           continue;
//         }

//         const chef = membersDetails.find(m => m.id === group.chef_id) || membersDetails[0];
//         const year = typeof chef.annee_etude === 'number' ? chef.annee_etude : null;
//         const specialty = typeof chef.specialite === 'number' ? chef.specialite : null;

//         // Skip if filtering by year and no match
//         if (requestedYear !== null && year !== requestedYear) {
//           continue;
//         }

//         // Skip if filtering by specialty and no match
//         if (requestedSpecialty !== null && specialty !== requestedSpecialty) {
//           continue;
//         }

//         // Calculate group average
//         const average = await calculateGroupAverage2(
//           group.members,
//           djangoUrl,
//           req.headers.authorization
//         );

//         // Initialize year entry if needed
//         if (!result[year]) {
//           result[year] = {
//             annee_etude: year,
//             specialites: {}
//           };
//         }

//         // Initialize specialty entry if needed
//         if (!result[year].specialites[specialty]) {
//           result[year].specialites[specialty] = {
//             specialite: specialty,
//             groupes: []
//           };
//         }

//         // Add group to results
//         result[year].specialites[specialty].groupes.push({
//           id: group._id,
//           nom: group.name,
//           chef: {
//             id: chef.id,
//             nom_complet: `${chef.prenom} ${chef.nom}`,
//             email: chef.email
//           },
//           nombre_membres: membersDetails.length,
//           moyenne_groupe: average,
//           date_creation: group.created_at
//         });

//       } catch (error) {
//         console.error(`Error processing group ${group._id}:`, error.message);
//       }
//     }

//     // 5. Format the response
//     const formattedResult = Object.values(result).map(yearData => ({
//       annee_etude: yearData.annee_etude,
//       specialites: Object.values(yearData.specialites)
//     })).filter(year => year.specialites.length > 0);

//     console.log(`Found data for ${formattedResult.length} year(s)`);
//     res.json({
//       success: true,
//       data: formattedResult
//     });

//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });
// // server.js (ou app.js)


// process.on("SIGINT", () => {
//   console.log("Déconnexion de Eureka...");
//   eurekaClient.stop(() => {
//     console.log("Client Eureka déconnecté");
//     process.exit();
//   });
// });

// // Démarrage serveur
// eurekaClient.start((error) => {
//   console.log(error || "Node service registered with Eureka");

//   app.listen(PORT, () => {
//     console.log(`Serveur Node.js en écoute sur le port ${PORT}`);
//     console.log(`Configuration JWT: ${JWT_SECRET.substring(0, 10)}...`);
//     console.log(`URL Django par défaut: ${DJANGO_API_URL}`);
//   });
// });




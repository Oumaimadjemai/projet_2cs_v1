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

    // Database Operation
    const updateData = {
      choices: { p1, p2, p3 },
      status: submit ? "submitted" : "draft",
    };

//     if (submit) {
//       updateData.submitted_at = new Date();
//     }

    const selection = await ThemeSelection.findOneAndUpdate(
      { user_id: userId },
      updateData,
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    // Success Response
    res.json({
      success: true,
      message: submit ? "Theme selections submitted" : "Draft saved",
      data: {
        selection,
        validatedThemes: themeValidation.map((t) => ({
          id: t.valid ? t.data.id : t.themeId,
          valid: t.valid,
        })),
      },
    });
  } catch (error) {
    console.error("Theme selection error:", {
      userId: req.user.id,
      error: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: "Internal server error",
      ...(process.env.NODE_ENV === "development" && {
        details: error.message,
      }),
    });
  }
});

app.post("/api/theme-selection/submit", verifyJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // Vérifier si l'utilisateur est chef de groupe
    const userGroup = await Group.findOne({
      $or: [{ chef_id: userId }, { members: userId }],
    });

    if (!userGroup) {
      return res.status(403).json({
        success: false,
        error: "Vous ne faites partie d'aucun groupe",
      });
    }

    if (userGroup.chef_id !== userId) {
      return res.status(403).json({
        success: false,
        error: "Seul le chef de groupe peut soumettre les sélections",
      });
    }

    // Trouver la sélection existante
    let selection = await ThemeSelection.findOne({ user_id: userId });

    // Si aucune sélection existante, vérifier le corps de la requête
    if (!selection) {
      const { p1, p2, p3 } = req.body;

      if (!p1 || !p2 || !p3) {
        return res.status(400).json({
          success: false,
          error: "Aucun brouillon existant et aucune sélection fournie",
        });
      }

      // Créer une nouvelle soumission
      selection = await ThemeSelection.create({
        user_id: userId,
        choices: { p1, p2, p3 },
        status: "submitted",
        submitted_at: new Date(),
      });

      return res.json({
        success: true,
        message: "Sélections soumises avec succès",
        data: selection,
      });
    }

    // Validation pour les sélections existantes
    if (
      !selection.choices.p1 ||
      !selection.choices.p2 ||
      !selection.choices.p3
    ) {
      return res.status(400).json({
        success: false,
        error: "Sélections incomplètes",
        missing: [
          !selection.choices.p1 && "P1",
          !selection.choices.p2 && "P2",
          !selection.choices.p3 && "P3",
        ].filter(Boolean),
      });
    }

    if (selection.status === "submitted") {
      return res.status(400).json({
        success: false,
        error: "Sélections déjà soumises",
        submitted_at: selection.submitted_at,
      });
    }

    // Mettre à jour la sélection existante
    selection.status = "submitted";
    selection.submitted_at = new Date();
    await selection.save();

    res.json({
      success: true,
      message: "Sélections soumises avec succès",
      data: selection,
    });
  } catch (error) {
    console.error("Erreur de soumission:", error);
    res.status(500).json({
      success: false,
      error: "Échec de la soumission",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// server.js (ou app.js)
app.get("/api/theme-selection/submissions", verifyJWT, async (req, res) => {
  const submissions = await ThemeSelection.find({ status: "submitted" });
  // renvoie [{ user_id, choices: { p1,p2,p3 } }, …]
  res.json(submissions);
});

process.on("SIGINT", () => {
  console.log("Déconnexion de Eureka...");
  eurekaClient.stop(() => {
    console.log("Client Eureka déconnecté");
    process.exit();
  });
});

// // Démarrage serveur
// eurekaClient.start((error) => {
//   console.log(error || "Node service registered with Eureka");

//   app.listen(PORT, () => {
//     console.log(`Serveur Node.js en écoute sur le port ${PORT}`);
//     console.log(`Configuration JWT: ${JWT_SECRET.substring(0, 10)}...`);
//     console.log(`URL Django par défaut: ${DJANGO_API_URL}`);
//   });
// });




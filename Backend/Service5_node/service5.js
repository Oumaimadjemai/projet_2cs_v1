
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const axios = require('axios');
const { Eureka } = require('eureka-js-client');

const app = express();
const PORT = process.env.PORT || 5005;

// ======================
// 1. Eureka Configuration
// ======================
const eurekaClient = new Eureka({
  instance: {
    app: 'SERVICE5',
    instanceId: `SERVICE5:${PORT}`,
    hostName: 'service5_node', // must match container_name or service name in Docker
    ipAddr: 'service5_node',   // Docker internal DNS name
    statusPageUrl: `http://service5:${PORT}/info`,
    healthCheckUrl: `http://service5:${PORT}/health`,
    port: {
      '$': PORT,
      '@enabled': true,
    },
    vipAddress: 'SERVICE5',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
    registerWithEureka: true,
    fetchRegistry: true,
  },
  eureka: {
    host: process.env.EUREKA_HOST || 'registry', // match Eureka service name
    port: process.env.EUREKA_PORT || 8761,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});
eurekaClient.start();
function getServiceInstanceUrl(serviceName) {
  const instances = eurekaClient.getInstancesByAppId(serviceName);
  if (!instances || instances.length === 0) {
    throw new Error(`${serviceName} not found in Eureka`);
  }
  // Exemple : prendre la première instance (load balancing possible)
  const instance = instances[0];
  return `http://${instance.hostName}:${instance.port.$}`;
}

async function discoverService(serviceName) {
  try {
    const res = await axios.get(`http://${process.env.EUREKA_HOST}:${process.env.EUREKA_PORT}/eureka/apps/${serviceName}`);
    const instance = res.data.application.instance;

    const instanceInfo = Array.isArray(instance) ? instance[0] : instance;
    const hostName = instanceInfo.ipAddr || instanceInfo.hostName;
    const port = instanceInfo.port['$'];

    return `http://${hostName}:${port}`;
  } catch (error) {
    console.error(`Erreur découverte service ${serviceName}:`, error.message);
    throw new Error(`Impossible de résoudre le service ${serviceName}`);
  }
}
// ======================
// 2. Express Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ======================
// 3. MongoDB Connection
// ======================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/service5_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ======================
// 4. Multer Configuration
// ======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ======================
// 5. Mongoose Models
// ======================
const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: false },
  description: String,
  fileUrl: { type: String, required: true },
  status: { 
    type: String, 
    default: 'en attente',
    enum: ['en attente', 'valide', 'refuse']
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.Mixed, required: true },
  
  teacherId: { type: String, required: true },
  note: { type: String, default: '' }
});
const Document = mongoose.model('Document', DocumentSchema);

const rendezVousSchema = new mongoose.Schema({
  groupeId: { type: String, required: true },
  salle: { type: String, required: true },
  heure: { type: String, required: true },
  minutes: { type: String, required: true },
  ampm: { type: String, required: true },
  date: { type: String, required: true },
  jour: { type: String, required: true },
  enseignantId: { type: Number, required: true } 

}, { timestamps: true });
const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

// ======================
// 6. JWT Middleware
// ======================
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    req.token = token; // Save token for Django check later
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: "Authorization header missing" });
  }
};
const authenticateEtudiant = async (req, res, next) => {
  try {
////c quoi api/is-etudiant
    const service1Url = await discoverService(SERVICE1_NAME); 
    const verify = await axios.get(`${service1Url}/api/is-etudiant/`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    if (!verify.data.is_etudiant) {
      return res.status(403).json({ error: "Vérification externe échouée : accès refusé" });
    }

    next();
  } catch (err) {
    console.error("Erreur middleware authenticateEtudiant:", err);
    const message = err.response?.data?.error || err.message;
    res.status(500).json({ error: "Erreur de vérification étudiant", detail: message });
  }
};

module.exports = authenticateEtudiant;

const authenticateTeacherJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(' ')[1];
  req.token = token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Appel à Service 1 pour vérifier si c'est un enseignant
    const service1Url = await discoverService(SERVICE1_NAME); 
    const response = await axios.get(`${service1Url}/api/verify-enseignant/`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.data.is_enseignant) {
      return res.status(403).json({ error: "Only teachers can access this resource" });
    }

    req.user = {
      ...decoded,
      user_id: response.data.user_id,
    };

    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};


// ======================
// 7. API Endpoints
// ======================
app.post('/api/create-document', authenticateJWT, upload.single('document'), async (req, res) => {
  try {
    const { SERVICE1_NAME, SERVICE3_NAME } = process.env;

    // Découvrir le Service 1 (Django)
    const service1Url = await discoverService(SERVICE1_NAME); // SERVICE1-CLIENT
    const verifyEtudiant = await axios.get(`${service1Url}/api/is-etudiant/`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    if (!verifyEtudiant.data.is_etudiant) {
      return res.status(403).json({ error: "Only students can submit documents" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File and title are required" });
    }

    // Découvrir le Service 3 (groupes)
    const service3Url = await discoverService(SERVICE3_NAME); // SERVICE3-NODE
    const groupsResponse = await axios.get(`${service3Url}/api/groups/user`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    const userGroups = groupsResponse.data;
    if (!userGroups.length) {
      return res.status(400).json({ error: "User does not belong to any group" });
    }

    const groupId = userGroups[0]._id;

    // Service 4 est encore en localhost ici (tu peux aussi le rendre dynamique plus tard)
    const encadrantResponse = await axios.get(`http://localhost:8003/encadrant-by-group/${groupId}`);
    const encadrantId = encadrantResponse.data.encadrant_id;

    if (!encadrantId) {
      return res.status(400).json({ error: "No encadrant found for the group" });
    }

    // Création du document
    const newDoc = new Document({
      title: req.body.title,
      description: req.body.description || '',
      fileUrl: `/uploads/${req.file.filename}`,
      status: 'en attente',
      createdBy: req.user.user_id,
      teacherId: encadrantId,
      note: req.body.note || '',
    });

    await newDoc.save();
    res.status(201).json(newDoc);

  } catch (error) {
    console.error("Error in document creation:", error);
    const message = error.response?.data?.error || error.message;
    res.status(500).json({ error: "Failed to create document", detail: message });
  }
});

// app.post('/api/create-document', authenticateJWT, upload.single('document'), async (req, res) => {
//   try {
//     // Vérifier si l'utilisateur est un étudiant via Django (service 1)
//     const verifyEtudiant = await axios.get('http://localhost:8000/api/is-etudiant/', {
//       headers: { Authorization: `Bearer ${req.token}` }
//     });
//     if (!verifyEtudiant.data.is_etudiant) {
//       return res.status(403).json({ error: "Only students can submit documents" });
//     }

//     if (!req.file || !req.body.title) {
//       return res.status(400).json({ error: "File and title are required" });
//     }

//     // 1. Récupérer les groupes du user via Service 3
//     const groupsResponse = await axios.get('http://localhost:3000/api/groups/user', {
//       headers: { Authorization: `Bearer ${req.token}` }
//     });
//     const userGroups = groupsResponse.data;

//     if (!userGroups.length) {
//       return res.status(400).json({ error: "User does not belong to any group" });
//     }

//     // 2. Récupérer le group_id du premier groupe
//     const groupId = userGroups[0]._id;

//     // 3. Récupérer l'encadrant depuis Service 4
//     const encadrantResponse = await axios.get(`http://localhost:8003/encadrant-by-group/${groupId}`);

//     const encadrantId = encadrantResponse.data.encadrant_id;

//     if (!encadrantId) {
//       return res.status(400).json({ error: "No encadrant found for the group" });
//     }

//     // 4. Créer le document avec l'encadrant comme teacherId
    
//     const newDoc = new Document({
//       title: req.body.title,
//       description: req.body.description || '',
//       fileUrl: `/uploads/${req.file.filename}`,
//       status: 'en attente',
//       createdBy: req.user.user_id,
  
//       teacherId: encadrantId,
//       note: req.body.note || '',
//     });

//     await newDoc.save();
//     res.status(201).json(newDoc);

//   } catch (error) {
//     console.error("Error in document creation:", error);
//     const message = error.response?.data?.error || error.message;
//     res.status(500).json({ error: "Failed to create document", detail: message });
//   }
// });

// app.get('/api/groups/:group_id/documents', authenticateJWT, async (req, res) => {
//   try {
//     const { group_id } = req.params;

//     // URL du service groupe
//     const groupServiceUrl = 'http://localhost:3000';

//     // Appel pour récupérer les membres
//     const membersResponse = await axios.get(`${groupServiceUrl}/api/groups/${group_id}/members`, {
//       headers: { Authorization: req.headers.authorization },
//     });

//     if (!membersResponse.data.success) {
//       return res.status(404).json({ error: 'Membres du groupe non trouvés' });
//     }

//     const members = membersResponse.data.members;
//     const memberIds = members.map(m => m.id);

//     // Rechercher documents dont createdBy est dans memberIds
//     const documents = await Document.find({ createdBy: { $in: memberIds } }).lean();

//     // Construire map id -> "nom prenom"
//     const idToNomPrenom = {};
//     members.forEach(m => {
//       idToNomPrenom[m.id] = `${m.nom} ${m.prenom}`;
//     });

//     const documentsWithCreator = documents.map(doc => ({
//       _id: doc._id,
//       title: doc.title,
//       status: doc.status,
//       fileUrl: doc.fileUrl,
//       createdBy: doc.createdBy,
//       etudiantNom: idToNomPrenom[doc.createdBy] || 'Étudiant inconnu',
//     }));

//     res.json({ success: true, documents: documentsWithCreator });
//   } catch (error) {
//     console.error('Erreur récupération documents du groupe:', error.message);
//     res.status(500).json({ error: 'Erreur serveur' });
//   }
// });


// app.get('/api/etudiant/mes-documents', authenticateJWT, authenticateEtudiant, async (req, res) => {
//   try {
//     const documents = await Document.find({ createdBy: req.user.user_id }); // 🔍
//     res.status(200).json(documents);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });
app.get('/api/groups/:group_id/documents', authenticateJWT, async (req, res) => {
  try {
    const { group_id } = req.params;

    // Découverte dynamique de SERVICE3-NODE (service des groupes)
    const groupServiceUrl = await discoverService(process.env.SERVICE3_NAME); // SERVICE3-NODE

    // Appel pour récupérer les membres
    const membersResponse = await axios.get(`${groupServiceUrl}/api/groups/${group_id}/members`, {
      headers: { Authorization: req.headers.authorization },
    });

    if (!membersResponse.data.success) {
      return res.status(404).json({ error: 'Membres du groupe non trouvés' });
    }

    const members = membersResponse.data.members;
    const memberIds = members.map(m => m.id);

    const documents = await Document.find({ createdBy: { $in: memberIds } }).lean();

    const idToNomPrenom = {};
    members.forEach(m => {
      idToNomPrenom[m.id] = `${m.nom} ${m.prenom}`;
    });

    const documentsWithCreator = documents.map(doc => ({
      _id: doc._id,
      title: doc.title,
      status: doc.status,
      fileUrl: doc.fileUrl,
      createdBy: doc.createdBy,
      etudiantNom: idToNomPrenom[doc.createdBy] || 'Étudiant inconnu',
    }));

    res.json({ success: true, documents: documentsWithCreator });
  } catch (error) {
    console.error('Erreur récupération documents du groupe:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// Changer le statut d'un document (valider / refuser / en attente)
app.post('/api/enseignant/document/:id/status', authenticateTeacherJWT, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const allowed = ['valide', 'refuse', 'en attente'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const doc = await Document.findOne({ _id: req.params.id, teacherId: req.user.user_id });
    if (!doc) return res.status(404).json({ error: "Document non trouvé ou non autorisé" });

    doc.status = status;

    // Si refus, enregistrer un motif (optionnel)
    if (status === 'refuse') {
      doc.reason = reason || "Aucun motif spécifié";
    } else {
      doc.reason = ""; // Reset reason
    }

    await doc.save();
    res.status(200).json({ message: `Document marqué comme '${status}'`, doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//docs en ettente
app.get('/api/enseignant/documents/en-attente', authenticateTeacherJWT, async (req, res) => {
  try {
    const documents = await Document.find({ status: 'en attente', teacherId: req.user.user_id });
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// docs valides 
app.get('/api/enseignant/documents/valides', authenticateTeacherJWT, async (req, res) => {
  try {
    const documents = await Document.find({ status: 'valide', teacherId: req.user.user_id });
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//docs refuser
app.get('/api/enseignant/documents/refuses', authenticateTeacherJWT, async (req, res) => {
  try {
    const documents = await Document.find({ status: 'refuse', teacherId: req.user.user_id });
    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//////pdfs
app.get('/api/enseignant/documents/en-attente/pdfs', authenticateTeacherJWT, async (req, res) => {
  try {
    const documents = await Document.find(
      { status: 'en attente', teacherId: req.user.user_id },
      'fileUrl'
    );
    res.status(200).json({ pdfs: documents.map(doc => doc.fileUrl) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/enseignant/documents/valides/pdfs', authenticateTeacherJWT, async (req, res) => {
  try {
    const documents = await Document.find(
      { status: 'valide', teacherId: req.user.user_id },
      'fileUrl'
    );
    res.status(200).json({ pdfs: documents.map(doc => doc.fileUrl) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/enseignant/documents/refuses/pdfs', authenticateTeacherJWT, async (req, res) => {
  try {
    const documents = await Document.find(
      { status: 'refuse', teacherId: req.user.user_id },
      'fileUrl'
    );
    res.status(200).json({ pdfs: documents.map(doc => doc.fileUrl) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// PUT /api/documents/:id/note
app.put('/api/enseignant/document/:id/note', authenticateTeacherJWT, async (req, res) => {
  try {
    const documentId = req.params.id;
    const { note } = req.body;

    if (typeof note !== 'string') {
      return res.status(400).json({ error: "Note must be a string" });
    }

    // Chercher le document par id
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Vérifier que l'enseignant est bien l'encadrant du document
    if (document.teacherId !== req.user.user_id) {
      return res.status(403).json({ error: "You are not authorized to update this document's note" });
    }

    // Mettre à jour la note
    document.note = note;

    await document.save();

    res.json({ message: "Note updated successfully", document });

  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});


app.post('/api/enseignant/document/:id/note', authenticateTeacherJWT, async (req, res) => {
  try {
    const { note } = req.body;

    // Vérification basique
    if (typeof note !== 'string' || note.trim() === '') {
      return res.status(400).json({ error: "La note doit être une chaîne de caractères non vide." });
    }

    // Vérifier si le document existe et appartient à l'enseignant
    const doc = await Document.findOne({ _id: req.params.id, teacherId: req.user.user_id });

    if (!doc) {
      return res.status(404).json({ error: "Document non trouvé ou vous n'avez pas le droit de le modifier." });
    }

    // Mettre à jour la note
    doc.note = note.trim();
    await doc.save();

    return res.status(200).json({
      message: "Remarque enregistrée avec succès",
      document: {
        id: doc._id,
        title: doc.title,
        note: doc.note,
        status: doc.status
      }
    });

  } catch (err) {
    console.error("Erreur lors de l'ajout de note:", err);
    return res.status(500).json({ error: "Erreur serveur", detail: err.message });
  }
});



app.post('/api/enseignant/rendez-vous/:groupId', authenticateTeacherJWT, async (req, res) => {
  const { salle, heure, minutes, ampm, date, jour } = req.body;
  const { groupId } = req.params;
  const enseignantId = req.user.user_id;

  if (!salle || !heure || !minutes || !ampm || !date || !jour) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    console.log('Token envoyé à Service 4:', req.token);
    
    const verifyUrl = `http://localhost:8003/encadreur/group/${groupId}`;
    const response = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    if (!response.data.authorized) {
      return res.status(403).json({ error: "Vous n'êtes pas l'encadrant de ce groupe." });
    }

    const rdv = new RendezVous({
      groupeId: groupId,
      salle,
      heure,
      minutes,
      ampm,
      date,
      jour,
      enseignantId
    });

    await rdv.save();

    res.status(201).json({ message: "Rendez-vous créé avec succès", rdv });

  } catch (error) {
    console.error(error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }
    res.status(500).json({ error: "Erreur lors de la création du rendez-vous." });
  }
});
// GET /api/enseignant/rendez-vous/:groupId
app.get('/api/enseignant/rendez-vous/:groupId', authenticateTeacherJWT, async (req, res) => {
  const { groupId } = req.params;
  const enseignantId = req.user.user_id;

  try {
    // Vérifier que l'enseignant encadre ce groupe via Service 4
    const verifyUrl = `http://localhost:8003/encadreur/group/${groupId}`;
    const response = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    if (!response.data.authorized) {
      return res.status(403).json({ error: "Vous n'êtes pas l'encadrant de ce groupe." });
    }

    // Récupérer les rendez-vous pour ce groupe et cet enseignant
    const rdvs = await RendezVous.find({ groupeId: groupId, enseignantId: enseignantId });

    res.status(200).json({ rendezvous: rdvs });

  } catch (error) {
    console.error(error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous." });
  }
});

// // Route for student to get rendezvous of their groups
// app.get('/api/etudiant/rendezvous', authenticateJWT, async (req, res) => {
//   try {
//     // Call Service 3 to get groups for this user
//     const groupsResponse = await axios.get('http://localhost:3000/api/groups/user', {
//       headers: { Authorization: `Bearer ${req.token}` }
//     });

//     const userGroups = groupsResponse.data;
//     if (!userGroups.length) {
//       return res.status(404).json({ error: "Vous n'appartenez à aucun groupe." });
//     }

//     const groupIds = userGroups.map(g => g._id);

//     // Find rendezvous for these groups
//     const rendezvous = await RendezVous.find({ groupeId: { $in: groupIds } });

//     res.json({ rendezvous });

//   } catch (error) {
//     console.error(error);
//     if (error.response) {
//       return res.status(error.response.status).json({ error: error.response.data });
//     }
//     res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous." });
//   }
// });
app.get('/api/etudiant/rendezvous', authenticateJWT, async (req, res) => {
  try {
    // Découverte dynamique de SERVICE3-NODE
    const service3Url = await discoverService(process.env.SERVICE3_NAME); // SERVICE3-NODE

    // Appel vers /api/groups/user pour cet étudiant
    const groupsResponse = await axios.get(`${service3Url}/api/groups/user`, {
      headers: { Authorization: `Bearer ${req.token}` }
    });

    const userGroups = groupsResponse.data;
    if (!userGroups.length) {
      return res.status(404).json({ error: "Vous n'appartenez à aucun groupe." });
    }

    const groupIds = userGroups.map(g => g._id);

    const rendezvous = await RendezVous.find({ groupeId: { $in: groupIds } });

    res.json({ rendezvous });

  } catch (error) {
    console.error("Erreur récupération rendez-vous:", error.message);
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }
    res.status(500).json({ error: "Erreur lors de la récupération des rendez-vous." });
  }
});

// Health Check Endpoints (Required for Eureka)
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

app.get('/info', (req, res) => {
  res.json({
    service: 'SERVICE5',
    status: 'RUNNING',
    timestamp: new Date()
  });
});

// ======================
// 8. Server Startup
// ======================
app.listen(PORT, async () => {
  console.log(`Service 5 running on port ${PORT}`);
  
  // Start Eureka Client
  eurekaClient.start(error => {
    if (error) {
      console.error('Eureka registration failed:', error);
    } else {
      console.log('Registered with Eureka');
    }
  });
});

// Graceful Shutdown
process.on('SIGINT', () => {
  eurekaClient.stop();
  mongoose.connection.close();
  process.exit();
});


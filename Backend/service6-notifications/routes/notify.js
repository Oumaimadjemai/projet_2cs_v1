const express = require('express');
const router = express.Router();
const NotificationModel = require('../models/Notifications');
const { sendNotification, sendRoleNotification, getIO } = require('../websocket');
const { discoverDjangoService } = require('../services/discovery.service');
const axios = require('axios');
const verifyJWTAnyUser = require('../middlewares/validateToken')

router.post('/notify', async (req, res) => {
  try {
    const { idSender, idReceiver, title, message, type, metadata } = req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        error: "idSender and type are required"
      });
    }

    const notificationData = {
      idSender: idSender || null,
      idReceiver,
      title: title || getDefaultTitle(type),
      message: message || getDefaultMessage(type, metadata),
      type,
      metadata
    };

    switch (type) {
      case 'THEME_DECISION': // Admin → Enseignant
        notificationData.idReceiver = idReceiver;
        notificationData.message = `Votre thème "${metadata?.themeTitle}" a été ${metadata?.decision}`;
        await handleThemeDecision(notificationData);
        break;

      case 'THEME_ASSIGNMENT': // Admin → Étudiant
        notificationData.idReceiver = idReceiver;
        notificationData.message = `Thème assigné: "${metadata?.themeTitle}"`;
        await handleThemeAssignment(notificationData);
        break;

      // case 'GROUP_ASSIGNMENT': // Admin → Groupe
      //   await handleGroupAssignment(notificationData, metadata?.groupId);
      //   break;

      // case 'URGENT_NOTIFICATION': // Admin → Multiple rôles
      //   await handleUrgentNotification(notificationData, metadata?.roles);
      //   break;
      case 'NEW_ENTREPRISE': // Admin → Enseignant
        notificationData.idReceiver = idReceiver;
        notificationData.message = `Votre thème "${metadata?.themeTitle}" a été ${metadata?.decision}`;
        await handleThemeDecision(notificationData);
        break;

      default:
        throw new Error(`Type de notification non supporté: ${type}`);
    }

    res.status(200).json({
      success: true,
      type,
      receiver: idReceiver || 'multiple'
    });

  } catch (error) {
    console.error(`Notification error [${req.body.type}]:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      type: req.body?.type
    });
  }
});


async function handleThemeDecision(data) {

  const notification = await NotificationModel.create(data);
  await notification.save();

  sendNotification(data.idReceiver, {
    ...data,
    actionRequired: false,
    decision: data.metadata.decision
  });

}

async function handleThemeAssignment(data) {

  if (data.metadata?.groupMembers) {
    const notifications = data.metadata.groupMembers.map(member => ({
      ...data,
      idReceiver: member.id,
      message: `[Groupe ${data.metadata.groupName}] ${data.message}`
    }));

    await NotificationModel.insertMany(notifications);

    notifications.forEach(notif => {
      sendNotification(notif.idReceiver, notif);
    });
  } else {
    await NotificationModel.create(data);
    sendNotification(data.idReceiver, data);
  }
}

// async function handleGroupAssignment(data, groupId) {

//   const group = await GroupModel.findById(groupId).populate('members');

//   // 2. Créer une notification pour chaque membre
//   const notifications = group.members.map(member => ({
//     ...data,
//     idReceiver: member._id,
//     message: `[Groupe ${group.name}] ${data.message}`
//   }));

//   await NotificationModel.insertMany(notifications);

//   // 3. Envoyer les notifications
//   notifications.forEach(notif => {
//     sendNotification(notif.idReceiver, notif);
//   });
// }

// async function handleUrgentNotification(data, roles) {
//   // 1. Trouver tous les utilisateurs avec ces rôles
//   const users = await UserModel.find({
//     role: { $in: roles }
//   }).select('_id');

//   // 2. Créer les notifications
//   const notifications = users.map(user => ({
//     ...data,
//     idReceiver: user._id
//   }));

//   await NotificationModel.insertMany(notifications);

//   // 3. Envoyer par rôle
//   roles.forEach(role => {
//     sendRoleNotification(role, {
//       ...data,
//       broadcast: true
//     });
//   });
// }

// Helpers pour les messages par défaut
function getDefaultTitle(type) {
  const titles = {
    'THEME_DECISION': 'Décision sur votre thème',
    'THEME_ASSIGNMENT': 'Nouveau thème assigné',
    'GROUP_ASSIGNMENT': 'Mise à jour de groupe',
    'URGENT_NOTIFICATION': 'Notification importante'
  };
  return titles[type] || 'Nouvelle notification';
}

function getDefaultMessage(type, metadata) {
  switch (type) {
    case 'THEME_DECISION':
      return `Votre thème a été ${metadata?.decision || 'traité'}`;
    case 'THEME_ASSIGNMENT':
      return `Vous avez été assigné à un nouveau thème: ${metadata?.themeTitle || ''}`;
    default:
      return 'Vous avez une nouvelle notification';
  }
}

router.post('/notify-admins', async (req, res) => {
  try {
    // Check if WebSocket is initialized
    if (!getIO()) {
      throw new Error("WebSocket server not ready");
    }

    const { idSender, message, title, type, metadata } = req.body;

    // 1. Get admin list
    const firstServiceUrl = await discoverDjangoService();
    const response = await axios.get(`${firstServiceUrl}/admins/`);
    const admins = response.data;

    const notificationData = {
      role: 'admin',
      message: type === 'CREATION_THEME'
        ? message
        : type === 'urgence'
          ? `URGENT: ${message}`
          : message,
      type: type,
      teacherId: idSender,
      timestamp: new Date()
    };

    const notificationPromises = admins.map(admin => {
      return NotificationModel.create({
        idSender: idSender || null,
        idReceiver: admin.id,
        title: title || `Notification ${type}`,
        message: notificationData.message,
        type: type,
        metadata: metadata
      });
    });

    await Promise.all(notificationPromises);

    if (type === 'CREATION_THEME') {
      sendRoleNotification('admin', {
        ...notificationData,
        actionRequired: true
      });
    } else {
      admins.forEach(admin => {
        sendNotification(admin.id, notificationData);
      });
    }

    res.status(200).json({
      success: true,
      notifiedAdmins: admins.length,
      type: type
    });

  } catch (error) {
    console.error('Error notifying admins:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      type: req.body?.type
    });
  }
});

// Dans votre route /notify-entreprise-demand
router.post('/notify-entreprise-demand', async (req, res) => {
  try {
    console.log("Données reçues:", req.body); // Debug important

    const requiredFields = ['entrepriseNom', 'email', 'telephone'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        throw new Error(`Champ manquant: ${field}`);
      }
    }

    const { entrepriseNom, email, telephone } = req.body;

    let admins = [];
    try {
      const djangoServiceUrl = await discoverDjangoService();
      const response = await axios.get(`${djangoServiceUrl}/admins/`, {
        timeout: 3000
      });
      admins = response.data;
      console.log("Admins récupérés:", admins.length);
    } catch (e) {
      console.error("Erreur récupération admins:", e.message);
    }

    const notificationData = {
      type: 'ENTREPRISE_DEMANDE',
      title: 'Nouvelle demande d\'entreprise',
      metadata: {
        entrepriseNom,
        email,
        telephone,
        demandeDate: new Date().toISOString()
      },
      message: `Nouvelle demande: ${entrepriseNom} (${email})`
    };

    try {
      const { sendSystemNotification } = require('../websocket');
      sendSystemNotification(notificationData);
      console.log("Notification WS envoyée");
    } catch (e) {
      console.error("Erreur WS:", e.message);
    }

    await NotificationModel.create({
      ...notificationData,
      isBroadcast: true,
      receiverType: 'admin'
    });

    res.status(200).json({
      success: true,
      notifiedAdmins: admins.length
    });

  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(400).json({  // Changed from 500 to 400 for client errors
      success: false,
      error: error.message,
      receivedData: req.body // Pour débogage
    });
  }
});

router.patch('/mark-lus', verifyJWTAnyUser, async (req, res) => {
  try {
    const { idNotification, idReceiver } = req.body;

    if (!idNotification || !idReceiver) {
      return res.status(400).json({
        success: false,
        message: 'Both idNotification and idReceiver are required'
      });
    }

    const updatedNotification = await NotificationModel.findOneAndUpdate(
      {
        _id: idNotification,
        idReceiver: idReceiver
      },
      {
        $set: {
          isRead: true
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedNotification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or receiver mismatch'
      });
    }

    return res.status(200).json({
      success: true,
      notification: updatedNotification
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.get('/get_unread_notifications', verifyJWTAnyUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadNotifications = await NotificationModel.find({
      idReceiver: userId,
      isRead: false
    }).sort({ createdAt: -1 }); // ordonner par le new to old

    res.status(200).json({
      count: unreadNotifications.length,
      notifications: unreadNotifications
    });

  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch unread notifications"
    });
  }
});

router.delete('/delete-notification', verifyJWTAnyUser, async (req, res) => {
  try {
    const { idNotification } = req.body;

    if (!idNotification || !idReceiver) {
      return res.status(400).json({
        success: false,
        message: 'Both idNotification and idReceiver are required'
      });
    }

    const deletedNotification = await NotificationModel.findOneAndDelete({
      _id: idNotification
    });

    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or receiver mismatch'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification deleted',
      notification: deletedNotification
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

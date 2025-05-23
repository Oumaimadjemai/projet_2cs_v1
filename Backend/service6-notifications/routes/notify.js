const express = require('express');
const router = express.Router();
const NotificationModel = require('../models/Notifications');
const { sendNotification, sendRoleNotification, getIO } = require('../websocket');
const { discoverDjangoService } = require('../services/discovery.service');
const axios = require('axios');
const verifyJWTAnyUser = require('../middlewares/validateToken')

router.post('/notify', async (req, res) => {
  const { idSender, idReceiver, title, message, type } = req.body;
  const notification = await NotificationModel({
    idSender: idSender,
    idReceiver: idReceiver,
    title: title,
    message: message
   });
  await notification.save();

  sendNotification({ message });
  res.status(200).json({ success: true });
});

router.post('/notify-admins', async (req, res) => {
  try {
    // Check if WebSocket is initialized
    if (!getIO()) {
      throw new Error("WebSocket server not ready");
    }

    const { idSender, message, title, type } = req.body;
    
    // 1. Get admin list
    const firstServiceUrl = await discoverDjangoService();
    const response = await axios.get(`${firstServiceUrl}/admins/`);
    const admins = response.data;

    // 2. Prepare notification data
    const notificationData = {
      role: 'admin',
      message: type === 'creationTheme' 
        ? `Nouveau thème créé: ${title}` 
        : type === 'urgence' 
          ? `URGENT: ${message}`
          : message,
      type: type,
      teacherId: idSender,
      timestamp: new Date()
    };

    // 3. Save to database
    const notificationPromises = admins.map(admin => {
      return NotificationModel.create({
        idSender: idSender,
        idReceiver: admin.id,
        title: title || `Notification ${type}`,
        message: notificationData.message,
        type: type
      });
    });
    
    await Promise.all(notificationPromises);

    // 4. Send real-time notifications
    if (type === 'creationTheme') {
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

router.patch('/mark-lus',verifyJWTAnyUser , async (req, res) => {
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

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  idSender: Number,
  idReceiver: Number,
  title: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const NotificationModel = mongoose.model('Notifications', NotificationSchema)

module.exports = NotificationModel;

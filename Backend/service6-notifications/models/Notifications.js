const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  idSender: {
    type: Number,
    required: false
  },
  idReceiver: {
    type: Number,
    required: function() {
      return !this.isBroadcast;
    }
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'CREATION_THEME',
      'THEME_DECISION', 
      'THEME_ASSIGNMENT',
      'GROUP_ASSIGNMENT',
      'URGENT_NOTIFICATION',
      'ENTREPRISE_DEMANDE',
      'SYSTEM',
      'STUDENT_INVITATION'
    ],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isBroadcast: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const NotificationModel = mongoose.model('Notification', NotificationSchema);

module.exports = NotificationModel;
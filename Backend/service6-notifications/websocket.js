const { Server } = require('socket.io');

let io = null;
const connectedUsers = {};

function setupWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000 // 2 minutes
    }
  });

  console.log("✅ WebSocket server initialized");

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Nouveau : Room spéciale pour les admins
    socket.on("register_admin", () => {
      socket.join('admin_room');
      console.log(`Admin registered in admin_room: ${socket.id}`);
    });

    // When user connects, they send their userId and role
    socket.on("register", ({ userId, userRole }) => {
      console.log(`✅ Utilisateur connecté via WebSocket: ID=${userId}, rôle=${userRole}, socketId=${socket.id}`);
      connectedUsers[userId] = { socketId: socket.id, role: userRole };

      socket.join(userRole);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      for (const [userId, info] of Object.entries(connectedUsers)) {
        if (info.socketId === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
    });
  });
}

function sendNotification(receiverId, data) {
  if (connectedUsers[receiverId]) {
    io.to(connectedUsers[receiverId].socketId).emit('user_notification', data);
  }
}

function sendRoleNotification(role, data) {
  if (!io) throw new Error("WebSocket server not initialized");
  io.to(role).emit('role_notification', data);
}

// Nouvelle fonction pour les notifications système
function sendSystemNotification(data) {
  if (!io) throw new Error("WebSocket server not initialized");
  io.to('admin_room').emit('system_notification', {
    ...data,
    isSystem: true,
    timestamp: new Date()
  });
}

module.exports = {
  setupWebSocket,
  sendNotification,
  sendRoleNotification,
  sendSystemNotification,
  getIO: () => io
};

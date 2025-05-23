const { Server } = require('socket.io');

let io = null;
const connectedUsers = {};

function setupWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

   console.log("✅ WebSocket server initialized");

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // When user connects, they send their userId and role
    socket.on("register", ({ userId, userRole }) => {
      console.log(`Registered ${userRole} with ID ${userId}`);
      connectedUsers[userId] = { socketId: socket.id, role: userRole };
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      // Remove disconnected socket
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

module.exports = {
  setupWebSocket,
  sendNotification,
  sendRoleNotification,
   getIO: () => io 
};

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config");
const routes = require("./routes");
const axios = require("axios");

const { eurekaClient } = require("./services/discovery.service");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health endpoints
app.get("/health", (req, res) => res.status(200).json({ status: "UP" }));
app.get("/info", (req, res) =>
  res.json({
    service: "Node Group Service",
    status: "UP",
    version: "1.0.0",
  })
);

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// MongoDB Connection
mongoose
  .connect("mongodb://mongo:27017/groupApp")
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur MongoDB:", err));

// Eureka registration
eurekaClient.start((error) => {
  console.log(error || "Node service registered with Eureka");
});

process.on("SIGINT", () => {
  console.log("Déconnexion de Eureka...");
  eurekaClient.stop(() => {
    console.log("Client Eureka déconnecté");
    process.exit();
  });
});

module.exports = app;

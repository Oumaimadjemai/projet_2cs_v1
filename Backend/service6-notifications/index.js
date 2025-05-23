const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { eurekaClient } = require('./services/discovery.service')
require('dotenv').config();
const bodyParser = require('body-parser');
const router = require('./routes/notify');
const { setupWebSocket } = require('./websocket');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));
app.get('/info', (req, res) =>
  res.json({
    service: 'SERVICE6-NOTIFICATIONS',
    status: 'UP',
    version: '1.0.0',
  })
);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

eurekaClient.start((err) => {
  if (err) {
    console.error('Eureka registration failed:', err);
  } else {
    console.log('Service registered with Eureka!');
  }
});

app.use('', router);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize WebSocket server AFTER HTTP server
setupWebSocket(server);
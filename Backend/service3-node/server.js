const app = require('./app');
const config = require('./config');
const axios = require('axios');


app.listen(config.PORT, () => {
  console.log(`Serveur Node.js en écoute sur le port ${config.PORT}`);
  console.log(`Configuration JWT: ${config.JWT_SECRET.substring(0, 10)}...`);
  console.log(`URL Django par défaut: ${config.DJANGO_API_URL}`);
});
const Eureka = require('eureka-js-client').Eureka;
require('dotenv').config();
const eurekaConfig = require('../config/eureka.config');
const axios = require('axios');


const eurekaClient = new Eureka(eurekaConfig);

async function discoverDjangoService() {
  try {
    const instances = eurekaClient.getInstancesByAppId(process.env.DJANGO_SERVICE_NAME);

    if (!instances || instances.length === 0) {
      console.warn("Aucune instance Django disponible via Eureka, utilisation de la configuration par défaut");
      return process.env.DJANGO_API_URL;
    }

    const instance = instances[Math.floor(Math.random() * instances.length)];
    const baseUrl = `http://${instance.hostName}:${instance.port["$"] || 8000}`;
    console.log(`Utilisation de l'instance Django: ${baseUrl}`);
    return baseUrl;
  } catch (error) {
    console.error("Erreur de découverte de service:", error);
    return process.env.DJANGO_API_URL;
  }
}

module.exports = {
  eurekaClient,
  discoverDjangoService
};
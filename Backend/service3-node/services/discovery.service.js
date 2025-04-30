const Eureka = require('eureka-js-client').Eureka;
const config = require('../config');
const eurekaConfig = require('../config/eureka.config');
const axios = require('axios');


const eurekaClient = new Eureka(eurekaConfig);

async function discoverDjangoService() {
  try {
    const instances = eurekaClient.getInstancesByAppId(config.DJANGO_SERVICE_NAME);

    if (!instances || instances.length === 0) {
      console.warn("Aucune instance Django disponible via Eureka, utilisation de la configuration par défaut");
      return config.DJANGO_API_URL;
    }

    const instance = instances[Math.floor(Math.random() * instances.length)];
    const baseUrl = `http://${instance.hostName}:${instance.port["$"] || 8000}`;
    console.log(`Utilisation de l'instance Django: ${baseUrl}`);
    return baseUrl;
  } catch (error) {
    console.error("Erreur de découverte de service:", error);
    return config.DJANGO_API_URL;
  }
}

async function discoverService2() {
  try {
    const instances = eurekaClient.getInstancesByAppId(config.SERVICE2_NAME);

    if (!instances || instances.length === 0) {
      console.warn("Aucune instance Service2 disponible via Eureka, utilisation de la configuration par défaut");
      return process.env.SERVICE2_API_URL || "http://localhost:8001";
    }

    const instance = instances[Math.floor(Math.random() * instances.length)];
    const baseUrl = `http://${instance.hostName}:${instance.port["$"] || 8001}`;
    console.log(`Utilisation de l'instance Service2: ${baseUrl}`);
    return baseUrl;
  } catch (error) {
    console.error("Erreur de découverte de service2:", error);
    return process.env.SERVICE2_API_URL || "http://localhost:8001";
  }
}

module.exports = {
  eurekaClient,
  discoverDjangoService,
  discoverService2,
};
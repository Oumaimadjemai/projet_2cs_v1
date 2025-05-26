module.exports = {
  instance: {
    app: "SERVICE3-NODE",
    hostName: "service3-node", // Container name, used as hostname in Docker network
    ipAddr: "service3-node",   // Same as above, Docker internal DNS will resolve this
    port: {
      $: 3000,
      "@enabled": true,
    },
    vipAddress: "node-group-service",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
    registerWithEureka: true,
    fetchRegistry: true,
    statusPageUrl: `http://service3-node:3000/info`,
    healthCheckUrl: `http://service3-node:3000/health`,
    homePageUrl: `http://service3-node:3000`,
  },
  eureka: {
    host: "registry",      // Match the docker-compose service name for Eureka
    port: 8761,
    servicePath: "/eureka/apps/",
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
};

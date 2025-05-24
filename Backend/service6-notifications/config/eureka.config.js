module.exports = {
    instance: {
        app: "SERVICE6-NOTIFICATIONS",
        hostName: process.env.HOSTNAME || "localhost",
        ipAddr: process.env.IP || "127.0.0.1",
        port: {
            $: process.env.PORT || 4000,
            "@enabled": true,
        },
        vipAddress: "node-group-service",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
        registerWithEureka: true,
        fetchRegistry: true,
        statusPageUrl: `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}/info`,
        healthCheckUrl: `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}/health`,
        homePageUrl: `http://${process.env.HOSTNAME || "localhost"}:${process.env.PORT || 4000}`,
    },
    eureka: {
        host: process.env.EUREKA_HOST || "localhost",
        port: process.env.EUREKA_PORT || 8761,
        servicePath: "/eureka/apps/",
        maxRetries: 10,
        requestRetryDelay: 2000,
    },
    registerWithEureka: true,
    fetchRegistry: true,
};
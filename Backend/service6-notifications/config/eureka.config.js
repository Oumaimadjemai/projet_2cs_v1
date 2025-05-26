module.exports = {
    instance: {
        app: "SERVICE6-NOTIFICATIONS",
        hostName: "service6-notification", // must match the service name in docker-compose
        ipAddr: "service6-notification",   // internal Docker hostname (optional but consistent)
        port: {
            $: 4000,
            "@enabled": true,
        },
        vipAddress: "service6-notification",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
        statusPageUrl: "http://service6-notification:4000/info",
        healthCheckUrl: "http://service6-notification:4000/health",
        homePageUrl: "http://service6-notification:4000",
    },
    eureka: {
        host: "registry", // service name of Eureka container
        port: 8761,
        servicePath: "/eureka/apps/",
        maxRetries: 10,
        requestRetryDelay: 2000,
    },
    registerWithEureka: true,
    fetchRegistry: true,
};

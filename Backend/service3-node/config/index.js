require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "django-insecure-1t@eg)yilj^)-=1b+lhhq0_82gmzzkbmcxmbkgf)yrd(c*e+o@",
  DJANGO_API_URL: process.env.DJANGO_API_URL || "http://localhost:8000",
  SERVICE2_NAME: process.env.SERVICE2_NAME || "SERVICE2-CLIENT",
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/groupApp",
  DJANGO_SERVICE_NAME: process.env.DJANGO_SERVICE_NAME || "SERVICE1-CLIENT",
};
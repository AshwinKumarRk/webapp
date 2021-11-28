
require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB_NAME,
    RR_HOST: process.env.DB_RR_HOST,
    RR_USER: process.env.DB_RR_USER,
    RR_PASSWORD: process.env.DB_RR_PASS,
    dialect: "mysql",
  };
  
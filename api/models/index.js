const Config = require("../config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(Config.DB, null, null, {
  dialect: Config.dialect,
  dialectOptions: {
    ssl:'Amazon RDS'
  },
  replication: {
    read: [
      { host: Config.RR_HOST, username: Config.RR_USER, password: Config.RR_PASSWORD }
    ],
    write: { host: Config.HOST, username: Config.USER, password: Config.PASSWORD }
  },
  operatorsAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.files = require("./file.model.js")(sequelize, Sequelize);

module.exports = db;
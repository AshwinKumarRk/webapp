module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
              isEmail: true
          }
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  
    return User;
  };
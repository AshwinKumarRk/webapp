module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      username: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            isEmail: true
          },
          unique: {
            args: true,
            msg: 'Email exists'
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
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      verified_on: {
        type: Sequelize.DATE,
        defaultValue: null
      }
    });
  
    return User;
  };
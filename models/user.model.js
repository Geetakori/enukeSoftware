module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      user_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      image:{
        type: Sequelize.TEXT
      },
      verification_token: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: true
      }
    }, {
      timestamps: true
    });
  
    return Users;
  };
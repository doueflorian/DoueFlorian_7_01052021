const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../sequelize');

const User = sequelize.define('User', {
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_of_birth: DataTypes.DATEONLY,
    occupation: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    user_level: DataTypes.INTEGER,
    profile_pic: DataTypes.STRING
    }, {
    timestamps: false,
    underscored: true
    });
  
module.exports= ('User',sequelize.models.User);
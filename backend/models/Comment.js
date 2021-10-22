const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../sequelize');

const Post = sequelize.define('Comment', {
    // Model attributes are defined here
    message: {
        type: DataTypes.TEXT
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    
    },
    image_url: DataTypes.STRING
    
    }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  
module.exports= ('Comment',sequelize.models.Comment);
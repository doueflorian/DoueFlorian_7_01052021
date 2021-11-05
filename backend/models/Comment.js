const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../sequelize');

const User = require('./User');

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
    image_url: DataTypes.STRING
    
    }, {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

Post.belongsTo(User);

  
module.exports= ('Comment',sequelize.models.Comment);
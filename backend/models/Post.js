const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../sequelize');

const User = require('./User');

const Post = sequelize.define('Post', {
    // Model attributes are defined here
    message: DataTypes.TEXT,
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image_url: DataTypes.STRING,
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    dislikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
    }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
    });

Post.belongsTo(User);

module.exports= ('Post',sequelize.models.Post);
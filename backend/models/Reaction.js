const { Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../sequelize');

// Use like for 1: like, 0: null, -1: dislike

const Reaction = sequelize.define('Reaction', {
    // Model attributes are defined here
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    like_data: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }

    },{
        timestamps: false
});
  
module.exports= ('Reaction',sequelize.models.Reaction);
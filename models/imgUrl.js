const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const imgUrl = sequelize.define(
    'imgUrl',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        imageUrl: {
            type: Sequelize.STRING,
            defaultValue: 'default-image.jpg'
        },
        purpose: {
            type: Sequelize.STRING
        }
    }, {
    tableName: 'imgUrl'
});

module.exports = imgUrl;
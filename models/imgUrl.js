const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const image = sequelize.define(
    'image',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        imageUrl: {
            type: Sequelize.STRING,
            defaultValue: 'default-image.jpg'
        }
    }, {
    tableName: 'image'
});

module.exports = image;
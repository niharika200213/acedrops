const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const shop = sequelize.define(
    'shop',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        imgUrl: {
            type: Sequelize.STRING
        }
    }, {
    tableName: 'shop'
});

module.exports = shop;
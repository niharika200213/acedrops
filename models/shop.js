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
        shopName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING
        },
        phno: {
            type: Sequelize.STRING,
            allowNull: false
        },
        credentials: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        rating: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
    tableName: 'shop'
});

module.exports = shop;
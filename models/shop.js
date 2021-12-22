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
        googleId: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        shopName: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING
        },
        noOfMembers: {
            type: Sequelize.INTEGER
        },
        phno: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        address: {
            type: Sequelize.STRING
        },
        fathersName: {
            type: Sequelize.STRING
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, {
    tableName: 'shop'
});

module.exports = shop;
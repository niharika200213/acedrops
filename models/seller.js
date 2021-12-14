const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const seller = sequelize.define(
    'seller',{
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
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phno: {
            type: Sequelize.STRING,
            allowNull: false
        },
        credentials: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
    tableName: 'seller'
});

module.exports = seller;
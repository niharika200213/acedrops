const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const user = sequelize.define(
    'user',{
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
            type: Sequelize.STRING
        },
        phno: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.TEXT
        }
    }, {
    tableName: 'user'
});

module.exports = user;
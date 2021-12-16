const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const token = sequelize.define(
    'token',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        token: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        }
    }, {
    tableName: 'token'
});

module.exports = token;
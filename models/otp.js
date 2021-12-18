const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const otp = sequelize.define(
    'otp',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        otp: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
    tableName: 'otp'
});

module.exports = otp;
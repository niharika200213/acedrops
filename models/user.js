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
        googleId: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        phno: {
            type: Sequelize.BIGINT,
            validate: {len: [10]},
            unique: true
        }
    }, {
    tableName: 'user'
});

module.exports = user;
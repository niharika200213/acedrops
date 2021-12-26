const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const viewed = sequelize.define(
    'viewed',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        }
    }, {
    tableName: 'viewed'
});

module.exports = viewed;
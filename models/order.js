const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const order = sequelize.define(
    'order',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        price: {
            type: Sequelize.INTEGER
        }
    }, {
    tableName: 'order'
});

module.exports = order;
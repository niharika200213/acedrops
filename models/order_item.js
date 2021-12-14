const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const order_item = sequelize.define(
    'order_item',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
    tableName: 'order_item'
});

module.exports = order_item;
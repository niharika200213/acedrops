const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const cart_item = sequelize.define(
    'cart_item',{
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
    tableName: 'cart_item'
});

module.exports = cart_item;
const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const product = sequelize.define(
    'product',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        stock: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        basePrice: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        discountedPrice: {
            type: Sequelize.INTEGER
        },
        offers: {
            type: Sequelize.STRING
        }
    }, {
    tableName: 'product'
});

module.exports = product;
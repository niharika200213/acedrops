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
        rating: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        offers: {
            type: Sequelize.DOUBLE
        }
    }, {
    tableName: 'products'
});

module.exports = product;
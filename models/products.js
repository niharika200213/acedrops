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
        imgUrl: {
            type: Sequelize.STRING,
            default: 'default-image.jpg'
        },
        rating: {
            type: Sequelize.INTEGER,
            default: 0
        }
    }, {
    tableName: 'products'
});

module.exports = product;
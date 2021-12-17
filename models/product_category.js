const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const product_category = sequelize.define(
    'product_category',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        }
    }, {
    tableName: 'product_category'
});

module.exports = product_category;
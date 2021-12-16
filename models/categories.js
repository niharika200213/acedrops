const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const categories = sequelize.define(
    'categories',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        category: {
            type: Sequelize.STRING
        }
    }, {
    tableName: 'categories'
});

module.exports = categories;
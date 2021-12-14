const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const review = sequelize.define(
    'review',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        review: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        rating: {
            type: Sequelize.INTEGER,
            default: 0
        }
    }, {
    tableName: 'review'
});

module.exports = review;
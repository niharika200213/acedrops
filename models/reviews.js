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
            type: Sequelize.TEXT
        },
        rating: {
            type: Sequelize.INTEGER
        }
    }, {
    tableName: 'review'
});

module.exports = review;
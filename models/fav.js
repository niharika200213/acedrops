const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const fav = sequelize.define(
    'fav',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        }
    }, {
    tableName: 'fav'
});

module.exports = fav;
const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const address = sequelize.define(
    'address',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        houseNo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        streetOrPlotNo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        locality: {
            type: Sequelize.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
    tableName: 'address'
});

module.exports = address;
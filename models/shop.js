const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const seller = sequelize.define(
    'seller',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        shopName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phno: {
            type: Sequelize.STRING,
            allowNull: false
        },
        credentials: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        imgUrl: {
            type: Sequelize.ARRAY(Sequelize.STRING)
        },
        rating: {
            type: Sequelize.INTEGER,
            default: 0
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            default: false
        }
    }, {
    tableName: 'seller'
});

module.exports = seller;
const Sequelize = require('sequelize');
const sequelize = require('../utils/db');
const shop = sequelize.define(
    'shop',{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        googleId: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        shopName: {
            type: Sequelize.STRING,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING
        },
        dob: {
            type: Sequelize.DATEONLY
        },
        noOfMembers: {
            type: Sequelize.INTEGER,
            validate: {min: 1}
        },
        phno: {
            type: Sequelize.BIGINT,
            validate: {len: [10]},
            unique: true
        },
        description: {
            type: Sequelize.TEXT
        },
        address: {
            type: Sequelize.STRING
        },
        aadhaarNo: {
            type: Sequelize.BIGINT,
            unique: true
        },
        fathersName: {
            type: Sequelize.STRING
        },
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        isApplied: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        status:{
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    }, {
    tableName: 'shop'
});

module.exports = shop;
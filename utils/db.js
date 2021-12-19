const Sequelize = require('sequelize');
const isProduction = process.env.NODE_ENV === 'production';
const connection = `postgresql://${process.env.PGUSER}:${process.env.PGPASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.PGDB}`;

const sequelize = new Sequelize(process.env.PGDB,process.env.PGUSER,process.env.PGPASS, {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction,
    dialect: 'postgres',
    logging: false
});
module.exports = sequelize;
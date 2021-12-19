const Sequelize = require('sequelize');
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.PGDB}`;

const sequelize = new Sequelize(process.env.PGDB,process.env.PGUSER,process.env.PGPASS, {
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: isProduction,
    dialect: 'postgres',
    logging: false
});
module.exports = sequelize;
const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.PGDB,process.env.PGUSER,process.env.PGPASS, {
//     connectionString: process.env.DATABASE_URL,
//     dialect: 'postgres',
//     logging: false
// });

const sequelize = new Sequelize(process.env.DATABASE_URL);
module.exports = sequelize;
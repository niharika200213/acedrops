const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.PGDB,process.env.PGUSER,process.env.PGPASS, {
//     connectionString: process.env.DATABASE_URL,
//     dialect: 'postgres',
//     logging: false
// });

const sequelize = new Sequelize("postgres://ksbclekwesajle:009f187861b605812dce641e30c2e436a3141c034e240d32a937a7798c1fb5e6@ec2-52-54-38-229.compute-1.amazonaws.com:5432/dflrmfcvojgh3v");
module.exports = sequelize;
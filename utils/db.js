const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.PGDB,process.env.PGUSER,process.env.PGPASS, {
    dialect: 'postgres',
    logging: false
});
module.exports = sequelize;
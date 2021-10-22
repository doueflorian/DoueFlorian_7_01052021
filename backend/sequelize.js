const { Sequelize } = require('sequelize');

const { MYSQLPW, MYSQLDB, MYSQLUSER, MYSQLHOST} = process.env;

//  Connection à MYSQL
const sequelize = new Sequelize(MYSQLDB, MYSQLUSER, MYSQLPW, {
    host: MYSQLHOST,
    dialect: "mysql"
  });

  try {
    sequelize.authenticate();
    console.log('Connecté à la base de données MySQL!');
  } catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
  }

module.exports = sequelize;
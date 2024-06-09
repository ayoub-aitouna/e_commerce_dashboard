require('dotenv').config();
module.exports =
{
  "development": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_ROOT_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": 'mariadb', // Use the service name from Docker Compose
    "port": 3306, // Default port for MySQL
    "dialect": "mysql",
    "logging": false,
  },
  "test": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_ROOT_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": 'mariadb', // Use the service name from Docker Compose
    "port": 3306, // Default port for MySQL
    "dialect": "mysql",
    "logging": false,
  },
  "production": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_ROOT_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": 'mariadb', // Use the service name from Docker Compose
    "port": 3306, // Default port for MySQL
    "dialect": "mysql",
    "logging": false,
  }
};
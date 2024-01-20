require('dotenv').config();
console.log(process.env.MYSQL_DATABASE);

module.exports =
{
  "development": {
    "username": process.env.MYSQL_USER,
    "password": process.env.MYSQL_ROOT_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "host": "mariadb",  // Use the service name from Docker Compose
    "port": 3306,     // Default port for MySQL
    "dialect": "mysql",
    "logging": false,
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

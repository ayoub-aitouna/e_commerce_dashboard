require('dotenv').config();
console.log(process.env.DB_NAME);

module.exports = 
{
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": "ep-ancient-bar-26816035.us-east-2.aws.neon.tech",
    "dialect": "postgres",
    "schema": "public",
    "dialectOptions": {
      "application_name": "ep-ancient-bar-26816035",
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
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

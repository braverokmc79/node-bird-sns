const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": "react-nodebird",
    "password": process.env.DB_PASSWORD,
    "database": "react_nodebird",
    "host": "127.0.0.1",
    "post": "3306",
    "dialect": "mysql"
  },
  "test": {
    "username": "react-nodebird",
    "password": process.env.DB_PASSWORD,
    "database": "react_nodebird",
    "host": "127.0.0.1",
    "post": "3306",
    "dialect": "mysql"
  },
  "production": {
    "username": "react-nodebird",
    "password": process.env.DB_PASSWORD,
    "database": "react_nodebird",
    "host": "127.0.0.1",
    "post": "3306",
    "dialect": "mysql"
  }
}
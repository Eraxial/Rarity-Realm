const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'collectors3',
  user: 'root',
  password: 'root'
})

connection.connect((error) => {
  if (error) {
    console.log("Error connecting " + error.stack)
  }
  console.log("Connected to the database");
})

module.exports = connection;

const mysql = require('mysql2');
// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'express_jwt_mysql',
  });
  

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed: ', err);
    } else {
      console.log('Connected to the database');
    }
  });
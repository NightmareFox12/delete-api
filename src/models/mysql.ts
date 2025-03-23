import mysql = require('mysql2/promise');

export const connection = async (): Promise<mysql.Connection> => {
  return mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'education',
    password: '',
    waitForConnections: true,
    connectionLimit: 200,
    queueLimit: 0,
  });
};



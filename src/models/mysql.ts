import mysql = require('mysql2/promise');

export const connection = async (): Promise<mysql.Connection> => {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'education',
    password: '',
  });
};

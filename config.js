const { Client } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

exports.client = client;
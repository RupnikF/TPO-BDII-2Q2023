const { Client } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'root',
  port: 5432,
});

exports.client = client;


exports.mongoclient = {
  hosturl: 'mongodb://127.0.0.1/tpo',
}

exports.chooseserver = {
  postgresql: true,
  mongodb: true
}

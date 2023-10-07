const express = require('express');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

client.connect();

app.use(express.json());

app.get('/clientes', async (req, res) => {
  const result = await client.query('SELECT * FROM e01_cliente');
  res.json(result.rows);
});

app.post('/clientes', async (req, res) => {
  const { nombre, apellido, direccion, activo } = req.body;
  const result = await client.query(
    'INSERT INTO e01_cliente (nombre, apellido, direccion, activo) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, apellido, direccion, activo]
  );
  res.json(result.rows[0]);
});

app.put('/clientes/:id', async (req, res) => {
  const id = req.params.id;
  const { nombre, apellido, direccion, activo } = req.body;
  const result = await client.query(
    'UPDATE e01_cliente SET nombre = $1, apellido = $2, direccion = $3, activo = $4 WHERE nro_cliente = $5 RETURNING *',
    [nombre, apellido, direccion, activo, id]
  );
  res.json(result.rows[0]);
});

app.delete('/clientes/:id', async (req, res) => {
  const id = req.params.id;
  await client.query('DELETE FROM e01_cliente WHERE nro_cliente = $1', [id]);
  res.json({ message: 'Cliente eliminado' });
});

app.get('/productos', async (req, res) => {
  const result = await client.query('SELECT * FROM e01_producto');
  res.json(result.rows);
});

app.post('/productos', async (req, res) => {
  const { marca, nombre, descripcion, precio, stock } = req.body;
  const result = await client.query(
    'INSERT INTO e01_producto (marca, nombre, descripcion, precio, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [marca, nombre, descripcion, precio, stock]
  );
  res.json(result.rows[0]);
});

app.put('/productos/:id', async (req, res) => {
  const id = req.params.id;
  const { marca, nombre, descripcion, precio, stock } = req.body;
  const result = await client.query(
    'UPDATE e01_producto SET marca = $1, nombre = $2, descripcion = $3, precio = $4, stock = $5 WHERE codigo_producto = $6 RETURNING *',
    [marca, nombre, descripcion, precio, stock, id]
  );
  res.json(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
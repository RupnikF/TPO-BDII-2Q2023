const { MongoClient } = require('mongodb');
const { client } = require('./config.js');

const url = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(url);
const dbName = 'test';

async function loadMongoData() {
  await client.connect();
  await mongoClient.connect();
  const db = mongoClient.db(dbName);

  const createdClients = async () => {
    const clientResults = await client.query('SELECT * FROM e01_cliente c join e01_telefono t on c.nro_cliente = t.nro_cliente');
    const map = clientResults.rows.reduce((prev, curr) => {
      const { codigo_area, nro_telefono, tipo, ...client } = curr;
      if (!prev.has(curr.nro_cliente)) {
        prev.set(curr.nro_cliente, {
          ...client,
          telefonos: [{ codigo_area, nro_telefono, tipo }],
        });
        return prev;
      } else {
        prev.get(curr.nro_cliente).telefonos.push({ codigo_area, nro_telefono, tipo });
        return prev;
      }
    }, new Map());
    const clientColl = db.collection('clients');
    const responses = [...map.values()].map((client) => clientColl.insertOne(client));
    const insertedResponses = await Promise.all(responses);
    return insertedResponses.map(({ insertedId }) => insertedId); 
  }

  const createdProducts = async () => {
    const productColl = db.collection('products');
    const productResults = await client.query('SELECT * FROM e01_producto');
    const responses = productResults.rows.map((product) => productColl.insertOne(product));
    const insertedResponses = await Promise.all(responses);
    return insertedResponses.map(({ insertedId }) => insertedId);
  }

  Promise.all([createdClients(), createdProducts()]).then(([resultsClient, createdProducts]) => {
    // Obtener factura
    // Agregar detalle factura a array dentro de factura
    // Matchear codigo_producto a ObjectId en createdProducts
    // Matchear nro_cliente a ObjectId en resultsClients
    // Insertar facturas
  });
}

loadMongoData();
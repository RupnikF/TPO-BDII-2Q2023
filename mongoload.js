const { MongoClient } = require('mongodb');
const { client } = require('./config.js');

const url = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(url);
const dbName = 'tpo';

async function loadMongoData() {
  await client.connect();
  await mongoClient.connect();
  const db = mongoClient.db(dbName);

  const createdClients = async () => {
    const clientResults = await client.query('SELECT * FROM e01_cliente c left outer join e01_telefono t on c.nro_cliente = t.nro_cliente');
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
    const clientColl = db.collection('clientes');
    const responses = [...map.values()].map((client) => clientColl.insertOne(client));
    const insertedResponses = await Promise.all(responses);
    return insertedResponses.map(({ insertedId }) => insertedId); 
  }

  const createdProducts = async () => {
    const productColl = db.collection('productos');
    const productResults = await client.query('SELECT * FROM e01_producto');
    const responses = productResults.rows.map((product) => productColl.insertOne(product));
    const insertedResponses = await Promise.all(responses);
    return insertedResponses.map(({ insertedId }) => insertedId);
  }

  Promise.all([createdClients(), createdProducts()]).then(async ([resultsClient, createdProducts]) => {
    const facturaResults = await client.query('SELECT * FROM e01_factura f left outer join e01_detalle_factura df on f.nro_factura = df.nro_factura');
    const map = facturaResults.rows.reduce((prev, curr) => {
      const { codigo_producto, nro_item, cantidad, ...factura } = curr;
      if (!prev.has(curr.nro_factura)) {
        prev.set(curr.nro_factura, {
          ...factura,
          detalle_factura: [{ nro_item, codigo_producto, cantidad }],
        });
        return prev;
      } else {
        prev.get(curr.nro_factura).detalle_factura.push({ nro_item, codigo_producto, cantidad });
        return prev;
      }
    }, new Map());
    // Matchear codigo_producto a ObjectId en createdProducts ? no entendimos
    // Matchear nro_cliente a ObjectId en resultsClients ? no entendimos
    const facturaColl = db.collection('facturas');
    const responses = [...map.values()].map((factura) => facturaColl.insertOne(factura));
    const insertedResponses = await Promise.all(responses);
    return insertedResponses.map(({ insertedId }) => insertedId); 
  });
}

loadMongoData();
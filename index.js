const express = require('express');

const { chooseserver } = require('./config.js');

if(chooseserver.postgresql) {

  const { client } = require('./config.js');


  const app = express();
  const port = process.env.PORT || 3000;

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

}

// Parte de Mongo
if(chooseserver.mongodb) {
  const mongoose = require('mongoose');

  const { Schema } = mongoose;

  const clientSchema = new Schema({
    activo: Number,
    apellido: String,
    direccion: String,
    nombre: String,
    telefonos: {type: [{codigo_area:Number,nro_telefono:Number,tipo:String}], default: []},
    nro_cliente: Number
  }, {versionKey: false});
  const ClientesModel = mongoose.model('clientes', clientSchema);

  const facturaSchema = new Schema({
    fecha: Date,
    iva: Number,
    nro_cliente: Number,
    nro_factura: Number,
    total_con_iva: Number,
    total_sin_iva: Number,
    detalle_factura: [{nro_item:Number,codigo_producto:Number,cantidad:Number}]
  }, {versionKey: false});
  const FacturaModel = mongoose.model('facturas',facturaSchema);

  const productosSchema = new Schema({
    codigo_producto: Number,
    descripcion: String,
    marca: String,
    nombre: String,
    precio: Number,
    stock: Number
    }, {versionKey: false});
  const ProductosModel = mongoose.model('productos',productosSchema);

  const { mongoclient } = require('./config.js');

  mongoose.connect(mongoclient.hosturl);

  const mongoapp=express();
  mongoapp.use(express.json());

  const db = mongoose.connection;
  db.on("error", console.error.bind(console,"connection error: "));
  db.once("open", function() {
      console.log("Connected Successfully");
  });


  mongoapp.get('/mongo/clientes', async (req, res) => {
    try {
      const result = await ClientesModel.find().exec();
      res.json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error when requesting to get Clients' });
    }
  });


  mongoapp.post('/mongo/clientes', async (req, res) => {
    try {
      const highestClient = await ClientesModel.findOne().sort('-nro_cliente').exec();

      // Nuevo nro_cliente,se genera automáticamente
      const newClientNumber = highestClient ? highestClient.nro_cliente + 1 : 1;
      
      const newCliente = new ClientesModel({nro_cliente: newClientNumber, ...req.body});
      const savedCliente = await newCliente.save();
      res.status(201).json(savedCliente); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error when requesting to post a Client' });
    }
  });

  mongoapp.put('/mongo/clientes/:nro_cliente', async (req, res) => {
    const nro_cliente = req.params.nro_cliente;

    try {
      const updatedCliente = await ClientesModel.findOneAndUpdate(
        { nro_cliente: nro_cliente }, 
        req.body,
        { new: true }
      );

      if (!updatedCliente) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(updatedCliente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error when requesting to put a Client' });
    }
  });


  mongoapp.delete('/mongo/clientes/:nro_cliente', async (req, res) => {
    const nro_cliente = req.params.nro_cliente;

    try {
      const deletedCliente = await ClientesModel.findOneAndDelete({ nro_cliente: nro_cliente })

      if (!deletedCliente) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error when requesting to delete a Client' });
    }
  });


  mongoapp.get('/mongo/productos', async (req, res) => {
    try {
      const result = await ProductosModel.find().exec();
      res.json(result); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error when requesting to get Products' });
    }
  });

  mongoapp.post('/mongo/productos', async (req, res) => {
    try {
      const ultimoProducto = await ProductosModel.findOne().sort('-codigo_producto').exec();

      // Nuevo código de producto, no hace falta que lo genere el usuario
      const newCode = ultimoProducto ? ultimoProducto.codigo_producto + 1 : 1;
      
      const newProducto = new ProductosModel({codigo_producto: newCode, ...req.body});
      const savedProduct = await newProducto.save();
      res.status(201).json(savedProduct); // Se retorna el documento guardado
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error when requesting to post a Product' });
    }
  });


  mongoapp.put('/mongo/productos/:codigo_producto', async (req, res) => {
    const codigo_producto = req.params.codigo_producto;

    try {
      const updatedProduct = await ProductosModel.findOneAndUpdate(
        { codigo_producto: codigo_producto },
        req.body,
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(updatedProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error when requesting to put a Product' });
    }
  });


  mongoapp.listen(3001, () => {
    console.log(`Server is running on port 3001`);
  });
}



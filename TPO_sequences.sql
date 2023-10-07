CREATE SEQUENCE nro_cliente_seq AS integer START 101;
ALTER TABLE e01_cliente ALTER COLUMN nro_cliente SET DEFAULT nextval('nro_cliente_seq');
ALTER SEQUENCE nro_cliente_seq OWNED BY e01_cliente.nro_cliente;

CREATE SEQUENCE nro_factura_seq AS integer START 401;
ALTER TABLE e01_factura ALTER COLUMN nro_factura SET DEFAULT nextval('nro_factura_seq');
ALTER SEQUENCE nro_factura_seq OWNED BY e01_factura.nro_factura;

CREATE SEQUENCE codigo_producto_seq AS integer START 101;
ALTER TABLE e01_producto ALTER COLUMN codigo_producto SET DEFAULT nextval('codigo_producto_seq');
ALTER SEQUENCE codigo_producto_seq OWNED BY e01_producto.codigo_producto;
1. Obtener el teléfono y el número de cliente del cliente con nombre “Wanda” y apellido “Baker”. 
	SELECT C.nro_cliente, T.nro_telefono
	FROM E01_CLIENTE C NATURAL JOIN E01_TELEFONO T
	WHERE nombre = ‘Wanda’ AND apellido = ‘Baker’
2. Seleccionar todos los clientes que tengan registrada al menos una factura.
SELECT *
FROM E01_CLIENTE C
WHERE EXISTS(SELECT * 
FROM E01_FACTURA F
WHERE F.nro_cliente = C.nro_cliente)
3. Seleccionar todos los clientes que no tengan registrada una factura.
	SELECT *
FROM E01_CLIENTE C
WHERE NOT EXISTS(SELECT * 
FROM E01_FACTURA F
WHERE F.nro_cliente = C.nro_cliente)
4. Seleccionar los productos que han sido facturados al menos 1 vez. 
SELECT *
FROM PRODUCTO p
WHERE exists (SELECT * FROM detalle_factura df WHERE p.codigo_producto = df.codigo_producto);

5. Seleccionar los datos de los clientes junto con sus teléfonos. 
SELECT *
FROM cliente LEFT JOIN telefono ON cliente.nro_cliente = telefono.nro_cliente;
6. Devolver todos los clientes, con la cantidad de facturas que tienen registradas (admitir nulos en valores de Clientes). 
	SELECT C.nro_cliente, C.nombre, C.apellido, COUNT(F.nro_factura)
	FROM 
E01_CLIENTE C LEFT OUTER JOIN E01_FACTURA F
ON C.nro_cliente = F.nro_cliente
	GROUP BY C.nro_cliente, C.nombre, C.apellido
7. Listar todas las Facturas que hayan sido compradas por el cliente de nombre "Pandora" y apellido "Tate". 
SELECT * FROM factura fa
WHERE EXISTS (SELECT * FROM cliente cl WHERE cl.nro_cliente = fa.nro_cliente AND cl.nombre = “Pandora” AND cl.apellido = “Tate”);
8. Listar todas las Facturas que contengan productos de la marca “In Faucibus Inc.”
 	SELECT *
	FROM E01_FACTURA F
	WHERE F.nro_factura in (SELECT distinct D.nro_factura
FROM E01_DETALLE_FACTURA D NATURAL JOIN E01_PRODUCTO P
WHERE P.marca = ‘In Faucibus Inc.’)
9. Mostrar cada teléfono junto con los datos del cliente. 
SELECT *
FROM cliente RIGHT JOIN telefono ON cliente.nro_cliente = telefono.nro_cliente;
10. Mostrar nombre y apellido de cada cliente junto con lo que gastó en total (con IVA incluido). 
SELECT nombre, apellido, sum(total_con_iva)
FROM cliente NATURAL JOIN factura
GROUP BY nombre, apellido;

Vistas 
1. Se debe realizar una vista que devuelva las facturas ordenadas por fecha. 
CREATE VIEW primera_view AS
SELECT * FROM factura
ORDER BY fecha;
2. Se necesita una vista que devuelva todos los productos que aún no han sido facturados.
CREATE VIEW segunda_view AS
SELECT * FROM producto p
WHERE NOT EXISTS (SELECT * FROM detalle_factura df WHERE p.codigo_producto = df.codigo_producto);

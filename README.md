# TPO-BDII-2Q2023
### Ejecutar API
Guía para generar la base de datos y correr la api para agregar, modificar y eliminar clientes y productos:

Para descargar la imagen de Postgresql en docker, correr: `docker pull postgres`
Para descargar la imagen de MongoDB en docker, correr: `docker pull mongo`

Para generar el container de Postgresql, correr: 
`docker run --name nombre_del_container -e POSTGRES_PASSWORD=password_del_container -d postgres`
Para generar el container de MongoDB, correr: 
`docker run --name nombre_del_container -d -p 27017:27017 mongo`

Cambiar el username, password, host y puertos de la BD con los clientes y productos de PostgreSQL en `config.js`.
También cambiar el url de MongoDB, `mongodb://127.0.0.1/nombre_base_de_datos`.
Además, en el json `chooseserver` se puede elegir a cuales de las dos bases de datos se quiere conectar (puede elegir ambas).

Luego correr `npm install` en el directorio del repositorio, y luego:

`npm start` para iniciar el servidor. 

Por defecto, se abrirá en `localhost:3000` la BD de PostgreSQL y en `localhost:3001` la BD de MongoDB. 

En el repositorio encontrán un `.postman_collection.json`, el mismo
puede ser usado para generar automáticamente una colección de queries en Postman.

Para hacer uso del mismo deben utilizar la funcionalidad de "importar" de Postman.

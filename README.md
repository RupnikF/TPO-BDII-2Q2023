# TPO-BDII-2Q2023
### Ejecutar API
Guía para generar la base de datos y correr la api para agregar, modificar y eliminar clientes y productos:

Para descargar la imagen de Postgresql en docker, correr: docker pull postgres

Para generar el container de Postgresql, correr: docker run --name nombre_del_container -e POSTGRES_PASSWORD=password_del_container -d postgres

Cambiar el username, password, host y puertos de la BD con los clientes y productos en `config.js`.

Luego correr `npm install` en el directorio del repositorio, y luego:

`npm start` para iniciar el servidor. 

Por defecto, se abrirá en `localhost:3000`.

En el repositorio encontrán un .postman_collection.json, el mismo
puede ser usado para generar automáticamente una colección de queries en Postman
Para hacer uso del mismo deben utilizar la funcionalidad de "importar" de Postman
y agregar la variable global l3000 con el valor "http://localhost:3000/", pudiendo
reemplazar 3000 por el puerto que prefiera.

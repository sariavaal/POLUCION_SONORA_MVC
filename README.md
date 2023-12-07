# POLUCION_SONORA_MVC
Para instalar:
1- Crear la base de datos MySQL con el nombre polucionsonora_mvc
2-Crear el trigger(disparadores) en la base de datos con las siguientes sentencias:
Nombre del disparador: eliminar_reportes
tabla: Usuarios
tiempo: BEFORE
Evento: DELETE
Definición: DELETE FROM reportes WHERE usuarioId = OLD.id
3-Crear el archivo con nombre .env en la raíz del proyecto con las siguientes credenciales personales:
DB_NOMBRE=
DB_USER=
DB_PASSWORD=
DB_HOST=
//PARA MAILTRAP
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

BACKEND_URL=http://localhost
//para el json web token
JWT_SECRET= 

4- Comandos del sistema:
para descargar todos los archivos del package.json
npm i
para inicializar el servidor y mantener corriendo
npm run server
para incializar y mantener corriendo el css y el js
npm run dev
para importar la base de datos:
npm run db:importar
para eliminar la base de datos:
npm run db:eliminar
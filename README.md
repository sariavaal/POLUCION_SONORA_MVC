# POLUCION_SONORA_MVC

Para instalar:

1. Crear la base de datos MySQL con el nombre polucionsonora_mvc
2. Crear el trigger (disparadores) en la base de datos con las siguientes sentencias:
   - Nombre del disparador: eliminar_reportes
   - Tabla: Usuarios
   - Tiempo: BEFORE
   - Evento: DELETE
   - Definición: DELETE FROM reportes WHERE usuarioId = OLD.id
3. Crear el archivo con nombre .env en la raíz del proyecto con las siguientes credenciales personales:
   - DB_NOMBRE=
   - DB_USER=
   - DB_PASSWORD=
   - DB_HOST=
   - EMAIL_HOST=
   - EMAIL_PORT=
   - EMAIL_USER=
   - EMAIL_PASSWORD=
   - BACKEND_URL=http://localhost
   - JWT_SECRET= 
4. Comandos del sistema:
   - Para descargar todos los archivos del package.json: `npm i`
   - Para inicializar el servidor y mantenerlo corriendo: `npm run server`
   - Para inicializar y mantener corriendo el css y el js: `npm run dev`
   - Para importar la base de datos: `npm run db:importar`
   - Para eliminar la base de datos: `npm run db:eliminar`
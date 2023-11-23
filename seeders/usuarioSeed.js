import db from '../config/db.js';
import usuarioPrueba from '../models/usuarioPrueba.js';
import { exit } from 'node:process';
import {Usuario, Reporte} from '../models/asociaciones.js'

const importardatos = async () => {
  try {
    // Autenticar
    await db.authenticate();
    await db.sync();
    await Usuario.bulkCreate(usuarioPrueba);
    console.log('Usuario importado');
    exit(0);
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const eliminarDatos = async () => {
  try {
    // Elimina todos los registros de la tabla 'Reporte'
    await Reporte.destroy({ where: {}, truncate: { cascade: true } }); 

    // Elimina todos los registros de la tabla 'Usuario' después de eliminar los de 'Reporte'
    await Usuario.destroy({ where: {}, truncate: { cascade: true } });

    // Muestra un mensaje de éxito si la eliminación fue exitosa
    console.log('Usuarios y Reportes eliminados con éxito');
  } catch (error) {
    // En caso de error, muestra el error en la consola y sale con un código de error 1
    console.error(error);
    process.exit(1);
  }
};


if (process.argv[2] === '-i') {
  importardatos();
}

if (process.argv[2] === '-e') {
  eliminarDatos();
}

import Usuario from '../models/Usuario.js';
import db from '../config/db.js';
import Sequelize from 'sequelize';
import usuarioPrueba from '../models/usuarioPrueba.js';
import { exit } from 'node:process';

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
    await Promise.all([
      Usuario.destroy({ where: {}, truncate: true }),
    ]);
    console.log('Datos eliminados');
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === '-i') {
  importardatos();
}

if (process.argv[2] === '-e') {
  eliminarDatos();
}

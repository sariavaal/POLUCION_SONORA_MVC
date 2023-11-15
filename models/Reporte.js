import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Reporte = db.define('reportes', {
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nivelRuido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,  // Aquí podrías almacenar la URL de la imagen o el nombre del archivo
    allowNull: true,  // Puede ser nulo si aún no se proporciona una imagen
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Reporte;

import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Reporte = db.define('reportes', {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nivelRuido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,  
    allowNull: true,  // Puede ser nulo si aún no se proporciona una imagen
  },
  calle: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  lat:{
    type: DataTypes.STRING,
    allowNull: false,

  },
  lng:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'atendido'), 
    allowNull: false,
    defaultValue: 'pendiente', // Valor por defecto al crear un nuevo reporte
  }, 
      
});

export default Reporte;

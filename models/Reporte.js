import db from '../config/db.js';
import { DataTypes } from 'sequelize';
import Usuario from './Usuario.js';

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
    allowNull: true,
  },
  calle: {
    type: DataTypes.STRING(60),
    allowNull: false,
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'atendido'),
    allowNull: false,
    defaultValue: 'pendiente',
  },
  publicado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
},
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Usuarios', // Corregido aquí, utiliza el nombre de la tabla
      key: 'id',
    },
  },
});

Reporte.associate = (models) => {
  Reporte.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'usuarioId' });
};

export default Reporte;

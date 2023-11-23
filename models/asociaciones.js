import Usuario from './Usuario.js';
import Reporte from './Reporte.js';

// Asociación con el modelo de Usuario
Reporte.associate = (models) => {
  Reporte.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'usuarioId' });
};



export { Usuario, Reporte };

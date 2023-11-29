import bcrypt from 'bcrypt'
import db from '../config/db.js'
import {DataTypes} from 'sequelize'
const Usuario = db.define('usuarios', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN  
}, { //hashear password con bcrypt
    hooks: {
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash( usuario.password, salt );

        }
    },
    scopes: {
        eliminarPassword:{
            attributes: {
                exclude: ['password', 'token', 'confirmado', 'createdAt', 'updatedAt']
            }
        }
    }
});



//Metodos personalizados
Usuario.prototype.verificarPassword = function (password){
    return bcrypt.compareSync(password, this.password);

}

export default Usuario
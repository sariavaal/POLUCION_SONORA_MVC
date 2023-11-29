import jwt from 'jsonwebtoken'
import { verificarJWT } from '../helpers/tokens.js'
import Reporte from '../models/Reporte.js';
import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';
import { generarJWT } from '../helpers/tokens.js';

// controllers/adminController.js


const inicioAdmin = (req, res) => {
    if (req.user) {
        // Utilizar el token si es necesario
        const token = req.cookies._token;
        const usuario = verificarJWT(token);
       
        //console.log(req.user)

        res.render('admin/inicioAdmin', {
            pagina: 'Alerta Ruido',
            navbar: true,
            csrfToken: req.csrfToken(),
            datos: req.body,
            usuario: req.user,
            mensaje: `Bienvenido administrador: ${usuario.nombre} ${usuario.apellido}`
        });
    } else {
        // Manejar el caso en que la información del usuario no está disponible
        return res.status(401).json({ mensaje: 'Acceso no autorizado' });
    }
};

export { inicioAdmin };

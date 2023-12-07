import jwt from 'jsonwebtoken';
import { verificarJWT } from '../helpers/tokens.js';

const verificarAdmin = (req, res, next) => {
    // Obtener el token del encabezado de la solicitud
    const token = req.cookies._token;

    try {
        // Verificar si el token es válido
        const decodedToken = verificarJWT(token);

        // Si el token es válido y el rol es 'admin', permitir el acceso a la ruta
        if (decodedToken && decodedToken.rol === 'admin') {
            req.user = decodedToken; // Asignar la información del usuario a req.user
            next();
        } else {
            return res.status(401).json({ mensaje: 'Acceso no autorizado' });
        }
    } catch (error) {
        // Manejar el error de verificación (token inválido, expirado, etc.)
        //console.error('Error al verificar el token:', error.message);
        return res.render('templates/mensaje', {
            pagina: 'Alerta Ruido',
            mensaje: 'Acceso no autorizado, necesitas permisos de administrador para visualizar esta pagina'
        });
    }
};

export { verificarAdmin };



  
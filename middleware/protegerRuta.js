import { verificarJWT } from "../helpers/tokens.js";
import jwt from "jsonwebtoken";

 // Middleware de autenticación con JWT
 const protegerRuta = async (req, res, next) => {
    try {
        const token = req.cookies._token;
  
        // Verifica el token y almacena la información del usuario en req.user
        req.user = await verificarJWT(token);
        //console.log(req.user)
  
        // Verifica si hay información del usuario
        if (!req.user) {
            // Redirige a una página de error 404 o a la página que desees
            return res.status(404).render('templates/error404', {
              pagina:'Error 404',
              mensaje: 'Página no encontrada'
          });
        }
  
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        res.status(401).json({ mensaje: 'Token no válido' });
    }
  };

  export{
    protegerRuta
  }
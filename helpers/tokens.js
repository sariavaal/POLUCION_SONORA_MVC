import jwt from 'jsonwebtoken'

const generarJWT = datos => jwt.sign({id: datos.id, nombre: datos.nombre}, process.env.JWT_SECRET, {expiresIn: '1d'})
const generarId= () => Date.now().toString(32) + Math.random().toString(32).substring(2);


const verificarJWT = token => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Token no válido');
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      // Manejar el error de verificación (token inválido, expirado, etc.)
      console.error('Error al verificar el token:', error.message);
      return null;
    }
  };

 // Middleware de autenticación con JWT
const autenticacionMiddleware = async (req, res, next) => {
  try {
      const token = req.cookies._token;

      // Verifica el token y almacena la información del usuario en req.user
      req.user = await verificarJWT(token);

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
    generarJWT,
    generarId,
    verificarJWT,
    autenticacionMiddleware
}
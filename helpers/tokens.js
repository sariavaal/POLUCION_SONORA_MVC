import jwt from 'jsonwebtoken'

const generarJWT = datos => jwt.sign(
  {id: datos.id, 
  nombre: datos.nombre,
  rol: datos.rol,
  apellido: datos.apellido
}, 
process.env.JWT_SECRET,
{ expiresIn: '1d' }
);

const generarId= () => Date.now().toString(32) + Math.random().toString(32).substring(2);


const verificarJWT = token => {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Token no válido');
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log('Token:', token);
      //console.log('Usuario decodificado:', );console.log('Decoded Token:', decoded);
      console.log('rol:', decoded.rol);
      return decoded;
    } catch (error) {
      // Manejar el error de verificación (token inválido, expirado, etc.)
      console.error('Error al verificar el token:', error.message);
      return null;
    }
  };

export{
    generarJWT,
    generarId,
    verificarJWT,
}
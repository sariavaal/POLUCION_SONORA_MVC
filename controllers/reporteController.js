import jwt from 'jsonwebtoken'
import {verificarJWT} from '../helpers/tokens.js'

const inicio = (req, res) => {
    // Extraer la información del usuario desde el token almacenado en la cookie
    const token = req.cookies._token;
  
    // Decodificar el token para obtener la información del usuario
    const usuario = verificarJWT(token);
  
    // Verificar si la verificación del token tuvo éxito y si hay información del usuario
    if (usuario && usuario.nombre) {
      //console.log(usuario);
  
      res.render('reportes/inicio', {
        pagina: 'Preguntas Frecuentes',
        barra: true,
        csrfToken : req.csrfToken(),
        mensaje: `¡Bienvenido, ${usuario.nombre}!` // Puedes utilizar el nombre del usuario en el mensaje
      });
    } else {
      // Manejar el caso en el que la verificación del token falla o no hay información del usuario
      console.error('Error al verificar el token o no hay información del usuario');
      res.render('reportes/inicio', {
        pagina: 'Preguntas Frecuentes',
        barra: true,
        mensaje: '¡Bienvenido!' // Puedes proporcionar un mensaje predeterminado o manejarlo según tu lógica
      });
    }
  };

  const formularioReporte = (req, res) =>{
    res.render('reportes/crear', {
        pagina: 'Crear Reporte',
        barra: true,
        csrfToken : req.csrfToken()
    })
}
  


export {
    inicio,
    formularioReporte
}
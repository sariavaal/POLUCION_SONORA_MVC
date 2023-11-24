import jwt from 'jsonwebtoken'
import {verificarJWT} from '../helpers/tokens.js'
import Reporte from '../models/Reporte.js';
import { check, validationResult } from 'express-validator';

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
        mensaje: `¡Bienvenido, ${usuario.nombre}!` 
      });
    } else {
      // Manejar el caso en el que la verificación del token falla o no hay información del usuario
      console.error('Error al verificar el token o no hay información del usuario');
      res.render('reportes/inicio', {
        pagina: 'Preguntas Frecuentes',
        barra: true,
        mensaje: '¡Bienvenido!' 
      });
    }
  };

  const formularioReporte = (req, res) =>{
    res.render('reportes/crear', {
        pagina: 'Crear Reporte',
        barra: true,
        csrfToken: req.csrfToken(),
        datos:{}
    })
}
const crearReporte = async (req, res) => {
  // Extraer los errores de validación después de la validación
  const errores = validationResult(req);

  // Manejar los errores de validación
  if (!errores.isEmpty()) {
    console.log('Errores de validación:', errores.array());
    // Renderizar nuevamente la página con los errores
    return res.render('reportes/crear', {
      pagina: 'Crear Reporte',
      barra: true,
      csrfToken: req.csrfToken(),
      errores: errores.array(),
      datos: req.body
    });
  }
  const usuarioId = req.user.id;
  //crear reporte
  //console.log(req.body)
  const {descripcion, nivelRuido, calle, lat, lng} = req.body
  try {
    // Crear el reporte en la base de datos
    const nuevoReporte = await Reporte.create({
      descripcion,
      nivelRuido,
      calle,
      lat,
      lng,
      imagen:'',
      usuarioId,
    });


    const {id} = nuevoReporte
    res.redirect(`/reportes/agregar-imagen/${id}`)
  } catch (error) {
    console.error('Error al crear el reporte:', error);
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
}

const agregarImagen = async (req, res) => {
  const { id } = req.params;

  // Validar que el reporte exista
  const reporte = await Reporte.findByPk(id);

  if (!reporte) {
    return res.redirect('/reportes');
  }
  //verificar si esta publicado el reporte
  if(reporte.publicado){
    return res.redirect('/reportes');
  }

  //validar que pertenece al user
  if( req.user.id.toString() !== reporte.usuarioId.toString()){
    return res.redirect('/reportes');

  }
  



    res.render('reportes/agregar-imagen',{
        pagina: `Reporte en zona de: ${reporte.calle}`,
        csrfToken: req.csrfToken(),
        reporte
    })

}
const almacenarImagenes = async (req, res, next) => {
  const { id } = req.params;

  // Validar que el reporte exista
  const reporte = await Reporte.findByPk(id);

  if (!reporte) {
    return res.redirect('/reportes');
  }
  //verificar si esta publicado el reporte
  if(reporte.publicado){
    return res.redirect('/reportes');
  }

  //validar que pertenece al user
  if( req.user.id.toString() !== reporte.usuarioId.toString()){
    return res.redirect('/reportes');
  }
  try {
    // Guardar las imágenes y actualizar el reporte
    console.log(req.files); 
  
    const nombresImagenes = req.files.map(file => file.filename);
    console.log(nombresImagenes)
    const nombresConcatenados = nombresImagenes.join(', '); 
    console.log(nombresConcatenados)
  
    reporte.imagen = nombresConcatenados; 
  
    reporte.publicado = 1;
  
    await reporte.save();
    next()
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
  }
  

}



  
 


export {
    inicio,
    formularioReporte,
    crearReporte,
    agregarImagen,
    almacenarImagenes
    
}
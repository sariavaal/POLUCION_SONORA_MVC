import jwt from 'jsonwebtoken'
import { verificarJWT } from '../helpers/tokens.js'
import Reporte from '../models/Reporte.js';
import { check, validationResult } from 'express-validator';
import Usuario from '../models/Usuario.js';

const inicio = (req, res) => {
  // Extraer la información del usuario desde el token almacenado en la cookie
  const token = req.cookies._token;
  console.log('Valor de la cookie _token:', req.cookies._token);


  // Decodificar el token para obtener la información del usuario
  const usuario = verificarJWT(token);
  console.log('Usuario después de verificarJWT:', usuario);
  

  // Verificar si la verificación del token tuvo éxito y si hay información del usuario
  if (usuario && usuario.nombre) {
    // Verificar si el usuario tiene el rol de administrador
    if (usuario.rol === 'admin') {
      // Si el usuario es un administrador, redirigir a la ruta de inicioAdmin
      return res.redirect('/reportes/admin/inicioAdmin');
    }

    // Si no es administrador, mostrar la vista normal
    return res.render('reportes/inicio', {
      pagina: 'Inicio',
      barra: true,
      csrfToken: req.csrfToken(),
      mensaje: `¡Bienvenido, ${usuario.nombre}!`
    });
  }

  // Manejar el caso en que la verificación del token falla o no hay información del usuario
  console.error('Error al verificar el token o no hay información del usuario');
  return res.render('reportes/inicio', {
    pagina: 'Preguntas Frecuentes',
    barra: true,
    mensaje: '¡Bienvenido!'
  });
};


const formularioReporte = (req, res) => {
  res.render('reportes/crear', {
    pagina: 'Crear Reporte',
    barra: true,
    csrfToken: req.csrfToken(),
    datos: {}
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
  const { descripcion, nivelRuido, calle, lat, lng } = req.body
  try {
    // Crear el reporte en la base de datos
    const nuevoReporte = await Reporte.create({
      descripcion,
      nivelRuido,
      calle,
      lat,
      lng,
      imagen: '',
      usuarioId,
    });


    const { id } = nuevoReporte
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
  if (reporte.publicado) {
    return res.redirect('/reportes');
  }

  //validar que pertenece al user
  if (req.user.id.toString() !== reporte.usuarioId.toString()) {
    return res.redirect('/reportes');

  }




  res.render('reportes/agregar-imagen', {
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

  // Validar que pertenece al usuario
  if (req.user.id.toString() !== reporte.usuarioId.toString()) {
    return res.redirect('/reportes');
  }

  try {
    // Guardar las imágenes
    console.log(req.files);

    const nombresConcatenados = req.files.map(file => file.filename).join(",");
    console.log(nombresConcatenados);
    if (reporte.imagen === null || reporte.imagen === "") {
      reporte.imagen = nombresConcatenados;
    } else {
      reporte.imagen += `,${nombresConcatenados}`;
    }

    // Establecer como publicado
    reporte.publicado = 1;

    // Guardar el reporte con las imágenes
    await reporte.save();

    return res.json({ msg: 'Imagen subida con exito.' });
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
  }


};

const mostrarReportes = async (req, res) => {
  try {
    // Obtener el ID del usuario actual desde la sesión
    const idUsuario = req.user.id;

    // Obtener todos los reportes asociados al usuario actual
    const reportes = await Reporte.findAll({
      where: {
        usuarioId: idUsuario
      }
    });

    // Obtener los IDs de los usuarios para los reportes encontrados
    const userIds = reportes.map(reporte => reporte.usuarioId);

    // Obtener la información completa de los usuarios
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'apellido'],
      where: {
        id: userIds
      }
    });

    // Crear un objeto de mapeo para asociar el ID de usuario con la información completa del usuario
    const usuarioMap = {};
    usuarios.forEach(usuario => {
      usuarioMap[usuario.id] = { nombre: usuario.nombre, apellido: usuario.apellido };
    });

    // Asignar el nombre y apellido de usuario a cada reporte
    reportes.forEach(reporte => {
      const usuarioInfo = usuarioMap[reporte.usuarioId];
      reporte.nombreUsuario = usuarioInfo.nombre;
      reporte.apellidoUsuario = usuarioInfo.apellido;

      // Verificar si createdAt existe antes de formatear
      if (reporte.createdAt) {
        // Formatear la fecha
        const fechaFormateada = `${reporte.createdAt.getDate()}/${reporte.createdAt.getMonth() + 1}/${reporte.createdAt.getFullYear()}`;
        reporte.fechaFormateada = fechaFormateada;
      }

      //console.log(reporte);
    });

    // Renderizar la vista 'mis-reportes.pug' y pasar los reportes como variable
    res.render('reportes/mis-reportes', {
      reportes,
      pagina: 'Mis Reportes',
      barra: true,
      error: true
    });
  } catch (error) {
    // Manejar errores aquí
    console.error(error);
    res.status(500).send('Error al obtener los reportes');
  }
};


const formularioEdicionUsuario = async (req, res) => {
  try {
    // Obtener el ID del usuario desde la sesión
    const idUsuario = req.user.id; 

    // Obtener el usuario actual desde la base de datos usando su ID
    const usuario = await Usuario.findByPk(idUsuario);

    // Verificar si el usuario existe
    if (!usuario) {
      // Manejar el caso en que el usuario no existe
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    // Verificar si hay un parámetro de éxito en la URL
    const exito = req.query.exito === '1';

    // Renderizar la vista con los datos del usuario para el formulario de edición
    res.render('reportes/mi-perfil', {
      pagina: 'Editar Perfil',
      barra: usuario.rol !== 'admin',
      navbar: usuario.rol !== 'user',
      csrfToken: req.csrfToken(),
      usuario: usuario,// Pasar el objeto del usuario a la vista 
    });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir al recuperar el usuario
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el usuario' });
  }
};


const actualizarPerfil = async (req, res) => {
  try {
    // Validar los datos del formulario antes de intentar actualizar el perfil
    const errores = validationResult(req);

    // Manejar los errores de validación
    if (!errores.isEmpty()) {
      console.log('Errores de validación:', errores.array());
      // Renderizar nuevamente la página con los errores
      return res.render('reportes/mi-perfil', {
        pagina: 'Crear Reporte',
        barra: true,
        csrfToken: req.csrfToken(),
        errores: errores.array(),
        datos: req.body
      });
    }

    // Si la validación es exitosa, proceder con la actualización del perfil
    const idUsuario = req.user.id;
    // Obtener los datos actualizados del formulario de edición
    const { nombre, apellido, email, telefono } = req.body;

    // Actualizar los datos del usuario en la base de datos usando Sequelize
    const [numFilasActualizadas, filasActualizadas] = await Usuario.update(
      { nombre, apellido, email, telefono },
      { where: { id: idUsuario } }
    );

    // Verificar si la actualización fue exitosa
    if (numFilasActualizadas === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado o sin cambios' });
    }

    // Mostrar la página de éxito
    return res.status(200).render('templates/mensaje', {
      pagina: 'Datos actualizados',
      mensaje: 'Tus datos han sido actualizados con éxito',
      volverAlInicio: true,
    });

  } catch (error) {
    // Manejar cualquier error que pueda ocurrir al actualizar el usuario
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el perfil' });
  }
};





export {
  inicio,
  formularioReporte,
  crearReporte,
  agregarImagen,
  almacenarImagenes,
  mostrarReportes,
  formularioEdicionUsuario,
  actualizarPerfil

}
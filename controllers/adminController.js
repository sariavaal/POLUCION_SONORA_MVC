import jwt from 'jsonwebtoken'
import { Op } from 'sequelize';
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

//listar reportes
const mostrarReportes = async (req, res) => {
    try {
      // Obtener todos los reportes
      const reportes = await Reporte.findAll();
  
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
  
      // Asignar la información completa de usuario a cada reporte
      reportes.forEach(reporte => {
        const usuarioInfo = usuarioMap[reporte.usuarioId];
        if (usuarioInfo) {
          reporte.nombreUsuario = usuarioInfo.nombre;
          reporte.apellidoUsuario = usuarioInfo.apellido;
          //console.log(`Usuario: ${usuarioInfo.nombre} ${usuarioInfo.apellido}, Reporte: ${reporte.id}`);
        }
  
        // Verificar si createdAt existe antes de formatear
        if (reporte.createdAt) {
          // Formatear la fecha
          const fechaFormateada = `${reporte.createdAt.getDate()}/${reporte.createdAt.getMonth() + 1}/${reporte.createdAt.getFullYear()}`;
          reporte.fechaFormateada = fechaFormateada;
        }
      });
  
      // Renderizar la página
      res.render('admin/mis-reportes', {
        pagina: 'Alerta Ruido',
        mensaje: 'Lista de Reportes',
        navbar: true,
        csrfToken: req.csrfToken(),
        reportes
      });
    } catch (error) {
      // Manejar errores
      console.error('Error al obtener informes:', error);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  };
//ver cada reporte en detalle
const mostrarDetalleReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id);

    if (!reporte) {
      return res.status(404).send('Reporte no encontrado');
    }
    // Convertir el string de nombres de imágenes en un array
    const nombresImagenes = reporte.imagen.split(',');

    // Construir rutas completas para las imágenes
    const rutasImagenes = nombresImagenes.map(nombre => `/uploads/${nombre.trim()}`);

    res.render('admin/detalle-reporte', {
      pagina: 'Alerta Ruido',
      navbar: true,
      mensaje: 'Detalles del Reporte',
      csrfToken: req.csrfToken(),
      reporte,
      imagenes: rutasImagenes,
    });
  } catch (error) {
    console.error('Error al obtener detalles del reporte:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

//editar reportes
const editarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('ID del reporte:', id);

    const reporte = await Reporte.findByPk(id);
    console.log('Reporte encontrado:', reporte);

    if (!reporte) {
      return res.status(404).send('Reporte no encontrado');
    }
    const opcionesEnum = ['pendiente', 'atendido']; // Opciones del campo 'estado'

    res.render('admin/editar-reporte', {
      pagina: 'Alerta Ruido',
      navbar: true,
      mensaje: 'Editar Reporte',
      csrfToken: req.csrfToken(),
      reporte,
      opcionesEnum
    });
  } catch (error) {
    console.error('Error al obtener detalles del reporte:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};



//actualizar reportes
const actualizarReporte = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripción, nivelRuido, estado } = req.body;

    // Verifica si el campo 'estado' se cambió
    if (!estado) {
      return res.status(400).json({ mensaje: 'El campo "estado" es requerido' });
    }

    // Busca el reporte por ID
    const reporte = await Reporte.findByPk(id);

    // Verificar si el reporte existe
    if (!reporte) {
      return res.status(404).send('Reporte no encontrado');
    }

    // Actualiza los valores del reporte
    await reporte.update({
      descripción,
      nivelRuido,
      estado,
    });

    // Redireccionar
    return res.status(200).render('templates/mensaje', {
      pagina: 'Datos actualizados',
      mensaje: 'El reporte ha sido actualizado con éxito',
      volverAlInicio: true,
    });

  } catch (error) {
    console.error('Error al editar el reporte:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const verUsuarios = async (req, res) => {
  let usuarios;

  try {
    usuarios = await Usuario.findAll({
      where: {
        rol: {
          [Op.ne]: 'admin',
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).send('Error al obtener usuarios');
  }

  res.render('admin/mostrar-usuarios', {
    pagina: 'Alerta Ruido',
    navbar: true,
    mensaje: 'Lista de Usuarios',
    csrfToken: req.csrfToken(),
    usuarios,
  });
};
const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    const opcionesEnum = ['user', 'admin'];

    // Puedes hacer algo con el usuario aquí, como renderizar una vista de edición
    res.render('admin/editar-usuario', {
      pagina: 'Alerta Ruido',
      navbar: true,
      csrfToken: req.csrfToken(),
      mensaje: 'Editar Usuario',
      usuario,
      opcionesEnum
    });

  } catch (error) {
    console.error('Error al obtener usuario para editar:', error);
    res.status(500).send('Error al obtener usuario para editar');
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido ,email, telefono, rol} = req.body;

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Realizar la actualización
    await Usuario.update(
      { nombre, apellido ,email, telefono, rol},
      { where: { id: usuario.id } }
    );

    res.render('templates/mensaje', {
      pagina: 'Alerta Ruido',
      navbar: true,
      volverAlInicio: true,
      mensaje: 'Usuario actualizado correctamente',
    });
    
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).send('Error al actualizar usuario');
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(id);
    console.log(id, usuario);
    // Si el usuario no existe, devolver un error 404
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Eliminar el usuario de la base de datos
    await usuario.destroy();

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).send('Error al eliminar usuario');
  }
};



export { 
  inicioAdmin,
  mostrarReportes,
  mostrarDetalleReporte,
  editarReporte,
  actualizarReporte,
  verUsuarios,
  editarUsuario,
  actualizarUsuario,
eliminarUsuario};

      
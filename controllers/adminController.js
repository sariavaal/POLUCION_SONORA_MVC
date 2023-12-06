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

  
  
  
  

export { inicioAdmin,
    mostrarReportes,
mostrarDetalleReporte};

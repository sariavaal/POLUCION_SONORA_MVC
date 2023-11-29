import express from 'express';
import { inicio, formularioReporte, crearReporte, agregarImagen, almacenarImagenes, mostrarReportes, formularioEdicionUsuario, actualizarPerfil} from '../controllers/reporteController.js';
import { body } from "express-validator"
import { protegerRuta } from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';
import { verificarAdmin } from '../middleware/verificarAdmin.js';

const router = express.Router();

const tokensRevocados = new Set();
router.get('/logout', protegerRuta, (req, res) => {
    // Invalidar el token almacenado en el lado del servidor (opcional)
    tokensRevocados.add(req.cookies._token);

    // Eliminar la cookie del token en el lado del cliente
    res.clearCookie('_token');
    
    res.redirect('/auth/login'); // Redirige a la página de inicio u otra página después de cerrar sesión
});
// Rutas protegidas
router.get('/reportes', protegerRuta, inicio);
router.get('/reportes/crear', protegerRuta, formularioReporte);
router.post('/reportes/crear', protegerRuta,
body('descripcion')
.notEmpty().withMessage('La descripcion no puede ir vacia'),
body('nivelRuido')
.notEmpty().withMessage('El nivel de ruido es obligatorio'),
body('lat')
.notEmpty().withMessage('Por favor, ubica la dirección en el mapa'),
crearReporte);

router.get('/reportes/agregar-imagen/:id',
protegerRuta,
agregarImagen
)

router.post('/reportes/agregar-imagen/:id',
    protegerRuta,
    upload.any('imagen',5),  
    almacenarImagenes
);
router.get('/reportes/mis-reportes',
 protegerRuta, 
 mostrarReportes);

 router.get('/reportes/mi-perfil', protegerRuta, formularioEdicionUsuario);
 router.post('/reportes/mi-perfil', protegerRuta, actualizarPerfil);


export default router;



import express from 'express';
import { body } from "express-validator"
import { verificarAdmin } from '../middleware/verificarAdmin.js'
import { protegerRuta } from '../middleware/protegerRuta.js';
import { inicioAdmin, mostrarReportes, mostrarDetalleReporte, editarReporte, actualizarReporte, verUsuarios } from '../controllers/adminController.js'

const router = express.Router();
//para cerrar sesión
const tokensRevocados = new Set();
router.get('/logout', protegerRuta, (req, res) => {
    // Invalidar el token almacenado en el lado del servidor (opcional)
    tokensRevocados.add(req.cookies._token);

    // Eliminar la cookie del token en el lado del cliente
    res.clearCookie('_token');
    
    res.redirect('/auth/login'); // Redirige a la página de login  después de cerrar sesión
});

//RUTAS DEL ADMINISTRADOR
router.get('/inicioAdmin', protegerRuta, verificarAdmin, inicioAdmin )
router.get('/ver-reportes', protegerRuta, verificarAdmin, mostrarReportes )
router.get('/detalle-reporte/:id', protegerRuta, verificarAdmin, mostrarDetalleReporte)
router.get('/editar-reporte/:id', protegerRuta, verificarAdmin, editarReporte)
router.post('/editar-reporte/:id', protegerRuta, verificarAdmin, actualizarReporte)
router.get('/mostrar-usuarios', protegerRuta, verificarAdmin, verUsuarios)




export default router;
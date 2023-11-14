import express from 'express';
import { inicio, formularioReporte } from '../controllers/reporteController.js';
import { autenticacionMiddleware } from '../helpers/tokens.js';
import jwt from 'jsonwebtoken'

const router = express.Router();

const tokensRevocados = new Set();
router.get('/logout', autenticacionMiddleware, (req, res) => {
    // Invalidar el token almacenado en el lado del servidor (opcional)
    tokensRevocados.add(req.cookies._token);

    // Eliminar la cookie del token en el lado del cliente
    res.clearCookie('_token');
    
    res.redirect('/auth/login'); // Redirige a la página de inicio u otra página después de cerrar sesión
});
// Rutas protegidas
router.get('/reportes', autenticacionMiddleware, inicio);
router.get('/reportes/crear', autenticacionMiddleware, formularioReporte);

export default router;

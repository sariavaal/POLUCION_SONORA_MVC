import express from 'express';
import { verificarAdmin } from '../middleware/verificarAdmin.js'
import { protegerRuta } from '../middleware/protegerRuta.js';
import { inicioAdmin } from '../controllers/adminController.js'

const router = express.Router();

//para cerrar sesión
const tokensRevocados = new Set();
router.get('/logout', protegerRuta, (req, res) => {
    // Invalidar el token almacenado en el lado del servidor (opcional)
    tokensRevocados.add(req.cookies._token);

    // Eliminar la cookie del token en el lado del cliente
    res.clearCookie('_token');
    
    res.redirect('/auth/login'); // Redirige a la página de inicio u otra página después de cerrar sesión
});

//RUTAS DEL ADMINISTRADOR
router.get('/inicioAdmin', protegerRuta, verificarAdmin, inicioAdmin )


export default router;
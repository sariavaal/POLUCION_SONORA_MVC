import multer from 'multer';
import path from 'path';
import { generarId } from '../helpers/tokens.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, generarId() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware de manejo de errores para Multer y otros errores
upload.errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Error de Multer
    console.error('Error de Multer:', err.message);
    return res.status(400).json({ error: 'Error al cargar el archivo.' });
  } else if (err) {
    // Otro tipo de error
    console.error('Error:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
  // Si no hay errores, pasa al siguiente middleware
  next();
};

export default upload;

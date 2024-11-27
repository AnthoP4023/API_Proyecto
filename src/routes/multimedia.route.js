import { Router } from 'express';
import { upload } from '../middleware/upload.js';  // Asegúrate de importar la configuración de multer
import { postMultimedia, getMultimedia,getMultimediaxid } from '../controladores/multimedia.Crtl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

// Ruta para obtener todos los archivos multimedia (imágenes y videos)
router.get('/multimedia', getMultimedia);
router.get('/multimedia/:id',getMultimediaxid); // Obtener un usuario por id (requiere token)

// Ruta para subir una imagen o video
router.post('/multimedia', upload.single('file'), postMultimedia); // 'file' es el nombre del campo de archivo

export default router;

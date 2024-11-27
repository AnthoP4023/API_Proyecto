import { Router } from 'express';
import multer from 'multer';
import { getMascotas, getMascotasxid, postMascotas,getRaza,getTipo,getGenero,deleteMascota} from '../controladores/mascotas.Ctrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

// Configurar multer para almacenar en memoria
const storage = multer.memoryStorage(); // Almacena imágenes en memoria
const upload = multer({ storage });

const router = Router();

// Rutas
router.get('/mascotas', getMascotas); // SELECT
router.get('/raza', getRaza); // SELECT
router.get('/tipo', getTipo); // SELECT
router.get('/genero', getGenero); // SELECT

router.get('/mascotas/:id', getMascotasxid); // SELECT por ID
router.post('/mascotas', upload.single('image'), postMascotas); // INSERT
router.delete('/mascotas/:id', deleteMascota); // Eliminar un curso de favoritos

export default router;

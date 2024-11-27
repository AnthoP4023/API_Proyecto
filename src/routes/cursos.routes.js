import { Router } from 'express'
import multer from 'multer';
import {getCursos,getCursosxid,patchCurso} from '../controladores/cursos.Ctrl.js'

// Configurar multer para almacenar en memoria
const storage = multer.memoryStorage(); // Almacena imágenes en memoria
const upload = multer({ storage });

const router=Router()
// armar nuestras rutas

router.get('/cursos', getCursos) //select
router.get('/cursos/:id', getCursosxid) //select x id
router.patch('/cursos/:id', upload.single('image'), patchCurso); // Actualizar parcialmente un evento

export default router 

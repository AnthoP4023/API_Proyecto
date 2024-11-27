import { Router } from 'express'
import { getEventos, getEventosxmsc, postEvento, putEvento, patchEvento, deleteEvento} from '../controladores/eventos.Ctrl.js'
import { verifyToken } from '../jwt/verifyToken.js';

const router=Router()
// armar nuestras rutas

// Rutas para manejar los eventos
router.get('/eventos', getEventos); // Obtener todos los eventos en general
router.get('/eventos/:msc_id',verifyToken, getEventosxmsc); // Obtener todos los eventos de una mascota
router.post('/eventos', verifyToken, postEvento); // Crear un nuevo evento
router.put('/eventos/:id', verifyToken, putEvento); // Editar un evento existente
router.patch('/eventos/:id', verifyToken, patchEvento); // Actualizar parcialmente un evento
router.delete('/eventos/:id', verifyToken, deleteEvento); // Eliminar un evento

export default router


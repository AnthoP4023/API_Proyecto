/* import { Router } from 'express'
import {getFavoritos} from '../controladores/favoritos.Ctrl.js'
const router=Router()
// armar nuestras rutas

router.get('/favoritos', getFavoritos) //select

export default router  */

import { Router } from 'express';
import { getFavoritos, getFavoritosxid, postFavoritos, deleteFavoritosUsrxCur, /* deleteFavoritos */ } from '../controladores/favoritos.Ctrl.js';
import { verifyToken } from '../jwt/verifyToken.js';

const router = Router();

// Rutas para favoritos
router.get('/favoritos', getFavoritos); // Obtener todos los favoritos
router.get('/favoritos/:id', verifyToken, getFavoritosxid); // Obtener favoritos de un usuario específico
router.post('/favoritos', verifyToken, postFavoritos); // Agregar un curso a favoritos
router.delete('/favoritos/:crs_id', verifyToken, deleteFavoritosUsrxCur); // Eliminar un curso de favoritos
//router.delete('/favoritos', verifyToken, deleteFavoritos); // Eliminar todos los favoritos de un usuario

export default router;
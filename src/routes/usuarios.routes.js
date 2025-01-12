import {Router} from 'express'
import	{getUsuarios,getUsarioxid,postUsuarios,login} from '../controladores/usuarios.Ctrl.js'
import { verifyToken } from '../jwt/verifyToken.js';

const router=Router()

router.get('/usuarios', getUsuarios) //select
router.get('/usuarios/:id', getUsarioxid); // Obtener un usuario por id (requiere token)
router.post('/usuarios', postUsuarios)
router.post('/login', login); // login

export default router

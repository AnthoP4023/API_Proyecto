import { Router } from 'express'
import {getCursos,getCursosxid} from '../controladores/cursos.Ctrl.js'
const router=Router()
// armar nuestras rutas

router.get('/cursos', getCursos) //select
router.get('/cursos/:id', getCursosxid) //select x id

export default router 
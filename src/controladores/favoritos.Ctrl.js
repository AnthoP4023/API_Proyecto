import{conmysql} from '../db.js'

/* export const getFavoritos=
async (req,res) => {
    try {
        const [result]= await conmysql.query(' select * from favorito')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error  al consultar favorito"})
    }
}
export const getFavoritosxid=
async(req, res)=>{
    try {
        const [result]=await conmysql.query('select * from clientes where fav_id=?', [req.params.id])
        if(result.length<=0)return res.status(404).json({
            cli_id:0,
            message:"Curso favorito no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'Error  del lado del servidor'})
    }
}

export const postFavoritos=
async(req, res)=>{
    try {
        const{usr_id, crs_id, FechaGuardado}=req.body
        const [rows]=await conmysql.query('insert into clientes (usr_id, crs_id, FechaGuardado) values(?,?,?)',
             [cusr_id, crs_id, FechaGuardado])
        res.send({
            id:rows.insertId,
            message:"Error al registrar favorito"
        })

    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
        
    }
} */

// Obtener todos los favoritos de todos los usuarios (podrías limitar esto a un administrador)
export const getFavoritos = async (req, res) => {
    try {
        const [result] = await conmysql.query(`
            SELECT favorito.fav_id, 
                   usuarios.usr_id, usuarios.usr_nombres, 
                   cursos.crs_id, cursos.crs_nombres, cursos.crs_descripcion, cursos.crs_img_vid,
                   favorito.FechaGuardado
            FROM favorito
            INNER JOIN usuarios ON favorito.usr_id = usuarios.usr_id
            INNER JOIN cursos ON favorito.crs_id = cursos.crs_id
        `);
        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error al consultar favoritos" });
    }
};

// Obtener los favoritos por ID de usuario
export const getFavoritosxid = async (req, res) => {
    try {
        const usr_id = req.user.id; // Usuario autenticado desde el token
        const [result] = await conmysql.query(`
            SELECT favorito.fav_id, 
                   usuarios.usr_id, usuarios.usr_nombres, 
                   cursos.crs_id, cursos.crs_nombres, cursos.crs_descripcion, cursos.crs_img_vid,
                   favorito.FechaGuardado
            FROM favorito
            INNER JOIN usuarios ON favorito.usr_id = usuarios.usr_id
            INNER JOIN cursos ON favorito.crs_id = cursos.crs_id
            WHERE usuarios.usr_id = ?
        `, [usr_id]);

        if (result.length <= 0) return res.status(404).json({ message: "No se encontraron favoritos para este usuario." });

        res.json(result);
    } catch (error) {
        return res.status(500).json({ message: "Error del lado del servidor" });
    }
};

// Agregar un curso a favoritos
export const postFavoritos = async (req, res) => {
    try {
        const usr_id = req.user.id; // Usuario autenticado desde el token
        const { crs_id } = req.body;

        if (!crs_id) {
            return res.status(400).json({ message: "Falta el ID del curso para agregar a favoritos." });
        }
        
        const [rows] = await conmysql.query(`
            INSERT INTO favorito (usr_id, crs_id) VALUES (?, ?)
        `, [usr_id, crs_id]);

        res.status(201).send({
            fav_id: rows.insertId,
            message: "Curso agregado a favoritos correctamente."
        });
    } catch (error) {
        return res.status(500).json({ message: "Error del lado del servidor" });
    }
};

// Eliminar un curso de favoritos
export const deleteFavoritosUsrxCur = async (req, res) => {
    try {
        const usr_id = req.user.id; // Usuario autenticado desde el token
        const { crs_id } = req.params;

        // Elimina el registro basado en el usuario y el curso
        const [result] = await conmysql.query(`
            DELETE FROM favorito WHERE usr_id = ? AND crs_id = ?
        `, [usr_id, crs_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el favorito para eliminar." });
        }

        res.json({ message: "Curso eliminado de favoritos correctamente." });
    } catch (error) {
        return res.status(500).json({ message: "Error del lado del servidor" });
    }
};

//PARA BORRAR TODOS LOS CURSOS FAVORITOS
/* export const deleteFavoritos = async (req, res) => {
    try {
        const usr_id = req.user.id; // Usuario autenticado desde el token

        const [result] = await conmysql.query(`
            DELETE FROM favorito WHERE usr_id = ?
        `, [usr_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontraron cursos favoritos para eliminar." });
        }

        res.json({ message: "Todos los cursos favoritos fueron eliminados correctamente." });
    } catch (error) {
        return res.status(500).json({ message: "Error del lado del servidor" });
    }
}; */

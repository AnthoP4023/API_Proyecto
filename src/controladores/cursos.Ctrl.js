import{conmysql} from '../db.js'
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
    cloud_name: 'ddvrhqgsm',  // Reemplaza con tu Cloud Name
    api_key: '113551118694466',        // Reemplaza con tu API Key
    api_secret: '4zk8XUMg2Fkc2Hk0qJMlbLtCZh4'   // Reemplaza con tu API Secret
})

export const getCursos=
async (req,res) => {
    try {
        const [result]= await conmysql.query(' select * from cursos where msc_id is null ')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error  al consultar curso"})
    }
}

export const getCursosxid=
async(req, res)=>{
    try {
        const [result]=await conmysql.query('select * from cursos where crs_id=?', [req.params.id])
        if(result.length<=0)return res.status(404).json({
            cli_id:0,
            message:"Curso no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'Error  del lado del servidor'})
    }
}

export const patchCurso = async (req, res) => {
    try {
      const { id } = req.params; // ID del curso que se desea modificar
      const { crs_nombres, crs_descripcion } = req.body; // Campos que se pueden actualizar
  
      let crs_img_vid = null; // Para almacenar la URL de la nueva imagen
  
      // Si hay una imagen cargada, súbela a Cloudinary
      if (req.file) {
        console.log('Imagen recibida:', req.file);
  
        // Subir la imagen desde el buffer a Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: 'Cursos_Imagenes', // Carpeta en Cloudinary
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(req.file.buffer);
        });
  
        console.log('Resultado de la carga en Cloudinary:', uploadResult);
        crs_img_vid = uploadResult.secure_url; // URL segura de la imagen
      }
  
      // Construir el objeto para actualizar
      const updateFields = {};
      if (crs_nombres) updateFields.crs_nombres = crs_nombres;
      if (crs_descripcion) updateFields.crs_descripcion = crs_descripcion;
      if (crs_img_vid) updateFields.crs_img_vid = crs_img_vid;
  
      // Verificar si hay algo que actualizar
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No se enviaron campos para actualizar." });
      }
  
      // Generar la consulta dinámica para actualizar solo los campos enviados
      const setClause = Object.keys(updateFields)
        .map((key) => `${key} = ?`)
        .join(', ');
  
      const values = [...Object.values(updateFields), id];
  
      const [result] = await conmysql.query(
        `UPDATE cursos SET ${setClause} WHERE crs_id = ?`,
        values
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Curso no encontrado." });
      }
  
      // Opcional: Retornar los datos actualizados
      const [updatedCurso] = await conmysql.query('SELECT * FROM cursos WHERE crs_id = ?', [id]);
      res.json({
        message: "Curso actualizado correctamente.",
        curso: updatedCurso[0],
      });
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
      return res.status(500).json({ message: "Error del lado del servidor", error: error.message });
    }
  };

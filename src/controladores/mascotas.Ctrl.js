import{conmysql} from '../db.js'
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dcles1yod',  // Reemplaza con tu Cloud Name
  api_key: '643144616894173',        // Reemplaza con tu API Key
  api_secret: 'BN1IGzGDdvOOUcUwEWiSMy6dTrA'   // Reemplaza con tu API Secret
})

// Obtener las mascotas de un usuario específico
export const getMascotas = async (req, res) => {
  try {
    const { usr_id } = req.query;  // Obtiene el ID del usuario desde la query
    const [result] = await conmysql.query('SELECT * FROM mascotas WHERE usr_id = ?', [usr_id]);
    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error al consultar mascotas' });
  }
};
 
export const getRaza=
async (req,res) => {
    try {
        const [result]= await conmysql.query(' select * from razamsc')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error  al consultar razamsc"})
    }
}
export const getTipo=
async (req,res) => {
    try {
        const [result]= await conmysql.query(' select * from tipomsc')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error  al consultar tipomsc"})
    }
}


export const getGenero=
async (req,res) => {
    try {
        const [result]= await conmysql.query(' select * from generomsc')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error  al consultar generomsc"})
    }
}


export const getMascotasxid=
async(req, res)=>{
    try {
        const [result]=await conmysql.query('select * from mascotas where msc_id=?', [req.params.id])
        if(result.length<=0)return res.status(404).json({
            msc_id	:0,
            message:"Mascota no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'Error  del lado del servidor'})
    }
}

export const postMascotas = async (req, res) => {
  try {
    // Extracción de datos del cuerpo de la solicitud
    const { msc_nombres, tipm_id, razm_id, msc_fechnaci, genm_id, usr_id } = req.body;
    console.log('Datos recibidos del cuerpo:', req.body); // Verifica los datos

    let msc_imagen = null; // URL de la imagen

    // Verificar si se subió una imagen
    if (req.file) {
      console.log('Imagen recibida:', req.file);

      // Subir la imagen a Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'Mascotas_Imagenes', // Carpeta en Cloudinary
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(req.file.buffer); // Subir la imagen desde el buffer
      });

      console.log('Resultado de la carga en Cloudinary:', uploadResult);
      msc_imagen = uploadResult.secure_url; // URL segura de la imagen subida
    } else {
      console.log('No se recibió ninguna imagen.');
    }

    // Insertar en la base de datos
    const [rows] = await conmysql.query(
      'INSERT INTO mascotas (msc_nombres, tipm_id, razm_id, msc_fechnaci, genm_id, msc_imagen, usr_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [msc_nombres, tipm_id, razm_id, msc_fechnaci, genm_id, msc_imagen, usr_id]
    );

    console.log('Mascota insertada con ID:', rows.insertId);

    // Responder al cliente con los datos de la mascota insertada
    res.status(201).json({
      mensaje: 'Mascota guardada correctamente.',
      msc_id: rows.insertId,
      msc_imagen: msc_imagen, // URL de la imagen subida
    });
  } catch (error) {
    console.error('Error al crear la mascota:', error);
    return res.status(500).json({ message: 'Error del lado del servidor', error: error.message });
  }
};

export const deleteMascota = async (req, res) => {
  try {
      const [rows] = await conmysql.query('DELETE FROM mascotas WHERE msc_id = ?', [req.params.id]);
      if (rows.affectedRows <= 0) {
          return res.status(404).json({
              id: 0,
              message: "No se pudo eliminar la mascota"
          });
      }
      res.sendStatus(202); // Responde con un código de estado 202 para indicar que la eliminación fue exitosa
  } catch (error) {
      return res.status(500).json({ message: "Error en el servidor al eliminar la mascota" });
  }
}

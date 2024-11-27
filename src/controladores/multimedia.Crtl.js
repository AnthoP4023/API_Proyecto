import { conmysql } from '../db.js';  // Asegúrate de importar la conexión
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dcles1yod',
  api_key: '643144616894173',
  api_secret: 'BN1IGzGDdvOOUcUwEWiSMy6dTrA',
});

export const postMultimedia = async (req, res) => {
  try {
    let file_url = null; // Variable para la URL del archivo subido

    // Verificar si se recibió un archivo
    if (req.file) {
      console.log('Archivo recibido:', req.file); // Mostrar detalles del archivo

      // Determinar el tipo de archivo y ajustar el tipo de recurso para Cloudinary
      const isVideo = req.file.mimetype.startsWith('video/');
      const isGif = req.file.mimetype === 'image/gif';

      // Subir el archivo a Cloudinary con opciones específicas dependiendo del tipo
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: isVideo ? 'video' : isGif ? 'image' : 'auto', // Usar 'image' para GIFs y 'video' para videos
            public_id: req.file.originalname.replace(/\.[^/.]+$/, ""), // Usar el nombre original sin la extensión
            eager: [
              { width: 300, height: 300, crop: "pad", audio_codec: "none" },  // Crear versión optimizada
              { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } // Otra versión optimizada
            ],
            eager_async: true, // Subir las versiones optimizadas en segundo plano
            eager_notification_url: "https://mysite.example.com/notify_endpoint" // URL para notificación (si es necesario)
          },
          (error, result) => {
            if (error) {
              console.error('Error al subir el archivo a Cloudinary:', error); // Imprimir el error
              reject(error);
            } else {
              console.log('Resultado de la subida a Cloudinary:', result); // Mostrar la respuesta de Cloudinary
              resolve(result);
            }
          }
        ).end(req.file.buffer); // Enviar el archivo en formato de buffer
      });

      file_url = uploadResult.secure_url; // Obtener la URL del archivo subido
    } else {
      return res.status(400).json({ message: 'No se recibió ningún archivo para subir' });
    }

    // Obtener el nombre del archivo (sin la extensión)
    const file_name = req.file.originalname.replace(/\.[^/.]+$/, "");

    // Insertar la URL y el nombre del archivo en la tabla multimedia
    const [rows] = await conmysql.query(
      'INSERT INTO multimedia (mult_nombre, mul_ruta) VALUES (?, ?)',
      [file_name, file_url]
    );

    res.status(201).json({
      message: 'Archivo multimedia guardado correctamente.',
      mult_id: rows.insertId,  // ID del archivo insertado
      mult_nombre: file_name,  // Nombre del archivo
      mul_ruta: file_url,      // URL del archivo subido
    });
  } catch (error) {
    console.error('Error al guardar el archivo multimedia:', error); // Registrar el error completo
    return res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// Obtener todos los archivos multimedia (imágenes y videos)
export const getMultimedia = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM multimedia');
    res.json(result);
  } catch (error) {
    console.error('Error al consultar multimedia:', error);
    return res.status(500).json({ message: "Error al consultar multimedia" });
  }
};

// Función que retorna un usuario con el ID
export const getMultimediaxid = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM multimedia WHERE mult_id = ?', [req.params.id]);
    if (result.length <= 0) return res.status(404).json({
      id: 0,
      message: "Multimedia no encontrado"
    });
    res.json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

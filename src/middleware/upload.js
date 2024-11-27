import multer from 'multer';

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes y videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only images and videos are allowed.'), false); // Rechaza si el tipo no es válido
  }

  cb(null, true); // Permite la carga si es válido
};

const upload = multer({
  storage,       // Almacenar en memoria
  fileFilter,    // Filtro para tipo de archivo
  limits: {       // Opcional: límite de tamaño (por ejemplo, 10 MB)
    fileSize: 10 * 1024 * 1024,  // Limitar tamaño a 10 MB
  },
});

export { upload };

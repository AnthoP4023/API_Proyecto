import express from 'express';
import cors from 'cors'; // Importa los paquetes cors --permisos de accesos
import { fileURLToPath } from 'url';
import usuariosRoutes from './routes/usuarios.routes.js';
import mascotasRoutes from './routes/mascotas.routes.js';
import favoritosRoutes from './routes/favoritos.Ctrl.js';
import cursosRoutes from './routes/cursos.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import multimedia from './routes/multimedia.route.js';

import path from 'path';

// Definir el módulo de ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
  origin: '*', // La dirección IP del servidor o dominio permitido
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // Para que interprete los objetos JSON
app.use(express.urlencoded({ extended: true })); // Se añade para poder receptar formularios

// Ya no necesitas esta línea porque no estás usando la carpeta 'uploads':
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api', usuariosRoutes);
app.use('/api', mascotasRoutes);
app.use('/api', favoritosRoutes);
app.use('/api', cursosRoutes);
app.use('/api', eventosRoutes);
app.use('/api', multimedia);

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Endpoint not found',
  });
});

export default app;

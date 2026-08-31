import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tramitesRouter from './routes/tramites';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES GLOBALES ---
app.use(cors()); // Permite peticiones desde React (Frontend)
app.use(express.json()); // Permite parsear el body en formato JSON

// Middleware personalizado de Logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pasa la solicitud al siguiente middleware/controlador
});

// --- RUTAS ---
app.use('/api/tramites', tramitesRouter);

// Ruta de Salud (Healthcheck)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Levantar Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
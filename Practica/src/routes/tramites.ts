import { Router, Request, Response } from 'express';
import { supabase } from './db'; // Importamos la conexión

const router = Router();

// Interface para tipar los trámites
export interface Tramite {
  id?: number;
  titulo: string;
  categoria: string;
  estado?: string;
  created_at?: string;
}

// -----------------------------------------------------------------------------
// GET /api/tramites (Obtener todos o filtrar por categoría)
// -----------------------------------------------------------------------------
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoria } = req.query;

    // Construimos la consulta SQL/Supabase
    let query = supabase.from('tramites').select('*');

    if (categoria) {
      query = query.ilike('categoria', `%${categoria as string}%`);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -----------------------------------------------------------------------------
// GET /api/tramites/:id (Obtener por ID)
// -----------------------------------------------------------------------------
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    const { data, error } = await supabase
      .from('tramites')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Trámite no encontrado' });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// -----------------------------------------------------------------------------
// POST /api/tramites (Insertar en PostgreSQL)
// -----------------------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const { titulo, categoria } = req.body;

    // Validación básica de campos
    if (!titulo || !categoria) {
      return res.status(400).json({ error: 'Título y categoría son requeridos' });
    }

    // Inserción en Supabase asegurando el campo "estado" por defecto
    const { data, error } = await supabase
      .from('tramites')
      .insert([{ titulo, categoria, estado: 'pendiente' }])
      .select()
      .single();

    if (error) {
      console.error('❌ Error de Supabase:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Trámite guardado:', data);
    return res.status(201).json(data);
  } catch (err) {
    console.error('❌ Error del servidor:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
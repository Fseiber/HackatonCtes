import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { createTramiteSchema, updateTramiteSchema } from '../schemas/tramite.schema';
import * as tramiteService from '../services/tramite.service';

export const getTramites = async (req: Request, res: Response) => {
  try {
    const categoria = req.query.categoria as string | undefined;
    const tramites = await tramiteService.getAllTramites(categoria);
    return res.json(tramites);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error al obtener trámites' });
  }
};

export const getTramite = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID enviado no es válido' });
    }

    const tramite = await tramiteService.getTramiteById(id);
    return res.json(tramite);
  } catch (err: any) {
    return res.status(404).json({ error: 'Trámite no encontrado' });
  }
};

export const createTramite = async (req: Request, res: Response) => {
  try {
    // Validación estricta con Zod 🛡️
    const validData = createTramiteSchema.parse(req.body);
    const nuevoTramite = await tramiteService.createTramiteDB(validData);
    return res.status(201).json(nuevoTramite);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        detalles: err.issues.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
      });
    }
    return res.status(500).json({ error: err.message || 'Error al crear el trámite' });
  }
};

export const updateTramite = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID enviado no es válido' });
    }

    const validData = updateTramiteSchema.parse(req.body);
    const tramiteActualizado = await tramiteService.updateTramiteDB(id, validData);
    return res.json(tramiteActualizado);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: 'Datos de entrada inválidos',
        detalles: err.issues.map((e) => ({ campo: e.path.join('.'), mensaje: e.message })),
      });
    }
    return res.status(500).json({ error: err.message || 'Error al actualizar el trámite' });
  }
};

export const deleteTramite = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID enviado no es válido' });
    }

    await tramiteService.deleteTramiteDB(id);
    return res.json({ mensaje: 'Trámite eliminado correctamente' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Error al eliminar el trámite' });
  }
};
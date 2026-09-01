import { supabase } from '../routes/db';
import type { CreateTramiteInput, UpdateTramiteInput } from '../schemas/tramite.schema';

export const getAllTramites = async (categoria?: string) => {
  let query = supabase.from('tramites').select('*');

  if (categoria) {
    query = query.ilike('categoria', `%${categoria}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

// Trae el trámite + sus Requisitos + sus Pasos (Relaciones JOIN)
export const getTramiteById = async (id: number) => {
  const { data, error } = await supabase
    .from('tramites')
    .select(`
      *,
      requisitos (*),
      pasos_tramite (*)
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const createTramiteDB = async (datos: CreateTramiteInput) => {
  const { data, error } = await supabase
    .from('tramites')
    .insert([{ ...datos, estado: 'pendiente' }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const updateTramiteDB = async (id: number, datos: UpdateTramiteInput) => {
  const { data, error } = await supabase
    .from('tramites')
    .update(datos)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const deleteTramiteDB = async (id: number) => {
  const { error } = await supabase.from('tramites').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
};
import type { Tramite } from '../types/tramite';

const API_URL = 'http://localhost:3000/api/tramites';

export const getTramites = async (categoria?: string): Promise<Tramite[]> => {
  const url = categoria ? `${API_URL}?categoria=${encodeURIComponent(categoria)}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener los trámites');
  return res.json();
};

export const createTramite = async (nuevoTramite: { titulo: string; categoria: string }): Promise<Tramite> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoTramite),
  });
  if (!res.ok) throw new Error('Error al crear el trámite');
  return res.json();
};
import type { Tramite } from '../types/tramite';

const API_URL = 'http://localhost:3000/api/tramites';

export const getTramites = async (categoria?: string): Promise<Tramite[]> => {
  const url = categoria ? `${API_URL}?categoria=${encodeURIComponent(categoria)}` : API_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al obtener la lista de trámites');
  return res.json();
};

export const getTramiteById = async (id: number): Promise<Tramite> => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener el detalle del trámite');
  return res.json();
};

export const createTramite = async (nuevoTramite: {
  titulo: string;
  categoria: string;
  descripcion?: string;
}): Promise<Tramite> => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoTramite),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Error al crear el trámite');
  }
  return res.json();
};
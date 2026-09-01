export interface Requisito {
  id: number;
  nombre: string;
  obligatorio: boolean;
}

export interface PasoTramite {
  id: number;
  orden: number;
  titulo: string;
  organismo: string;
  descripcion?: string;
}

export interface Tramite {
  id: number;
  titulo: string;
  descripcion?: string;
  categoria: string;
  jurisdiccion?: string;
  costo?: number;
  tiempo_estimado?: string;
  estado?: string;
  created_at?: string;
  requisitos?: Requisito[];
  pasos_tramite?: PasoTramite[];
}
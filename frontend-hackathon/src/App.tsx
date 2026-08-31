import React, { useEffect, useState } from 'react';
import type { Tramite } from './types/tramite';
import { getTramites, createTramite } from './services/api';

export default function App() {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const cargarTramites = async () => {
      try {
        setLoading(true);
        const data = await getTramites();
        if (isMounted) {
          setTramites(data);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError('No se pudo conectar con el servidor backend.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    cargarTramites();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titulo.trim() || !categoria.trim()) return;

    try {
      const nuevo = await createTramite({ titulo, categoria });
      setTramites((prev) => [...prev, nuevo]);
      setTitulo('');
      setCategoria('');
    } catch {
      alert('Error al guardar el trámite');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>🏛️ Gestión de Trámites</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Título del trámite"
          value={titulo}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitulo(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoria(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Agregar
        </button>
      </form>

      {loading && <p>Cargando datos desde PostgreSQL...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tramites.map((item) => (
            <li
              key={item.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{item.titulo}</strong>
                <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                  ({item.categoria})
                </span>
              </div>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: item.estado === 'completado' ? '#e6fffa' : '#fffaf0',
                  color: item.estado === 'completado' ? '#234e52' : '#7b341e',
                }}
              >
                {item.estado}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { getTramites, getTramiteById } from './services/api';
import type { Tramite } from './types/tramite';

export function App() {
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [tramiteSeleccionado, setTramiteSeleccionado] = useState<Tramite | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>('');

  useEffect(() => {
    const fetchTramites = async (): Promise<void> => {
      try {
        setCargando(true);
        const data: Tramite[] = await getTramites();
        setTramites(data);
      } catch (err: unknown) {
        console.error('Error al cargar trámites:', err);
      } finally {
        setCargando(false);
      }
    };

    fetchTramites();
  }, []);

  const verDetalle = async (id: number): Promise<void> => {
    try {
      setCargando(true);
      const detalle: Tramite = await getTramiteById(id);
      setTramiteSeleccionado(detalle);
    } catch (err: unknown) {
      console.error('Error al cargar detalle:', err);
    } finally {
      setCargando(false);
    }
  };

  const tramitesFiltrados = tramites.filter(
    (t) =>
      t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Encabezado */}
      <header style={{ borderBottom: '1px solid #334155', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🏛️ Corrientes 360
        </h2>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          👤 Ciudadano: <strong>Facundo Seiber</strong>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        {tramiteSeleccionado ? (
          /* VISTA DETALLE DEL TRÁMITE */
          <div>
            <button
              onClick={() => setTramiteSeleccionado(null)}
              style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginBottom: '1.5rem' }}
            >
              ← Volver al catálogo
            </button>

            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '2rem' }}>
              <span style={{ background: '#0284c7', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {tramiteSeleccionado.jurisdiccion || 'Municipal'}
              </span>
              <h1 style={{ color: '#38bdf8', marginTop: '0.5rem' }}>{tramiteSeleccionado.titulo}</h1>
              <p style={{ color: '#cbd5e1' }}>{tramiteSeleccionado.descripcion || 'Sin descripción disponible.'}</p>

              <div style={{ display: 'flex', gap: '1.5rem', margin: '1.5rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                <span>💰 <strong>Costo:</strong> ${tramiteSeleccionado.costo || 0}</span>
                <span>⏱️ <strong>Tiempo estimado:</strong> {tramiteSeleccionado.tiempo_estimado || '24 hs'}</span>
              </div>

              <hr style={{ borderColor: '#334155', margin: '1.5rem 0' }} />

              {/* Requisitos */}
              <h3>📄 Requisitos Documentales</h3>
              {tramiteSeleccionado.requisitos && tramiteSeleccionado.requisitos.length > 0 ? (
                <ul style={{ paddingLeft: '1.2rem', color: '#cbd5e1' }}>
                  {tramiteSeleccionado.requisitos.map((req) => (
                    <li key={req.id} style={{ marginBottom: '0.5rem' }}>
                      {req.nombre} {req.obligatorio && <strong style={{ color: '#f43f5e' }}>(Obligatorio)</strong>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#94a3b8' }}>No se requieren documentos previos.</p>
              )}

              {/* Ruta / Pasos */}
              <h3 style={{ marginTop: '2rem' }}>🗺️ Ruta del Trámite</h3>
              {tramiteSeleccionado.pasos_tramite && tramiteSeleccionado.pasos_tramite.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {tramiteSeleccionado.pasos_tramite.map((paso) => (
                    <div key={paso.id} style={{ background: '#0f172a', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #38bdf8' }}>
                      <strong>Paso {paso.orden}: {paso.titulo}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#0284c7', margin: '0.2rem 0' }}>Organismo: {paso.organismo}</div>
                      {paso.descripcion && <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>{paso.descripcion}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8' }}>Trámite directo en ventanilla única.</p>
              )}

              <button
                onClick={() => alert('¡Solicitud iniciada! Código de expediente: EXP-2026-CTES-' + Math.floor(1000 + Math.random() * 9000))}
                style={{ width: '100%', marginTop: '2rem', padding: '1rem', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
              >
                🚀 Iniciar Trámite On-line
              </button>
            </div>
          </div>
        ) : (
          /* BUSCADOR Y CATÁLOGO */
          <div>
            <div style={{ textAlign: 'center', margin: '2rem 0 3rem' }}>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#f8fafc' }}>¿Qué necesitás hacer hoy?</h1>
              <p style={{ color: '#94a3b8' }}>Buscá un trámite o escribí lo que querés resolver en la ciudad.</p>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <input
                  type="text"
                  placeholder="🔎 Ej: Quiero abrir un local de ropa, renovar DNI, licencia..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  style={{ width: '100%', maxWidth: '600px', padding: '1rem 1.5rem', borderRadius: '50px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '1rem', outline: 'none' }}
                />
              </div>
            </div>

            <h2>📋 Catálogo Oficial de Trámites</h2>

            {cargando ? (
              <p style={{ color: '#94a3b8' }}>Cargando información desde la base de datos...</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {tramitesFiltrados.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => verDetalle(item.id)}
                    style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1.2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <h3 style={{ margin: '0 0 0.4rem', color: '#38bdf8' }}>{item.titulo}</h3>
                      <span style={{ fontSize: '0.8rem', background: '#334155', color: '#cbd5e1', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {item.categoria}
                      </span>
                    </div>
                    <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>Ver requisitos →</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
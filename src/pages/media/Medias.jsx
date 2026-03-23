import { useEffect, useState } from 'react';
import { obtenerMedias, crearMedia, actualizarMedia, eliminarMedia } from '../../services/mediaService';
import { obtenerGeneros } from '../../services/generoService';
import { obtenerDirectores } from '../../services/directorService';
import { obtenerProductoras } from '../../services/productoraService';
import { obtenerTipos } from '../../services/tipoService';

export default function Medias() {
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Relacionales (Catálogos para los dropdowns)
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  // Estados del modal y formulario
  const [showModal, setShowModal] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  
  const [formData, setFormData] = useState({ 
    serial: '', 
    titulo: '',
    sinopsis: '',
    url: '',
    imagenPortada: '',
    anioEstreno: new Date().getFullYear(),
    generoPrincipal: '',
    directorPrincipal: '',
    productora: '',
    tipo: ''
  }); 

  const cargarDatos = async () => {
    try {
      // Cargar todos los catálogos en paralelo para mayor velocidad
      const [mediaData, genData, dirData, prodData, tipData] = await Promise.all([
        obtenerMedias(),
        obtenerGeneros(),
        obtenerDirectores(),
        obtenerProductoras(),
        obtenerTipos()
      ]);

      setMedias(mediaData);
      setGeneros(genData);
      setDirectores(dirData);
      setProductoras(prodData);
      setTipos(tipData);

    } catch (error) {
      console.error("Error al cargar datos masivos:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreate = () => {
    setEditingId(null); 
    setFormData({ 
      serial: '', titulo: '', sinopsis: '', url: '', imagenPortada: '', 
      anioEstreno: new Date().getFullYear(),
      generoPrincipal: '', directorPrincipal: '', productora: '', tipo: '' 
    }); 
    setShowModal(true); 
  };

  const handleEdit = (media) => {
    setEditingId(media._id); 
    
    // Si Node.js hizo un .populate() en el backend, media.generoPrincipal será un objeto, 
    // de lo contrario será solo un STRING (ID). Extraemos el ID exacto con esta función anónima.
    const extractId = (prop) => typeof prop === 'object' && prop !== null ? prop._id : prop;

    setFormData({ 
      serial: media.serial || '',
      titulo: media.titulo || '',
      sinopsis: media.sinopsis || '',
      url: media.url || '',
      imagenPortada: media.imagenPortada || '',
      anioEstreno: media.anioEstreno || new Date().getFullYear(),
      generoPrincipal: extractId(media.generoPrincipal) || '', 
      directorPrincipal: extractId(media.directorPrincipal) || '', 
      productora: extractId(media.productora) || '', 
      tipo: extractId(media.tipo) || '' 
    }); 
    setShowModal(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if (editingId) {
        await actualizarMedia(editingId, formData);
      } else {
        await crearMedia(formData);
      }
      
      setShowModal(false);
      await cargarDatos(); 
    } catch (error) {
      console.error("Error al guardar Media:", error);
      alert("Hubo un error al guardar los datos de esta Película/Serie.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("¿Precaución extrema: Estás completamente seguro de querer eliminar esta Producción permanentemente de la Base de Datos?");
    if (!isConfirmed) return;

    try {
      await eliminarMedia(id); 
      await cargarDatos(); 
    } catch (error) {
      console.error("Error al eliminar Media:", error);
      alert("No se pudo eliminar el registro.");
    }
  };

  // ----- FILTRADO ROBUSTO DE ACTIVOS (REGLAS DE NEGOCIO DEL ESTUDIO DE CASO) -----
  // Filtramos la lista para que en el Formulario SOLO SALGAN aquellos con el estado "Activo"
  const checkActivo = (item) => item.estado === 'Activo' || (item.estado === undefined && item.isActive === true);
  
  const generosActivos = generos.filter(checkActivo);
  const directoresActivos = directores.filter(checkActivo);
  const productorasActivas = productoras.filter(checkActivo);
  const tiposDisponibles = tipos; // Los Tipos no manejan la columna estado

  // Función Helper para inyectar el Nombre humano en la tabla visual
  const getNameFromList = (val, list) => {
    if (!val) return 'Ninguno';
    if (typeof val === 'object' && val.nombre) return val.nombre; 
    
    // Si viene solo el Hash ID de mongo, lo cruzamos con nuestra memoria
    const found = list.find(l => l._id === val);
    return found ? (found.nombre || found.nombres) : 'Id Desconocido';
  };

  return (
    <div>
      <h2 className="mb-4">Catálogo Principal (Media)</h2>
      
      <button className="btn btn-primary mb-3 shadow-sm fw-bold px-4" onClick={handleOpenCreate}>
        + Agregar a Catálogo
      </button>

      {/* --- MODAL GIGANTE DE PELÍCULAS --- */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  {editingId ? '✏️ Editando Producción' : '🎬 Registrar Nueva Producción'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 bg-light">
                  <div className="row">
                    {/* BÁSICOS */}
                    <div className="col-md-3 mb-3">
                      <label className="form-label text-dark fw-bold">Serial (Único)</label>
                      <input type="text" className="form-control border-2" name="serial" value={formData.serial} onChange={handleChange} required />
                    </div>
                    <div className="col-md-7 mb-3">
                      <label className="form-label text-dark fw-bold">Título de la Obra</label>
                      <input type="text" className="form-control hover-shadow-sm border-2" name="titulo" value={formData.titulo} onChange={handleChange} required />
                    </div>
                    <div className="col-md-2 mb-3">
                      <label className="form-label text-dark fw-bold">Año Estreno</label>
                      <input type="number" className="form-control border-2" name="anioEstreno" value={formData.anioEstreno} onChange={handleChange} required />
                    </div>
                  </div>
                  
                  {/* MULTIMEDIA */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-dark fw-bold">URL Oficial / Trailer</label>
                      <input type="url" className="form-control border-2" name="url" value={formData.url} onChange={handleChange} placeholder="https://..." required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-dark fw-bold">URL Imagen (Portada)</label>
                      <input type="url" className="form-control border-2" name="imagenPortada" value={formData.imagenPortada} onChange={handleChange} placeholder="https://..." required />
                    </div>
                  </div>

                  {/* SINOPSIS */}
                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Sinopsis (Trama)</label>
                    <textarea className="form-control border-2" name="sinopsis" value={formData.sinopsis} onChange={handleChange} rows="3" required></textarea>
                  </div>

                  <hr className="my-4"/>
                  <h6 className="fw-bold mb-3 text-secondary">Relaciones y Clasificación <span className="text-danger">(Solo se permiten mostrar los 'Activos')</span></h6>

                  {/* RELACIONES CON SELECTS INTELIGENTES */}
                  <div className="row">
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-bold">Género Principal</label>
                      <select className="form-select border-2" name="generoPrincipal" value={formData.generoPrincipal} onChange={handleChange} required>
                        <option value="">Seleccione Género...</option>
                        {generosActivos.map(g => <option key={g._id} value={g._id}>{g.nombre}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-bold">Director Principal</label>
                      <select className="form-select border-2" name="directorPrincipal" value={formData.directorPrincipal} onChange={handleChange} required>
                        <option value="">Seleccione Director...</option>
                        {directoresActivos.map(d => <option key={d._id} value={d._id}>{d.nombre || d.nombres}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-bold">Productora</label>
                      <select className="form-select border-2" name="productora" value={formData.productora} onChange={handleChange} required>
                        <option value="">Seleccione Productora...</option>
                        {productorasActivas.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label fw-bold">Tipo</label>
                      <select className="form-select border-2" name="tipo" value={formData.tipo} onChange={handleChange} required>
                        <option value="">Seleccione Tipo...</option>
                        {tiposDisponibles.map(t => <option key={t._id} value={t._id}>{t.nombre}</option>)}
                      </select>
                    </div>
                  </div>

                </div>
                <div className="modal-footer bg-light border-0">
                  <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setShowModal(false)}>❌ Cancelar</button>
                  <button type="submit" className="btn btn-dark px-4 fw-bold">💾 Guardar Obra</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- LA TABLA O GRILLA VISUAL --- */}
      {loading ? (
        <div className="d-flex align-items-center mt-3 p-3 bg-white rounded shadow-sm border">
          <div className="spinner-border text-primary me-3" role="status"></div>
          <span className="fw-bold text-secondary fs-5">Sincronizando el Catálogo Audiovisual...</span>
        </div>
      ) : (
        <div className="table-responsive bg-white p-3 rounded shadow-sm border mt-3">
          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.9rem' }}>
            <thead className="table-dark">
              <tr>
                <th className="py-2">Portada</th>
                <th className="py-2">Serial</th>
                <th className="py-2" style={{ maxWidth: '150px' }}>Título y Película</th>
                <th className="py-2" style={{ maxWidth: '200px' }}>Sinopsis / Trama</th>
                <th className="py-2">Clasificación Base</th>
                <th className="py-2">Fechas de Sistema</th>
                <th className="py-2 text-end">Acción</th>
              </tr>
            </thead>
            <tbody>
              {medias.map((media) => {
                
                // Truncado de sinopsis a 60 caracteres
                const sinopsisCorta = media.sinopsis && media.sinopsis.length > 60 
                  ? media.sinopsis.substring(0, 60) + '...' 
                  : (media.sinopsis || '');

                return (
                  <tr key={media._id}>
                    <td>
                      {/* Portada Interactiva con Efecto Hover para Ver Trailer */}
                      <a 
                        href={media.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="d-block position-relative rounded shadow border border-2 border-white overflow-hidden text-decoration-none"
                        style={{ width: '120px', height: '180px', backgroundColor: '#000', cursor: 'pointer' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.querySelector('img').style.opacity = '0.3';
                          e.currentTarget.querySelector('.play-overlay').style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.querySelector('img').style.opacity = '1';
                          e.currentTarget.querySelector('.play-overlay').style.opacity = '0';
                        }}
                      >
                        <img 
                          src={media.imagenPortada || 'https://via.placeholder.com/120x180?text=No+Img'} 
                          alt="Portada" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease-in-out' }}
                        />
                        <div 
                          className="play-overlay position-absolute top-50 start-50 translate-middle text-center text-white w-100" 
                          style={{ opacity: '0', transition: 'all 0.3s ease-in-out', pointerEvents: 'none' }}
                        >
                          <div style={{ fontSize: '2.8rem', lineHeight: '1', textShadow: '0 4px 8px rgba(0,0,0,0.9)' }}>▶️</div>
                          <div className="fw-bold px-2 py-1 mt-1 rounded bg-danger d-inline-block shadow" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>Ver Trailer</div>
                        </div>
                      </a>
                    </td>
                    <td className="fw-bold text-secondary">{media.serial}</td>
                    
                    <td className="fw-bold fs-6 text-dark" style={{ maxWidth: '150px' }}>
                      <div className="text-truncate" title={media.titulo}>{media.titulo}</div>
                      <span className="badge bg-secondary opacity-75">{media.anioEstreno}</span>
                    </td>
                    
                    <td title={media.sinopsis} style={{ cursor: 'help', maxWidth: '200px' }} className="text-secondary text-truncate">
                      {sinopsisCorta}
                    </td>

                    <td style={{ minWidth: '160px' }}>
                      {/* Cruzamos la memoria de Mongo IDs con los nombres humanos locales */}
                      <div style={{ fontSize: '0.8rem' }}><strong>🎬 Gen:</strong> {getNameFromList(media.generoPrincipal, generos)}</div>
                      <div style={{ fontSize: '0.8rem' }}><strong>🎥 Dir:</strong> {getNameFromList(media.directorPrincipal, directores)}</div>
                      <div style={{ fontSize: '0.8rem' }}><strong>🏢 Pro:</strong> {getNameFromList(media.productora, productoras)}</div>
                      <div style={{ fontSize: '0.8rem' }}><strong>📺 Tip:</strong> {getNameFromList(media.tipo, tipos)}</div>
                    </td>

                    <td className="text-secondary text-nowrap" style={{ fontSize: '0.8rem' }}>
                      C: {media.fechaCreacion ? new Date(media.fechaCreacion).toLocaleDateString() : 'N/A'} <br/>
                      A: {media.fechaActualizacion ? new Date(media.fechaActualizacion).toLocaleDateString() : 'N/A'}
                    </td>
                    
                    <td className="text-end text-nowrap">
                      {/* Botones Iconizados */}
                      <button className="btn btn-sm btn-outline-warning px-2 me-1 shadow-sm" onClick={() => handleEdit(media)}>⚙️</button>
                      <button className="btn btn-sm btn-outline-danger px-2 shadow-sm" onClick={() => handleDelete(media._id)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
              {medias.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <h5 className="fw-bold">🍿 El Catálogo Maestro está vacío</h5>
                    <p className="mb-0">Haz clic en Agregar Película o Serie para registrar tu primera obra magna.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

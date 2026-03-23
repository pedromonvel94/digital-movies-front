import { useEffect, useState } from 'react';
import { obtenerTipos, crearTipo, actualizarTipo, eliminarTipo } from '../../services/tipoService';

export default function Tipos() {
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del modal y formulario
  const [showModal, setShowModal] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    descripcion: ''
  }); 

  const cargarTipos = async () => {
    try {
      const data = await obtenerTipos();
      setTipos(data); 
    } catch (error) {
      console.error("Error al cargar Tipos:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    cargarTipos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreate = () => {
    setEditingId(null); 
    setFormData({ nombre: '', descripcion: '' }); 
    setShowModal(true); 
  };

  const handleEdit = (tipo) => {
    setEditingId(tipo._id); 
    setFormData({ 
      nombre: tipo.nombre || tipo.nombres || '', 
      descripcion: tipo.descripcion || ''
    }); 
    setShowModal(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion
      };

      if (editingId) {
        await actualizarTipo(editingId, payload);
      } else {
        await crearTipo(payload);
      }
      
      setShowModal(false);
      setFormData({ nombre: '', descripcion: '' });
      await cargarTipos(); 
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los datos en el backend.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("¿Estás completamente seguro de querer eliminar este Tipo permanentemente de la Base de Datos?");
    if (!isConfirmed) return;

    try {
      await eliminarTipo(id); 
      await cargarTipos(); 
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el registro.");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Gestión de Tipos de Media</h2>
      
      <button className="btn btn-primary mb-3 shadow-sm fw-bold px-4" onClick={handleOpenCreate}>
        + Nuevo Tipo
      </button>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  {editingId ? '✏️ Editando Tipo' : '🚀 Registrar Nuevo Tipo'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 bg-light">
                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Nombre del Tipo</label>
                    <input 
                      type="text" 
                      className="form-control border-2" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Película, Serie, Documental..."
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Descripción</label>
                    <textarea 
                      className="form-control border-2" 
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Breve reseña sobre qué representa este tipo..."
                      rows="4"
                      required 
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0">
                  <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setShowModal(false)}>❌ Cancelar</button>
                  <button type="submit" className="btn btn-success px-4 fw-bold">💾 Guardar Tipo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- LA TABLA --- */}
      {loading ? (
        <div className="d-flex align-items-center mt-3 p-3 bg-white rounded shadow-sm border">
          <div className="spinner-border text-primary me-3" role="status"></div>
          <span className="fw-bold text-secondary fs-5">Cargando tipos de media...</span>
        </div>
      ) : (
        <div className="table-responsive bg-white p-3 rounded shadow-sm border mt-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="py-3">Nombre</th>
                <th className="py-3" style={{ maxWidth: '250px' }}>Descripción</th>
                <th className="py-3">Fecha Creación</th>
                <th className="py-3">Fecha Actualización</th>
                <th className="py-3 text-end pe-4">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {tipos.map((tipo) => {
                
                // Truncado dinámico de texto para Descripcion
                const descFull = tipo.descripcion || '';
                const descCorto = descFull.length > 50 ? descFull.substring(0, 50) + '...' : descFull;

                return (
                  <tr key={tipo._id}>
                    <td className="fw-bold fs-6 text-dark">{tipo.nombre}</td>
                    
                    <td title={descFull} style={{ cursor: 'help', maxWidth: '250px' }} className="text-secondary text-truncate">
                      {descCorto}
                    </td>

                    <td className="text-secondary text-nowrap">{tipo.fechaCreacion ? new Date(tipo.fechaCreacion).toLocaleString() : 'N/A'}</td>
                    <td className="text-secondary text-nowrap">{tipo.fechaActualizacion ? new Date(tipo.fechaActualizacion).toLocaleString() : 'N/A'}</td>
                    
                    <td className="text-end pe-2 text-nowrap">
                      <button className="btn btn-sm btn-outline-warning fw-bold px-3 me-2 shadow-sm" onClick={() => handleEdit(tipo)}>⚙️ Editar</button>
                      <button className="btn btn-sm btn-outline-danger fw-bold px-3 shadow-sm" onClick={() => handleDelete(tipo._id)}>🗑️ Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {tipos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <h5 className="fw-bold">📺 No existen Tipos en el Repositorio</h5>
                    <p className="mb-0">Haz clic en el botón superior para crear el primero (ej. Película).</p>
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

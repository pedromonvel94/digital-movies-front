import { useEffect, useState } from 'react';
import { obtenerProductoras, crearProductora, actualizarProductora, eliminarProductora } from '../../services/productoraService';

export default function Productoras() {
  const [productoras, setProductoras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del modal y formulario
  const [showModal, setShowModal] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  
  const [formData, setFormData] = useState({ 
    nombre: '', 
    slogan: '',
    descripcion: '',
    estado: 'Activo' 
  }); 

  const cargarProductoras = async () => {
    try {
      const data = await obtenerProductoras();
      setProductoras(data); 
    } catch (error) {
      console.error("Error al cargar productoras:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    cargarProductoras();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreate = () => {
    setEditingId(null); 
    setFormData({ nombre: '', slogan: '', descripcion: '', estado: 'Activo' }); 
    setShowModal(true); 
  };

  const handleEdit = (productora) => {
    setEditingId(productora._id); 
    setFormData({ 
      nombre: productora.nombre || productora.nombres || '', 
      slogan: productora.slogan || '',
      descripcion: productora.descripcion || '',
      estado: productora.estado || (productora.isActive === false ? 'Inactivo' : 'Activo') 
    }); 
    setShowModal(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const payload = {
        nombre: formData.nombre,
        slogan: formData.slogan,
        descripcion: formData.descripcion,
        estado: formData.estado,
        isActive: formData.estado === 'Activo'
      };

      if (editingId) {
        await actualizarProductora(editingId, payload);
      } else {
        await crearProductora(payload);
      }
      
      setShowModal(false);
      setFormData({ nombre: '', slogan: '', descripcion: '', estado: 'Activo' });
      await cargarProductoras(); 
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los datos en el backend.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("¿Estás completamente seguro de querer eliminar esta Productora permanentemente de la Base de Datos?");
    if (!isConfirmed) return;

    try {
      await eliminarProductora(id); 
      await cargarProductoras(); 
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el registro.");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Gestión de Productoras</h2>
      
      <button className="btn btn-primary mb-3 shadow-sm fw-bold px-4" onClick={handleOpenCreate}>
        + Nueva Productora
      </button>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  {editingId ? '✏️ Editando Productora' : '🚀 Registrar Nueva Productora'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 bg-light">
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label className="form-label text-dark fw-bold">Nombre</label>
                      <input 
                        type="text" 
                        className="form-control border-2" 
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej. Warner Bros"
                        required 
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label text-dark fw-bold">Estado</label>
                      <select 
                        className="form-select border-2" 
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Slogan (Lema)</label>
                    <input 
                      type="text" 
                      className="form-control border-2" 
                      name="slogan"
                      value={formData.slogan}
                      onChange={handleChange}
                      placeholder="Ej. Donde las historias cobran vida"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Descripción / Historia</label>
                    <textarea 
                      className="form-control border-2" 
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Breve reseña sobre la productora..."
                      rows="3"
                      required 
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-light border-0">
                  <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setShowModal(false)}>❌ Cancelar</button>
                  <button type="submit" className="btn btn-success px-4 fw-bold">💾 Guardar Productora</button>
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
          <span className="fw-bold text-secondary fs-5">Cargando estudios de producción...</span>
        </div>
      ) : (
        <div className="table-responsive bg-white p-3 rounded shadow-sm border mt-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="py-3">Nombre</th>
                <th className="py-3">Estado</th>
                <th className="py-3" style={{ maxWidth: '150px' }}>Slogan</th>
                <th className="py-3" style={{ maxWidth: '200px' }}>Descripción</th>
                <th className="py-3">Fecha Creación</th>
                <th className="py-3">Fecha Actualización</th>
                <th className="py-3 text-end pe-4">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {productoras.map((productora) => {
                // Lógica de estado validada estrictamente
                const estadoMostrar = productora.estado || (productora.isActive ? 'Activo' : 'Inactivo');
                const badgeColor = estadoMostrar === 'Activo' ? 'bg-success' : 'bg-secondary p-2 bg-opacity-75';
                const elTexto = estadoMostrar === 'Activo' ? '✔️ Activo' : '❌ Inactivo';

                // Truncado dinámico de texto para Slogan (limite 30 letras)
                const sloganFull = productora.slogan || 'Sin slogan';
                const sloganCorto = sloganFull.length > 30 ? sloganFull.substring(0, 30) + '...' : sloganFull;
                
                // Truncado dinámico de texto para Descripcion (limite 40 letras)
                const descFull = productora.descripcion || '';
                const descCorto = descFull.length > 40 ? descFull.substring(0, 40) + '...' : descFull;

                return (
                  <tr key={productora._id}>
                    <td className="fw-bold fs-6 text-dark">{productora.nombre}</td>
                    
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${badgeColor}`}>
                        {elTexto}
                      </span>
                    </td>
                    
                    <td title={sloganFull} style={{ cursor: 'help', maxWidth: '150px' }} className="text-secondary text-truncate fst-italic">
                      "{sloganCorto}"
                    </td>
                    
                    <td title={descFull} style={{ cursor: 'help', maxWidth: '200px' }} className="text-secondary text-truncate">
                      {descCorto}
                    </td>

                    <td className="text-secondary text-nowrap">{productora.fechaCreacion ? new Date(productora.fechaCreacion).toLocaleString() : 'N/A'}</td>
                    <td className="text-secondary text-nowrap">{productora.fechaActualizacion ? new Date(productora.fechaActualizacion).toLocaleString() : 'N/A'}</td>
                    
                    <td className="text-end pe-2 text-nowrap">
                      <button className="btn btn-sm btn-outline-warning fw-bold px-3 me-2 shadow-sm" onClick={() => handleEdit(productora)}>⚙️ Editar</button>
                      <button className="btn btn-sm btn-outline-danger fw-bold px-3 shadow-sm" onClick={() => handleDelete(productora._id)}>🗑️ Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {productoras.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <h5 className="fw-bold">🎬 No existen Productoras en el Repositorio</h5>
                    <p className="mb-0">Haz clic en el botón superior para crear la primera productora.</p>
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

import { useEffect, useState } from 'react';
import { obtenerDirectores, crearDirector, actualizarDirector, eliminarDirector } from '../../services/directorService';

export default function Directores() {
  const [directores, setDirectores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del modal y formulario
  const [showModal, setShowModal] = useState(false); 
  const [editingId, setEditingId] = useState(null); 
  
  // Basado en lo que pediste y en los datos reales del backend ("nombre", "estado")
  const [formData, setFormData] = useState({ 
    nombre: '', 
    estado: 'Activo' 
  }); 

  const cargarDirectores = async () => {
    try {
      const data = await obtenerDirectores();
      setDirectores(data); 
    } catch (error) {
      console.error("Error al cargar directores:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    cargarDirectores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreate = () => {
    setEditingId(null); 
    setFormData({ nombre: '', estado: 'Activo' }); 
    setShowModal(true); 
  };

  const handleEdit = (director) => {
    setEditingId(director._id); 
    setFormData({ 
      // Si el backend manda 'nombre' o 'nombres', tomamos la que exista para asegurarnos no sea blanco
      nombre: director.nombre || director.nombres || '', 
      estado: director.estado || (director.isActive === false ? 'Inactivo' : 'Activo') 
    }); 
    setShowModal(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // Truco para enviar ambas propiedades al backend Node.js 
      // por si su mongoose schema te obliga a usar 'nombres' o 'isActive'
      const payload = {
        nombre: formData.nombre,
        nombres: formData.nombre, 
        estado: formData.estado,
        isActive: formData.estado === 'Activo'
      };

      if (editingId) {
        await actualizarDirector(editingId, payload);
      } else {
        await crearDirector(payload);
      }
      
      setShowModal(false);
      setFormData({ nombre: '', estado: 'Activo' });
      await cargarDirectores(); 
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los datos en el backend.");
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("¿Estás seguro de querer eliminar este Director permanentemente de la Base de Datos?");
    if (!isConfirmed) return;

    try {
      await eliminarDirector(id); 
      await cargarDirectores(); 
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el registro.");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Gestión de Directores</h2>
      
      <button className="btn btn-primary mb-3 shadow-sm fw-bold px-4" onClick={handleOpenCreate}>
        + Nuevo Director
      </button>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  {editingId ? '✏️ Editando Director' : '🚀 Registrar Nuevo Director'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 bg-light">
                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Nombre del Director</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg border-2" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Steven Spielberg"
                      required 
                    />
                  </div>
                  <div className="mb-3">
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
                <div className="modal-footer bg-light border-0">
                  <button type="button" className="btn btn-secondary px-4 fw-bold" onClick={() => setShowModal(false)}>❌ Cancelar</button>
                  <button type="submit" className="btn btn-success px-4 fw-bold">💾 Guardar Cambios</button>
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
          <span className="fw-bold text-secondary fs-5">Cargando colección de directores...</span>
        </div>
      ) : (
        <div className="table-responsive bg-white p-3 rounded shadow-sm border mt-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="py-3">Nombre</th>
                <th className="py-3">Estado</th>
                <th className="py-3">Fecha Creación</th>
                <th className="py-3">Fecha Actualización</th>
                <th className="py-3 text-end pe-4">Opciones CRUD</th>
              </tr>
            </thead>
            <tbody>
              {directores.map((director) => {
                // Validación para detectar los datos en la BD
                const nombreMostrar = director.nombre || director.nombres;
                
                // Priorizamos "estado" (texto) si existe, sino usamos isActive (Booleano)
                const estadoMostrar = director.estado || (director.isActive ? 'Activo' : 'Inactivo');
                
                // El color y texto dependen TOTALMENTE de 'estadoMostrar'
                const badgeColor = estadoMostrar === 'Activo' ? 'bg-success' : 'bg-secondary p-2 bg-opacity-75';
                const elTexto = estadoMostrar === 'Activo' ? '✔️ Activo' : '❌ Inactivo';

                return (
                  <tr key={director._id}>
                    <td className="fw-bold fs-6 text-dark">{nombreMostrar}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${badgeColor}`}>
                        {elTexto}
                      </span>
                    </td>
                    <td className="text-secondary">{director.fechaCreacion ? new Date(director.fechaCreacion).toLocaleString() : 'N/A'}</td>
                    <td className="text-secondary">{director.fechaActualizacion ? new Date(director.fechaActualizacion).toLocaleString() : 'N/A'}</td>
                    <td className="text-end pe-2">
                      <button className="btn btn-sm btn-outline-warning fw-bold px-3 me-2" onClick={() => handleEdit(director)}>⚙️ Editar</button>
                      <button className="btn btn-sm btn-outline-danger fw-bold px-3 shadow-sm" onClick={() => handleDelete(director._id)}>🗑️ Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {directores.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <h5 className="fw-bold">📁 El Repositorio de Directores está vacío</h5>
                    <p className="mb-0">Agrega un nuevo director usando el botón superior.</p>
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

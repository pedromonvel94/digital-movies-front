import { useEffect, useState } from 'react';
import { obtenerGeneros, crearGenero, actualizarGenero, eliminarGenero } from '../../services/generoService';

export default function Generos() {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del modal y formulario
  const [showModal, setShowModal] = useState(false); 
  const [editingId, setEditingId] = useState(null); // Si es null = Crear Nuevo; Si tiene texto = Editando ese ID
  
  // CORRECCIÓN DEL BUG: Usamos 'isActive' (Booleano) en lugar de 'estado' (String)
  // porque backend/src/models/Genero.js espera explícitamente el nombre "isActive"
  const [formData, setFormData] = useState({ 
    nombre: '', 
    descripcion: '', 
    isActive: true 
  }); 

  const cargarGeneros = async () => {
    try {
      const data = await obtenerGeneros();
      setGeneros(data); 
    } catch (error) {
      console.error("Error al cargar géneros:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    cargarGeneros();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Si la cajita que se cambia es isActive, tenemos que forzar que el texto "true" o "false" se convierta a un objeto Booleano real
    if (name === 'isActive') {
      setFormData({ ...formData, [name]: value === 'true' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Acción: Botón "+ Nuevo Género"
  const handleOpenCreate = () => {
    setEditingId(null); // Aseguramos que es un modo de Creación
    setFormData({ nombre: '', descripcion: '', isActive: true }); // Limpiamos formulario
    setShowModal(true); // Abrimos
  };

  // Acción: Botón "Editar" en una fila de la tabla
  const handleEdit = (genero) => {
    setEditingId(genero._id); // Guardamos la memoria temporal del ID a modificar
    // Llenamos el formulario con los datos precisos para que el usuario pueda corregirlos
    setFormData({ 
      nombre: genero.nombre, 
      descripcion: genero.descripcion, 
      isActive: genero.isActive 
    }); 
    setShowModal(true); 
  };

  // Acción: Botón "Guardar" o "Completar Registro" del modal
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // Determinamos si es una inserción nueva o una actualización
      if (editingId) {
        // Modo Edición
        await actualizarGenero(editingId, formData);
      } else {
        // Modo Creación
        await crearGenero(formData);
      }
      
      setShowModal(false);
      setFormData({ nombre: '', descripcion: '', isActive: true });
      await cargarGeneros(); // Pedimos actualización al servidor

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar los datos en el backend.");
    }
  };

  // Acción: Botón "Purga"
  const handleDelete = async (id) => {
    // Para borrar, siempre es considerado una muy buena práctica preguntar antes de disparar el rayo destructor.
    const isConfirmed = window.confirm("¿Estás completamente seguro de querer eliminar este Género permanentemente de la Base de Datos?");
    if (!isConfirmed) return;

    try {
      await eliminarGenero(id); // Disparamos la petición DELETE
      await cargarGeneros(); // Recargamos la UI
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el registro.");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Gestión de Géneros</h2>
      
      <button className="btn btn-primary mb-3 shadow-sm fw-bold px-4" onClick={handleOpenCreate}>
        + Nuevo Género
      </button>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  {editingId ? '✏️ Editando Registro' : '🚀 Registrar Género Animado'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4 bg-light">
                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Nombre Sugerido</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg border-2" 
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Acción, Comedia, Terror..."
                      required 
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Descripción Temática</label>
                    <textarea 
                      className="form-control border-2" 
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Agregue una descripción detallada"
                      rows="3"
                      required 
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-dark fw-bold">Gestión de Visibilidad</label>
                    <select 
                      className="form-select border-2" 
                      name="isActive"
                      value={formData.isActive.toString()}
                      onChange={handleChange}
                    >
                      {/* Los values (valores reales informáticos) ahora son verdaderamente "true" o "false" */}
                      <option value="true">🟢 Mantener Activo (Visible en Películas)</option>
                      <option value="false">🔴 Guardar Inactivo (Oculto del Sistema)</option>
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
         <span className="fw-bold text-secondary fs-5">Cargando colección de datos seguros...</span>
       </div>
      ) : (
        <div className="table-responsive bg-white p-3 rounded shadow-sm border mt-3">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th className="py-3">Nombre</th>
                <th className="py-3" style={{ maxWidth: '250px' }}>Descripción</th>
                <th className="py-3">Estado</th>
                <th className="py-3">Fecha Creación</th>
                <th className="py-3">Fecha Actualización</th>
                <th className="py-3 text-end pe-4">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {generos.map((genero) => {
                // Validación estricta para el estado, tal como lo hicimos en Directores
                const estadoMostrar = genero.estado || (genero.isActive ? 'Activo' : 'Inactivo');
                const badgeColor = estadoMostrar === 'Activo' ? 'bg-success' : 'bg-secondary p-2 bg-opacity-75';
                const elTexto = estadoMostrar === 'Activo' ? '✔️ Activo' : '❌ Inactivo';
                
                // Truncar descripción si es muy larga
                const descFull = genero.descripcion || '';
                const descCorta = descFull.length > 50 ? descFull.substring(0, 50) + '...' : descFull;

                return (
                  <tr key={genero._id}>
                    <td className="fw-bold fs-6 text-dark">{genero.nombre}</td>
                    
                    {/* El atributo <td title="..."> es lo que hace que salga el texto completo al poner el mouse encima */}
                    <td title={descFull} style={{ cursor: 'help', maxWidth: '250px' }} className="text-secondary text-truncate">
                      {descCorta}
                    </td>

                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${badgeColor}`}>
                        {elTexto}
                      </span>
                    </td>
                    
                    {/* Fechas con LocalDateTime para que se vea el día y la hora exacta */}
                    <td className="text-secondary text-nowrap">{genero.fechaCreacion ? new Date(genero.fechaCreacion).toLocaleString() : 'N/A'}</td>
                    <td className="text-secondary text-nowrap">{genero.fechaActualizacion ? new Date(genero.fechaActualizacion).toLocaleString() : 'N/A'}</td>
                    
                    <td className="text-end pe-2 text-nowrap">
                      <button className="btn btn-sm btn-outline-warning fw-bold px-3 me-2 shadow-sm" onClick={() => handleEdit(genero)}>⚙️ Editar</button>
                      <button className="btn btn-sm btn-outline-danger fw-bold px-3 shadow-sm" onClick={() => handleDelete(genero._id)}>🗑️ Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {generos.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <h5 className="fw-bold">📁 El Repositorio está vacío</h5>
                    <p className="mb-0">Haz click en "Nuevo Género" para almacenar el primer objeto de nuestra DataBase.</p>
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

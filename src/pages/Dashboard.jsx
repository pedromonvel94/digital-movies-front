import { Link } from 'react-router-dom';

export default function Dashboard() {
  const modulos = [
    {
      titulo: 'Catálogo Maestro (Media)',
      icono: '🍿',
      descripcion: 'Agrega, edita y gestiona todo el catálogo de Películas, Series y Documentales con sus carteleras completas.',
      ruta: '/media',
      bgClass: 'bg-primary'
    },
    {
      titulo: 'Gestión de Géneros',
      icono: '🎭',
      descripcion: 'Administra las categorías narrativas (Acción, Terror, Sci-Fi) para clasificar todas tus producciones.',
      ruta: '/generos',
      bgClass: 'bg-danger'
    },
    {
      titulo: 'Gestión de Directores',
      icono: '🎬',
      descripcion: 'Controla el listado de las grandes mentes (Scorsese, Nolan, Spielberg) detrás del arte audiovisual.',
      ruta: '/directores',
      bgClass: 'bg-warning'
    },
    {
      titulo: 'Gestión de Productoras',
      icono: '🏢',
      descripcion: 'Organiza las compañías productoras (Warner Bros, Universal, Paramount) dueñas de las obras maestras.',
      ruta: '/productoras',
      bgClass: 'bg-info'
    },
    {
      titulo: 'Gestión de Tipos',
      icono: '📺',
      descripcion: 'Clasifica visualmente en qué formato se distribuye la obra de arte (Ej: Película, Serie, Miniserie).',
      ruta: '/tipos',
      bgClass: 'bg-success'
    }
  ];

  return (
    <div className="container-fluid py-2">
      {/* Banner Extragrande Decorativo y Bienvenida */}
      <div 
        className="p-5 mb-5 bg-dark text-white rounded-4 shadow-lg position-relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }}
      >
        <div className="container-fluid py-3 position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3">
            <span role="img" aria-label="wave" className="fs-1 me-2 d-inline-block" style={{ transform: 'rotate(10deg)' }}>👋</span> 
            Bienvenido, Jefe de Contenido
          </h1>
          <p className="col-md-10 fs-5 mt-3 lh-lg text-white-50">
            Has ingresado al <strong>Panel de Control Central</strong> del Catálogo Audiovisual IUDigital.
            Desde aquí tienes poder absoluto para modelar toda la base de datos de películas, añadir nuevos directores, 
            estudios de producción y parametrizar cada género de esta plataforma en tiempo real.
          </p>
          <hr className="my-4 border-secondary opacity-25" />
          <Link to="/media" className="btn btn-primary btn-lg fw-bold px-5 shadow-sm rounded-pill mt-2">
            🍿 Ir al Catálogo Maestro
          </Link>
        </div>
        
        {/* Adornos visuales de fondo abstractos */}
        <div className="position-absolute rounded-circle bg-white opacity-10" style={{ width: '400px', height: '400px', top: '-100px', right: '-100px', zIndex: 1 }}></div>
        <div className="position-absolute rounded-circle bg-primary opacity-25" style={{ width: '300px', height: '300px', bottom: '-80px', right: '150px', zIndex: 1 }}></div>
      </div>

      {/* Título de Navegación Rápida */}
      <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
        <h3 className="fw-bold text-dark mb-0"><span className="fs-4 me-2">⚡</span> Navegación Rápida</h3>
        <span className="ms-3 badge bg-secondary px-3 py-2 rounded-pill">5 Módulos Activos</span>
      </div>
      
      {/* Grid de Tarjetas de Módulos (Interactivas) */}
      <div className="row g-4">
        {modulos.map((modulo, index) => (
          <div className="col-12 col-md-6 col-xl-4" key={index}>
            <Link to={modulo.ruta} className="text-decoration-none">
              <div 
                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative"
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.classList.replace('shadow-sm', 'shadow-lg');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.classList.replace('shadow-lg', 'shadow-sm');
                }}
              >
                {/* Cabecera Colorida con el Ícono Gigante */}
                <div className={`card-header ${modulo.bgClass} bg-gradient border-0 py-4 text-center text-white d-flex align-items-center justify-content-center`}>
                  <div style={{ fontSize: '4rem', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}>
                    {modulo.icono}
                  </div>
                </div>
                
                {/* Cuerpo Informativo de la Tarjeta */}
                <div className="card-body p-4 bg-white text-dark d-flex flex-column shadow-sm">
                  <h4 className="card-title fw-bold mb-3 text-dark">{modulo.titulo}</h4>
                  <p className="card-text text-secondary mb-4 flex-grow-1" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                    {modulo.descripcion}
                  </p>
                  
                  {/* Footer del Botón Animado */}
                  <div className="mt-auto pt-3 border-top d-flex align-items-center justify-content-between text-primary fw-bold" style={{ fontSize: '0.9rem' }}>
                    <span className="text-uppercase tracking-wide text-decoration-none">Explorar Módulo</span>
                    <span className="fs-5 shadow-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: 'rgba(13,110,253,0.1)' }}>
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

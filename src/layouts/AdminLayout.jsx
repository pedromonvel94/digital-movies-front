import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="flex-grow-1 p-4 container">
        {/* Aquí se renderizarán las pantallas específicas según la ruta */}
        <div className="bg-white shadow-sm rounded p-4">
          <Outlet />
        </div>
      </main>
      <footer className="bg-dark text-center text-white p-3 mt-auto">
        <small>&copy; {new Date().getFullYear()} IUDigital - Sistema de Administración - GRS</small>
      </footer>
    </div>
  );
}

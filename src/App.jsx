import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Generos from './pages/generos/Generos';
import Directores from './pages/directores/Directores';
import Productoras from './pages/productoras/Productoras';
import Tipos from './pages/tipos/Tipos';
import Medias from './pages/media/Medias';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="generos" element={<Generos />} />
          <Route path="directores" element={<Directores />} />
          <Route path="productoras" element={<Productoras />} />
          <Route path="tipos" element={<Tipos />} />
          <Route path="media" element={<Medias />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "../frontend/src/pages/Dashboard";

// ✅ Función que comprueba si el usuario está autenticado
const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// ✅ Componente que protege rutas privadas
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔒 Ruta protegida: solo accesible si hay token */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 📍 Redirección predeterminada al login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 🧭 Ruta comodín para manejar URLs no definidas */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

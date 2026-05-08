import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  return token && userRole === "admin" ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem("token")));
  const navigate = useNavigate();

  useEffect(() => {
    setAuthenticated(Boolean(localStorage.getItem("token")));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    setAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={authenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login onAuth={() => setAuthenticated(true)} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard onLogout={handleLogout} />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel onLogout={handleLogout} />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;

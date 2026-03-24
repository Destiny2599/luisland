import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./context/PrivateRoute";
import Test1    from "./pages/Test1.jsx";
import SobreMi  from "./pages/SobreMi.jsx";
import Login    from "./pages/Login.jsx";
 
const NAV_ITEMS = [
  {
    label: "Información",
    items: [
      { label: "Sobre mí", to: "/sobre-mi", roles: null },
      { label: "Opción 2", to: "/",         roles: null },
      { label: "Opción 3", to: "/",         roles: null },
      { label: "Opción 4", to: "/",         roles: null },
    ],
  },
  {
    label: "Herramientas",
    items: [
      { label: "Opción 1", to: "/", roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 2", to: "/", roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 3", to: "/", roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 4", to: "/", roles: ["ADMIN", "DEVELOPER"] },
    ],
  },
  {
    label: "Experimentos",
    items: [
      { label: "Test 1",   to: "/test1", roles: ["ADMIN", "DEVELOPER", "VISITANTE"] },
      { label: "Opción 2", to: "/",      roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 3", to: "/",      roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 4", to: "/",      roles: ["ADMIN", "DEVELOPER"] },
    ],
  },
];

function DropdownMenu({ item, isOpen, onToggle, onClose }) {
  const { usuario } = useAuth();
  const ref = useRef(null);
 
  // Filtrar opciones según rol del usuario
  const opcionesFiltradas = item.items.filter(opt => {
    if (!opt.roles) return true; // sin restricción
    if (!usuario)   return false; // no logueado
    return opt.roles.includes(usuario.rol);
  });
 
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Si no hay opciones visibles, no mostrar el menú
  if (opcionesFiltradas.length === 0) return null;
 
  return (
    <div className="ll-nav-item" ref={ref}>
      <button
        className={`ll-nav-btn ${isOpen ? "active" : ""}`}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {item.label}
        <span className={`ll-chevron ${isOpen ? "open" : ""}`}>›</span>
      </button>
 
      <div className={`ll-dropdown ${isOpen ? "visible" : ""}`}>
        <div className="ll-dropdown-inner">
          {opcionesFiltradas.map((opt, i) => (
            <Link
              key={i}
              to={opt.to}
              className="ll-dropdown-link"
              onClick={onClose}
            >
              <span className="ll-link-index">0{i + 1}</span>
              {opt.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
 
function UserMenu() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
 
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);
 
  if (!usuario) {
    return (
      <Link to="/login" className="ll-nav-btn">
        Iniciar sesión
      </Link>
    );
  }
 
  return (
    <div className="ll-nav-item" ref={ref}>
      <button
        className={`ll-nav-btn ll-nav-btn--user ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className="ll-user-rol">{usuario.rol}</span>
        {usuario.nombre}
        <span className={`ll-chevron ${open ? "open" : ""}`}>›</span>
      </button>
 
      <div className={`ll-dropdown ll-dropdown--right ${open ? "visible" : ""}`}>
        <div className="ll-dropdown-inner">
          <div className="ll-user-info">
            <p className="ll-user-name">{usuario.nombre}</p>
            <p className="ll-user-email">{usuario.email}</p>
          </div>
          <div className="ll-dropdown-separator" />
          <button
            className="ll-dropdown-link ll-dropdown-link--danger"
            onClick={() => { logout(); navigate("/login", { replace: true }); setOpen(false); }}
          >
            <span className="ll-link-index">→</span>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
 
function Layout() {
  const [openMenu, setOpenMenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { usuario } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // ← AGREGA ESTO
  useEffect(() => {
    if (usuario && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [usuario, location.pathname, navigate]);

  useEffect(() => { setOpenMenu(null); }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = (i) => setOpenMenu(openMenu === i ? null : i);
 
  return (
    <div className="ll-root">
      <header className={`ll-navbar ${scrolled ? "ll-navbar--shadow" : ""}`}>
        <div className="ll-navbar-inner">
          <Link to="/" className="ll-brand">
            <span className="ll-brand-bracket">[</span>
            LuisLand
            <span className="ll-brand-bracket">]</span>
          </Link>
 
          <nav className="ll-nav">
            {NAV_ITEMS.map((item, i) => (
              <DropdownMenu
                key={i}
                item={item}
                isOpen={openMenu === i}
                onToggle={() => toggle(i)}
                onClose={() => setOpenMenu(null)}
              />
            ))}
            <UserMenu />
          </nav>
        </div>
      </header>
 
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/sobre-mi" element={<SobreMi />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/test1"    element={
          <PrivateRoute rolesPermitidos={["ADMIN", "DEVELOPER", "VISITANTE"]}>
            <Test1 />
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
}
 
function Home() {
  return (
    <main className="ll-hero">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-hero-content">
        <p className="ll-hero-eyebrow">// Sistema activo</p>
        <h1 className="ll-hero-title">
          Bienvenido,
          <br />
          <span className="ll-hero-accent">visitante</span>
        </h1>
        <div className="ll-hero-line" />
      </div>
      <div className="ll-scanline" aria-hidden="true" />
    </main>
  );
}
 
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

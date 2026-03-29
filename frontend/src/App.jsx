import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute    from "./context/PrivateRoute";
import Test1           from "./pages/Test1.jsx";
import SobreMi         from "./pages/SobreMi.jsx";
import Login           from "./pages/Login.jsx";
import GestionUsuarios from "./pages/GestionUsuarios.jsx";
import SpringBoot      from "./pages/SpringBoot.jsx";
import GuiaRapida     from "./pages/GuiaRapida.jsx";

const NAV_ITEMS = [
  {
    label: "Información",
    items: [
      { label: "Sobre mí",  to: "/sobre-mi", roles: null },
      { label: "Opción 2",  to: "/",         roles: null },
      { label: "Opción 3",  to: "/",         roles: null },
      { label: "Opción 4",  to: "/",         roles: null },
    ],
  },
  {
    label: "Utilidades",
    items: [
      { label: "SpringBoot", to: "/springboot", roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 2", to: "/", roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 3", to: "/", roles: ["ADMIN", "DEVELOPER"] },
      { label: "Guia rápida del Website", to: "/guia_rapida_del_website", roles: ["ADMIN", "DEVELOPER"] },
    ],
  },
  {
    label: "Experimentos",
    items: [
      { label: "Test 1",   to: "/test1", roles: ["ADMIN", "DEVELOPER", "STANDARD"] },
      { label: "Opción 2", to: "/",      roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 3", to: "/",      roles: ["ADMIN", "DEVELOPER"] },
      { label: "Opción 4", to: "/",      roles: ["ADMIN", "DEVELOPER"] },
    ],
  },
];

function tieneAcceso(usuario, roles) {
  if (!roles) return true;
  if (!usuario) return false;
  return roles.includes(usuario.rol);
}

function AccessToast({ mensaje, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="ll-toast">
      <span className="ll-toast-icon">🔒</span>
      {mensaje}
    </div>
  );
}

function DropdownMenu({ item, isOpen, onToggle, onClose, onDenied }) {
  const { usuario } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

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
          {item.items.map((opt, i) => {
            const acceso = tieneAcceso(usuario, opt.roles);

            if (acceso) {
              return (
                <Link
                  key={i}
                  to={opt.to}
                  className="ll-dropdown-link"
                  onClick={onClose}
                >
                  <span className="ll-link-index">0{i + 1}</span>
                  {opt.label}
                </Link>
              );
            }

            return (
              <button
                key={i}
                className="ll-dropdown-link ll-dropdown-link--locked"
                onClick={() => { onClose(); onDenied(); }}
              >
                <span className="ll-link-index">0{i + 1}</span>
                {opt.label}
                <span className="ll-lock-icon">🔒</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UserMenu({ onDenied }) {
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

          {/* Info del usuario */}
          <div className="ll-user-info">
            <p className="ll-user-name">{usuario.nombre}</p>
            <p className="ll-user-email">{usuario.email}</p>
          </div>

          <div className="ll-dropdown-separator" />

          {/* Gestión de usuarios — solo ADMIN */}
          {usuario.rol === "ADMIN" ? (
            <Link
              to="/gestion-usuarios"
              className="ll-dropdown-link"
              onClick={() => setOpen(false)}
            >
              <span className="ll-link-index">01</span>
              Gestión de usuarios
            </Link>
          ) : (
            <button
              className="ll-dropdown-link ll-dropdown-link--locked"
              onClick={() => { setOpen(false); onDenied(); }}
            >
              <span className="ll-link-index">01</span>
              Gestión de usuarios
              <span className="ll-lock-icon">🔒</span>
            </button>
          )}

          <div className="ll-dropdown-separator" />

          {/* Cerrar sesión */}
          <button
            className="ll-dropdown-link ll-dropdown-link--danger"
            onClick={() => { logout(); navigate("/"); setOpen(false); }}
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
  const [toast, setToast] = useState(false);
  const { usuario } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario && location.pathname === "/login") {
      navigate("/", { replace: true });
    }
  }, [usuario]);

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
                onDenied={() => setToast(true)}
              />
            ))}
            <UserMenu onDenied={() => setToast(true)} />
          </nav>
        </div>
      </header>

      {toast && (
        <AccessToast
          mensaje="Se requiere un nivel de usuario mayor para acceder a esta página"
          onClose={() => setToast(false)}
        />
      )}

      <Routes>

        <Route path="/"         element={<Home />} />
        <Route path="/sobre-mi" element={<SobreMi />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/test1"    element={
          <PrivateRoute rolesPermitidos={["ADMIN", "DEVELOPER", "STANDARD"]}>
            <Test1 />
          </PrivateRoute>
        } />
        <Route path="/gestion-usuarios" element={
          <PrivateRoute rolesPermitidos={["ADMIN"]}>
            <GestionUsuarios />
          </PrivateRoute>
        } />

        <Route path="/springboot" element={
          <PrivateRoute rolesPermitidos={["ADMIN", "DEVELOPER"]}>
            <SpringBoot />
          </PrivateRoute>
        } />

        <Route path="/guia_rapida_del_website" element={
          <PrivateRoute rolesPermitidos={["ADMIN", "DEVELOPER"]}>
            <GuiaRapida/>
          </PrivateRoute>
        } />

      </Routes>
    </div>
  );
}

function Home() {
  const { usuario } = useAuth();

  const primerNombre = usuario
    ? usuario.nombre.split(" ")[0]
    : "visitante";

  const etiquetaRol = usuario
    ? `// ${usuario.rol} USER`
    : "// Sistema activo";

  return (
    <main className="ll-hero">
      <div className="ll-hero-grid" aria-hidden="true" />
      <div className="ll-hero-content">
        <p className="ll-hero-eyebrow">{etiquetaRol}</p>
        <h1 className="ll-hero-title">
          Bienvenido,
          <br />
          <span className="ll-hero-accent">{primerNombre}</span>
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